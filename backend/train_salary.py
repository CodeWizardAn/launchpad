import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
import joblib, os, re

# ── Load real dataset for roles + cities ──────────────────────
real = pd.read_csv('fresher_jobs.csv')

# Extract city from location string e.g. "Bengaluru, Karnataka" → "Bengaluru"
real['city'] = real['Location'].str.split(',').str[0].str.strip()

# Normalize job titles
real['role'] = real['Job Title'].str.strip()

# Keep only rows with a salary value
def parse_salary(s):
    if pd.isna(s) or 'Not specified' in str(s):
        return None
    # extract all numbers from string
    nums = re.findall(r'[\d,]+', str(s).replace(',', ''))
    nums = [int(n) for n in nums if len(n) >= 4]
    if not nums:
        return None
    avg = sum(nums) / len(nums)
    # if monthly, convert to annual
    if 'month' in str(s).lower():
        avg = avg * 12
    return int(avg)

real['ctc'] = real['Salary'].apply(parse_salary)
real_clean = real.dropna(subset=['ctc'])
print(f"Real rows with salary: {len(real_clean)}")

# ── Synthetic data to fill the gaps ───────────────────────────
np.random.seed(42)
n = 800

# Use REAL roles and cities from the dataset
roles = real['role'].value_counts().head(15).index.tolist()
cities = real['city'].value_counts().head(10).index.tolist()

data = {
    'role':       np.random.choice(roles, n),
    'city':       np.random.choice(cities, n),
    'experience': np.random.choice([0,1,2,3], n),  # fresher focused
    'cgpa':       np.round(np.random.uniform(6.0, 10.0, n), 1),
    'skills':     np.random.randint(2, 10, n),
}

base_salary = {r: np.random.randint(250000, 800000) for r in roles}
synth_salaries = []
for i in range(n):
    b   = base_salary[data['role'][i]]
    exp = data['experience'][i] * 60000
    cgpa_bonus  = (data['cgpa'][i] - 6.0) * 40000
    skill_bonus = data['skills'][i] * 15000
    noise = np.random.randint(-80000, 80000)
    synth_salaries.append(max(int(b + exp + cgpa_bonus + skill_bonus + noise), 180000))

synth_df = pd.DataFrame(data)
synth_df['ctc'] = synth_salaries

# ── Combine real + synthetic ───────────────────────────────────
real_clean_slim = real_clean[['role','city','ctc']].copy()
real_clean_slim['experience'] = 0
real_clean_slim['cgpa']       = 7.5
real_clean_slim['skills']     = 4

combined = pd.concat([synth_df, real_clean_slim], ignore_index=True)
print(f"Total training rows: {len(combined)}")

# ── Encode + Train ─────────────────────────────────────────────
le_role = LabelEncoder()
le_city = LabelEncoder()
combined['role_enc'] = le_role.fit_transform(combined['role'])
combined['city_enc'] = le_city.fit_transform(combined['city'])

X = combined[['role_enc','city_enc','experience','cgpa','skills']]
y = combined['ctc']

model = GradientBoostingRegressor(n_estimators=150, random_state=42)
model.fit(X, y)

os.makedirs('models', exist_ok=True)
joblib.dump(model,   'models/salary_model.pkl')
joblib.dump(le_role, 'models/le_role.pkl')
joblib.dump(le_city, 'models/le_city.pkl')

print("Done! Roles:", le_role.classes_.tolist())
print("Cities:", le_city.classes_.tolist())