from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv
import joblib
import numpy as np
import os
from database import get_db, Task, Note, Job

from database import get_db, Task, Note

# ── Config ────────────────────────────────────────────────────
load_dotenv()

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
salary_model = joblib.load(os.path.join(BASE_DIR, 'models', 'salary_model.pkl'))
le_role      = joblib.load(os.path.join(BASE_DIR, 'models', 'le_role.pkl'))
le_city      = joblib.load(os.path.join(BASE_DIR, 'models', 'le_city.pkl'))

ai_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="Launchpad API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health ────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Launchpad backend is alive"}

@app.get("/health")
def health():
    return {"status": "ok"}

# ── Dashboard ─────────────────────────────────────────────────
@app.get("/dashboard")
def get_dashboard():
    return {
        "name": "Advaith",
        "cgpa": 9.86,
        "tasks_pending": 5,
        "tasks_done": 12,
        "notes_count": 23,
        "vault_files": 7,
        "streak_days": 4,
        "upcoming_deadlines": [
            {"title": "DSA Assignment",   "due": "Tomorrow",  "subject": "CS301"},
            {"title": "ML Project Report","due": "3 days",    "subject": "CS401"},
            {"title": "Resume Update",    "due": "This week", "subject": "Career"},
        ]
    }

# ── CGPA ──────────────────────────────────────────────────────
class Subject(BaseModel):
    name: str
    grade: float
    credits: int

class CGPARequest(BaseModel):
    subjects: List[Subject]
    current_cgpa: float
    completed_credits: int

@app.post("/cgpa/calculate")
def calculate_cgpa(data: CGPARequest):
    total_points  = sum(s.grade * s.credits for s in data.subjects)
    total_credits = sum(s.credits for s in data.subjects)

    if total_credits == 0:
        return {"error": "Add at least one subject"}

    semester_gpa      = round(total_points / total_credits, 2)
    old_points        = data.current_cgpa * data.completed_credits
    new_points        = old_points + total_points
    new_total_credits = data.completed_credits + total_credits
    new_cgpa          = round(new_points / new_total_credits, 2)
    weak              = [s.name for s in data.subjects if s.grade < 6]
    predicted         = round((new_points + total_points) / (new_total_credits + total_credits), 2)

    return {
        "semester_gpa":       semester_gpa,
        "new_cgpa":           new_cgpa,
        "predicted_next":     predicted,
        "weak_subjects":      weak,
        "total_credits_after": new_total_credits
    }

# ── Salary ────────────────────────────────────────────────────
class SalaryRequest(BaseModel):
    role: str
    city: str
    experience: int
    cgpa: float
    skills: int
    ctc: float

@app.get("/salary/options")
def salary_options():
    return {
        "roles":  le_role.classes_.tolist(),
        "cities": le_city.classes_.tolist()
    }

@app.post("/salary/predict")
def predict_salary(data: SalaryRequest):
    role_enc      = le_role.transform([data.role])[0]
    city_enc      = le_city.transform([data.city])[0]
    features      = np.array([[role_enc, city_enc, data.experience, data.cgpa, data.skills]])
    predicted_ctc = float(salary_model.predict(features)[0])

    ctc          = data.ctc if data.ctc > 0 else predicted_ctc
    pf           = 21600
    gross        = ctc - pf
    taxable      = max(gross - 50000, 0)

    if taxable <= 300000:        tax = 0
    elif taxable <= 600000:      tax = (taxable - 300000) * 0.05
    elif taxable <= 900000:      tax = 15000  + (taxable - 600000)  * 0.10
    elif taxable <= 1200000:     tax = 45000  + (taxable - 900000)  * 0.15
    elif taxable <= 1500000:     tax = 90000  + (taxable - 1200000) * 0.20
    else:                        tax = 150000 + (taxable - 1500000) * 0.30

    total_tax     = tax * 1.04
    annual_inhand = gross - total_tax - 21600
    monthly       = round(annual_inhand / 12)

    return {
        "predicted_ctc":      round(predicted_ctc),
        "annual_inhand":      round(annual_inhand),
        "monthly_inhand":     monthly,
        "tax_paid":           round(total_tax),
        "pf_deduction":       21600,
        "effective_tax_pct":  round((total_tax / gross) * 100, 1) if gross > 0 else 0
    }

# ── Tasks ─────────────────────────────────────────────────────
class TaskCreate(BaseModel):
    title:    str
    subject:  str = ""
    priority: str = "medium"
    due_date: str = ""

class TaskUpdate(BaseModel):
    done: bool

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.created_at.desc()).all()

@app.post("/tasks")
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**data.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.patch("/tasks/{task_id}")
def toggle_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    task.done = data.done
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    db.delete(task)
    db.commit()
    return {"deleted": task_id}

# ── Notes ─────────────────────────────────────────────────────
class NoteCreate(BaseModel):
    title:   str = "Untitled"
    content: str

@app.get("/notes")
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).order_by(Note.created_at.desc()).all()

@app.post("/notes")
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    summary = ""
    tags    = ""
    if len(data.content.strip()) > 50:
        response = ai_client.chat.completions.create(
            model    = "llama-3.3-70b-versatile",
            messages = [{  
                "role":    "user",
                "content": f"""Summarize this note in 1-2 sentences. Then suggest 3 short tags.
Reply in this exact format:
SUMMARY: <summary here>
TAGS: tag1, tag2, tag3

Note:
{data.content}"""
            }]
        )
        text = response.choices[0].message.content
        for line in text.split('\n'):
            if line.startswith('SUMMARY:'):
                summary = line.replace('SUMMARY:', '').strip()
            elif line.startswith('TAGS:'):
                tags = line.replace('TAGS:', '').strip()

    note = Note(title=data.title, content=data.content, summary=summary, tags=tags)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        return {"error": "Not found"}
    db.delete(note)
    db.commit()
    return {"deleted": note_id}

# ── Jobs ──────────────────────────────────────────────────────
class JobCreate(BaseModel):
    title:    str
    company:  str = ""
    location: str = ""
    type:     str = "internship"
    url:      str = ""
    notes:    str = ""

class JobStatusUpdate(BaseModel):
    status: str

@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).order_by(Job.created_at.desc()).all()

@app.post("/jobs")
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    job = Job(**data.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@app.patch("/jobs/{job_id}")
def update_job_status(job_id: int, data: JobStatusUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Not found"}
    job.status = data.status
    db.commit()
    db.refresh(job)
    return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Not found"}
    db.delete(job)
    db.commit()
    return {"deleted": job_id}