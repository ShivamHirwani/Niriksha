import os, json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import gspread
from supabase import create_client
import joblib
from sklearn.preprocessing import LabelEncoder


load_dotenv()
json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

## we are gonna use Supabase--> Postgres + API + Auth + File Storage (backend-as-a-service).
# Free tier: 500 MB DB storage, 50k monthly requests.
#1. connect to supabase
supabase= create_client(os.getenv('SUPABASE_PROJECT_URL'), os.getenv('SUPABASE_API_KEY'))

# 2. connect with google sheets
gc= gspread.service_account(filename= json_path)
# sheet = gc.open("Attendance Data").worksheet("Sheet1")

for sheet_name in ['Students', 'Attendance Data', 'Assessments', 'Fees']:
    sheet = gc.open(f"{sheet_name}").worksheet("Sheet1")

    records= sheet.get_all_records()
    df= pd.DataFrame(records)

# 3. Insert into attendance table 
# * delete every thing in  full refresh so what ever mentors will change keep maintain

    if sheet_name== 'Students':
        supabase.table('students').delete().neq("student_id", "").execute()

        for _, row in df.iterrows():
            supabase.table('students').insert({
            'student_id': str(row['student_id']),
            'student_name': str(row['student_name']),
            'class': str(row['class']),
            'batch': str(row['batch']),
            'mentor_email': str(row['mentor_email']),
            'parent_email': str(row['parent_email']),
            'parent_phone': str(row['parent_phone'])
            }).execute()
        
    elif sheet_name== 'Attendance Data':
        supabase.table('attendance').delete().neq("student_id", "").execute()

        for _, row in df.iterrows():
            supabase.table('attendance').insert({
                'student_id':str(row['student_id']),
                'classes_attended':int(row['classes_attended']),
                'total_classes': int(row['total_classes']),
                'attendance_percentage': float(row['classes_attended']/row['total_classes']*100)
            }).execute()
    elif sheet_name== 'Assessments':
        supabase.table('assessments').delete().neq("student_id", "").execute()

        for _, row in df.iterrows():
            supabase.table('assessments').insert({
                'assessment_id': int(row['assessment_id']),
                'student_id': str(row['student_id']),
                'q1_Average_Test_Score': int(row['q1_Average_Test_Score']),
                'q2_Average_Test_Score': int(row['q2_Average_Test_Score']),
                'q3_Average_Test_Score': int(row['q3_Average_Test_Score']),
                'q1_Max_score': int(row['q1_Max_score']),
                'q2_Max_score': int(row['q2_Max_score']),
                'q3_Max_score': int(row['q3_Max_score']),
                'q1_Test_Score_Trend': int(row['q1_Average_Test_Score'])- int(row['q1_Max_score']),
                'q2_Test_Score_Trend': int(row['q2_Average_Test_Score'])-int(row['q2_Max_score']),
                'q3_Test_Score_Trend': int(row['q3_Average_Test_Score'])-int(row['q3_Max_score']),
                'q1_Attempts_Used': int(row['q1_Attempts_Used']),
                'q2_Attempts_Used': int(row['q2_Attempts_Used']),
                'q3_Attempts_Used': int(row['q3_Attempts_Used']),

            }).execute()

    else:
        supabase.table('fees').delete().neq("student_id", "").execute()

        for _, row in df.iterrows():
            supabase.table('fees').insert({
                'id':str(row['id']),
                'student_id':int(row['student_id']),
                'fee_status': int(row['fee_status']),
                'fee_due_amount': int(row['fee_due_amount']),
                'fee_due_date': int(row['fee_due_date'])
            }).execute()

    print(df)



model= joblib.load('Student_risk_model.pkl')

val= model.predict([[91,	42,	1	,0	,1,	0]])
