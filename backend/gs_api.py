import os, json
import datetime
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
    sheet = gc.open(f"{sheet_name}").get_worksheet(0)

    records= sheet.get_all_records()
    df= pd.DataFrame(records)

# 3. Insert into attendance table 
# * delete every thing in  full refresh so what ever mentors will change keep maintain

    if sheet_name== 'Students':
        supabase.table('students').delete().neq("student_id", "").execute()

        df = df.astype(object).where(pd.notnull(df), None)
        rows_to_insert=[]
        for _, row in df.iterrows():
            rows_to_insert.append({
            'student_id': str(row['student_id']),
            'student_name': str(row['student_name']),
            'class': str(row['class']),
            'batch': str(row['batch']),
            'mentor_email': str(row['mentor_email']),
            'parent_email': str(row['parent_email']),
            'parent_phone': str(row['parent_phone'])
            })
        supabase.table('students').insert(rows_to_insert).execute()


    elif sheet_name== 'Attendance Data':
        supabase.table('attendance').delete().neq("student_id", "").execute()

        df = df.astype(object).where(pd.notnull(df), None)
        rows_to_insert=[]
        for _, row in df.iterrows():
            parsed_date = datetime.datetime.strptime(str(row['date']), "%d-%m-%Y").date()

            rows_to_insert.append({
                'student_id':str(row['student_id']),
                'classes_attended':int(row['classes_attended']),
                'total_classes': int(row['total_classes']),
                'attendance_percentage': float(row['classes_attended']/row['total_classes']*100),
                'date': parsed_date.isoformat()
            })
        supabase.table('attendance').insert(rows_to_insert).execute()
    elif sheet_name== 'Assessments':
        supabase.table('assessments').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert=[]
        for _, row in df.iterrows():
            parsed_date = datetime.datetime.strptime(str(row['date']), "%d-%m-%Y").date()

            rows_to_insert.append({
                'assessment_id': str(row['assessment_id']),
                'student_id': str(row['student_id']),
                'q1_score':int(row['q1_score']),
                'q2_score':int(row['q2_score']),
                'q3_score':int(row['q3_score']),
                'q1_average_test_score': row['q1_average_test_score'],
                'q2_average_test_score': int(row['q2_average_test_score']),
                'q3_average_test_score': int(row['q3_average_test_score']),
                'q1_max_score': int(row['q1_max_score']),
                'q2_max_score': int(row['q2_max_score']),
                'q3_max_score': int(row['q3_max_score']),
                'q1_test_score_trend': int(row['q1_score'])- int(row['q1_max_score']),
                'q2_test_score_trend': int(row['q2_score'])-int(row['q2_max_score']),
                'q3_test_score_trend': int(row['q3_score'])-int(row['q3_max_score']),
                'q1_attempts_used': int(row['q1_attempts_used']),
                'q2_attempts_used': int(row['q2_attempts_used']),
                'q3_attempts_used': int(row['q3_attempts_used']),
                'date': parsed_date.isoformat()
            })
        supabase.table('assessments').insert(rows_to_insert).execute()

    else:
        supabase.table('fees').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert=[]
        for _, row in df.iterrows():
            rows_to_insert.append({
                'id':str(row['id']),
                'student_id':int(row['student_id']),
                'fee_status': str(row['fee_status']),
                'fee_due_amount': int(row['fee_due_amount']),
                'fee_due_date': int(row['fee_due_date'])
            })
        supabase.table('fees').insert(rows_to_insert).execute()




model= joblib.load('Student_risk_model.pkl')




####################### fetching table from supabase 
#1. Fetch Students
students= supabase.table('students').select('*').execute()
df_students= pd.DataFrame(students.data)

#2. Fetch Attendance
attendance= supabase.table('attendance').select('*').execute()
df_attendance= pd.DataFrame(attendance.data)

#3. Fetch Assessments
assessments= supabase.table('assessments').select('*').execute()
df_assessments= pd.DataFrame(assessments.data)

#4. Fetch Fees
fees= supabase.table('fees').select('*').execute()
df_fees= pd.DataFrame(fees.data)


df_attendance_info= df_attendance[['student_id','attendance_percentage' ]]
df_assessments_info= df_assessments[['student_id', ]]