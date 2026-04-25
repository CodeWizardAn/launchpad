from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
salary_model = joblib.load(os.path.join(BASE_DIR, 'models', 'salary_model.pkl'))
le_role      = joblib.load(os.path.join(BASE_DIR, 'models', 'le_role.pkl'))
le_city      = joblib.load(os.path.join(BASE_DIR, 'models', 'le_city.pkl'))

app = FastAPI(title="Launchpad API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class SalaryRequest(BaseModel):
    role: str
    city: str
    experience: int
    cgpa: float
    skills: int
    ctc: float

@app.get("/")
def root():
    return {"message": "Launchpad backend is alive"}

@app.get("/health")
def health():
    return {"status": "ok"}

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
            {"title": "DSA Assignment", "due": "Tomorrow",  "subject": "CS301"},
            {"title": "ML Project Report", "due": "3 days",  "subject": "CS401"},
            {"title": "Resume Update",    "due": "This week","subject": "Career"},
        ]
    }
class Subject(BaseModel):
    name: str
    grade: float      # grade points e.g. 9, 8, 7
    credits: int      # credit hours e.g. 4, 3, 2

class CGPARequest(BaseModel):
    subjects: List[Subject]
    current_cgpa: float
    completed_credits: int

@app.post("/cgpa/calculate")
def calculate_cgpa(data: CGPARequest):
    # calculate this semester GPA
    total_points = sum(s.grade * s.credits for s in data.subjects)
    total_credits = sum(s.credits for s in data.subjects)
    
    if total_credits == 0:
        return {"error": "Add at least one subject"}
    
    semester_gpa = round(total_points / total_credits, 2)

    # calculate new cumulative CGPA
    old_points = data.current_cgpa * data.completed_credits
    new_points = old_points + total_points
    new_total_credits = data.completed_credits + total_credits
    new_cgpa = round(new_points / new_total_credits, 2)

    # flag weak subjects (below 6)
    weak = [s.name for s in data.subjects if s.grade < 6]

    # simple prediction: if you score same next sem
    predicted = round((new_points + total_points) / (new_total_credits + total_credits), 2)

    return {
        "semester_gpa": semester_gpa,
        "new_cgpa": new_cgpa,
        "predicted_next": predicted,
        "weak_subjects": weak,
        "total_credits_after": new_total_credits
    }
@app.get("/salary/options")
def salary_options():
    return {
        "roles":  le_role.classes_.tolist(),
        "cities": le_city.classes_.tolist()
    }

@app.post("/salary/predict")
def predict_salary(data: SalaryRequest):
    role_enc = le_role.transform([data.role])[0]
    city_enc = le_city.transform([data.city])[0]
    features = np.array([[role_enc, city_enc, data.experience, data.cgpa, data.skills]])
    predicted_ctc = float(salary_model.predict(features)[0])

    ctc = data.ctc if data.ctc > 0 else predicted_ctc
    pf = 21600
    gross = ctc - pf
    standard_ded = 50000
    taxable = max(gross - standard_ded, 0)

    if taxable <= 300000:
        tax = 0
    elif taxable <= 600000:
        tax = (taxable - 300000) * 0.05
    elif taxable <= 900000:
        tax = 15000 + (taxable - 600000) * 0.10
    elif taxable <= 1200000:
        tax = 45000 + (taxable - 900000) * 0.15
    elif taxable <= 1500000:
        tax = 90000 + (taxable - 1200000) * 0.20
    else:
        tax = 150000 + (taxable - 1500000) * 0.30

    cess = tax * 0.04
    total_tax = tax + cess
    employee_pf = 21600
    annual_inhand = gross - total_tax - employee_pf
    monthly = round(annual_inhand / 12)

    return {
        "predicted_ctc":     round(predicted_ctc),
        "annual_inhand":     round(annual_inhand),
        "monthly_inhand":    monthly,
        "tax_paid":          round(total_tax),
        "pf_deduction":      employee_pf,
        "effective_tax_pct": round((total_tax / gross) * 100, 1) if gross > 0 else 0
    }