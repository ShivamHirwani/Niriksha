import os, json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import gspread
from supabase import create_client
from oauth2client.service_account import ServiceAccountCredentials
import joblib
from sklearn.preprocessing import LabelEncoder


load_dotenv()
json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# 1. connect with google sheets
scope= ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds= ServiceAccountCredentials.from_json_keyfile_name(json_path, scope)
client= gspread.authorize(creds)

sheet= client.open("Attendance Data").worksheet('Sheet1')
records= sheet.get_all_records()
df= pd.DataFrame(records)

print(df)
## we are gonna use Supabase--> Postgres + API + Auth + File Storage (backend-as-a-service).
# Free tier: 500 MB DB storage, 50k monthly requests.

#2. connect to supabase
supabase= create_client(os.getenv('SUPABASE_PROJECT_URL'), os.getenv('SUPABASE_API_KEY'))

# 3. Insert into attendance table
# * delete every thing in  full refresh so what ever mentors will change keep maintain
supabase.table('attendance').delete().neq("student_id", "").execute()

for _, row in df.iterrows():
    supabase.table('attendance').insert({
        'student_id':str(row['student_id']),
        'classes_attended':int(row['classes_attended']),
        'total_classes': int(row['total_classes']),
        'attendance_percentage': float(row['classes_attended']/row['total_classes']*100)
    }).execute()

model= joblib.load('Student_risk_model.pkl')

val= model.predict([[91,	42,	1	,0	,1,	0]])
