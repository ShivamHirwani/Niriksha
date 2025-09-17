import os
import datetime
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import gspread
from supabase import create_client
import joblib
from sklearn.preprocessing import LabelEncoder
import json
from google.oauth2.service_account import Credentials

load_dotenv()

## Connect to Supabase
supabase = create_client(os.getenv('SUPABASE_PROJECT_URL'), os.getenv('SUPABASE_API_KEY'))

## --- Fix for Render: load Google credentials from ENV instead of file ---
service_account_info = json.loads(os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"))
credentials = Credentials.from_service_account_info(service_account_info)

# gspread auth
gc = gspread.authorize(credentials)

# Loop through Google Sheets
for sheet_name in ['Students', 'Attendance Data', 'Assessments', 'Fees']:
    sheet = gc.open(f"{sheet_name}").get_worksheet(0)
    records = sheet.get_all_records()
    df = pd.DataFrame(records)

    if sheet_name == 'Students':
        students_df = df
        supabase.table('students').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert = []
        for _, row in df.iterrows():
            rows_to_insert.append({
                'student_id': str(row['student_id']),
                'student_name': str(row['student_name']),
                'program': str(row['program']),
                'gpa': int(row['gpa']),
                'class': str(row['class']),
                'batch': str(row['batch']),
                'mentor_email': str(row['mentor_email']),
                'parent_email': str(row['parent_email']),
                'parent_phone': str(row['parent_phone'])
            })
        supabase.table('students').insert(rows_to_insert).execute()

    elif sheet_name == 'Attendance Data':
        attendance_df = df
        supabase.table('attendance').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert = []
        for _, row in df.iterrows():
            parsed_date = datetime.datetime.strptime(str(row['date']), "%d-%m-%Y").date()
            rows_to_insert.append({
                'student_id': str(row['student_id']),
                'classes_attended': int(row['classes_attended']),
                'total_classes': int(row['total_classes']),
                'attendance_percentage': float(row['classes_attended'] / row['total_classes'] * 100),
                'date': parsed_date.isoformat()
            })
        supabase.table('attendance').insert(rows_to_insert).execute()

    elif sheet_name == 'Assessments':
        assessments_df = df
        supabase.table('assessments').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert = []
        for _, row in df.iterrows():
            parsed_date = datetime.datetime.strptime(str(row['date']), "%d-%m-%Y").date()
            rows_to_insert.append({
                'assessment_id': str(row['assessment_id']),
                'student_id': str(row['student_id']),
                'q1_score': int(row['q1_score']),
                'q2_score': int(row['q2_score']),
                'q3_score': int(row['q3_score']),
                'q1_average_test_score': row['q1_average_test_score'],
                'q2_average_test_score': int(row['q2_average_test_score']),
                'q3_average_test_score': int(row['q3_average_test_score']),
                'q1_max_score': int(row['q1_max_score']),
                'q2_max_score': int(row['q2_max_score']),
                'q3_max_score': int(row['q3_max_score']),
                'q1_test_score_trend': int(row['q1_score']) - int(row['q1_max_score']),
                'q2_test_score_trend': int(row['q2_score']) - int(row['q2_max_score']),
                'q3_test_score_trend': int(row['q3_score']) - int(row['q3_max_score']),
                'q1_attempts_used': int(row['q1_attempts_used']),
                'q2_attempts_used': int(row['q2_attempts_used']),
                'q3_attempts_used': int(row['q3_attempts_used']),
                'date': parsed_date.isoformat()
            })
        supabase.table('assessments').insert(rows_to_insert).execute()

    else:
        fees_df = df
        supabase.table('fees').delete().neq("student_id", "").execute()
        df = df.astype(object).where(pd.notnull(df), None)

        rows_to_insert = []
        for _, row in df.iterrows():
            rows_to_insert.append({
                'id': str(row['id']),
                'student_id': int(row['student_id']),
                'fee_status': str(row['fee_status']),
                'fee_due_amount': int(row['fee_due_amount']),
                'fee_due_date': int(row['fee_due_date'])
            })
        supabase.table('fees').insert(rows_to_insert).execute()

# Fetch data from Supabase
students = supabase.table('students').select('*').execute()
df_students = pd.DataFrame(students.data)

attendance = supabase.table('attendance').select('*').execute()
df_attendance = pd.DataFrame(attendance.data)

assessments = supabase.table('assessments').select('*').execute()
df_assessments = pd.DataFrame(assessments.data)

fees = supabase.table('fees').select('*').execute()
df_fees = pd.DataFrame(fees.data)

df_attendance_info = df_attendance[['student_id', 'attendance_percentage']]
df_assessments_info = df_assessments.drop(
    ['assessment_id', 'q1_score', 'q2_score', 'q3_score', 'q1_max_score',
     'q2_max_score', 'q3_max_score', 'date'], axis=1)
df_fees_info = df_fees.drop(['id', 'fee_due_amount'], axis=1)

df_with_nan = (
    df_students
        .merge(df_attendance_info, on='student_id', how='left')
        .merge(df_assessments_info, on='student_id', how='left')
        .merge(df_fees_info, on='student_id', how='left')
)

df_filled = df_with_nan.fillna({
    'attendance_percentage': df_attendance_info['attendance_percentage'].mean(),
    'q1_average_test_score': df_assessments_info['q1_average_test_score'].mean(),
    'q2_average_test_score': df_assessments_info['q2_average_test_score'].mean(),
    'q3_average_test_score': df_assessments_info['q3_average_test_score'].mean(),
    'q1_test_score_trend': df_assessments_info['q1_test_score_trend'].mode()[0],
    'q2_test_score_trend': df_assessments_info['q2_test_score_trend'].mode()[0],
    'q3_test_score_trend': df_assessments_info['q3_test_score_trend'].mode()[0],
    'q1_attempts_used': df_assessments_info['q1_attempts_used'].mode()[0],
    'q2_attempts_used': df_assessments_info['q2_attempts_used'].mode()[0],
    'q3_attempts_used': df_assessments_info['q3_attempts_used'].mode()[0],
    'fee_status': df_fees_info['fee_status'].mode()[0],
    'fee_due_date': df_fees_info['fee_due_date'].mode()[0]
})

df = df_filled.drop(['gpa', 'class', 'batch', 'mentor_email', 'parent_email', 'parent_phone'], axis=1)

le = LabelEncoder()
df['fee_status'] = le.fit_transform(df['fee_status'])

model = joblib.load('Student_risk_model.pkl')
y_predict = model.predict_proba(df.drop(['student_id', 'student_name', 'program'], axis=1).values)

df['high_risk'] = y_predict[:, 2] * 100
df['medium_risk'] = y_predict[:, 1] * 100
df['low_risk'] = y_predict[:, 0] * 100

final_df = df
