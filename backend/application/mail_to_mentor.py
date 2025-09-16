import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime
from flask import request, jsonify
from flask_restful import Resource
from .auth import supabase  # reuse your existing client
from flask_jwt_extended import jwt_required

class SendEmailToStudentsResource(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()
            mentor_id = data.get("mentor_id")
            student_ids = data.get("student_ids", [])
            message_template = data.get("message")

            # --- Validate ---
            if not mentor_id or not student_ids or not message_template:
                return {"message": "mentor_id, student_ids, and message are required"}, 400

            # --- Fetch mentor credentials ---
            mentor_resp = supabase.table("mentor").select("email,email_password").eq("id", mentor_id).execute()
            if not mentor_resp.data or len(mentor_resp.data) == 0:
                return {"message": "Mentor not found"}, 404

            mentor = mentor_resp.data[0]
            email_sender = mentor["email"]
            email_password = mentor["email_password"]

            if not email_sender or not email_password:
                return {"message": "Mentor email credentials not configured"}, 400

            # --- Fetch students info ---
            students_resp = supabase.table("students").select("student_id,student_name,parent_email").in_("student_id", student_ids).execute()
            students = students_resp.data
            if not students or len(students) == 0:
                return {"message": "No students found for given IDs"}, 404

            # --- SMTP setup ---
            context = ssl.create_default_context()
            sent_count = 0

            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
                smtp.login(email_sender, email_password)

                for student in students:
                    name = student["student_name"]
                    to_email = student["parent_email"]
                    body = message_template.replace("{name}", name)

                    em = EmailMessage()
                    em["From"] = email_sender
                    em["To"] = to_email
                    em["Subject"] = "Message from your Mentor"
                    em.set_content(body)

                    smtp.send_message(em)
                    sent_count += 1
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Sent to {to_email}")

            return {
                "message": f"Emails sent successfully to {sent_count} students",
                "mentor_id": mentor_id
            }, 200

        except Exception as e:
            return {"message": "Failed to send emails", "error": str(e)}, 500
