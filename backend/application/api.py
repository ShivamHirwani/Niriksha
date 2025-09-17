import os
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from .auth import supabase  # reuse your existing client
from dotenv import load_dotenv
from datetime import timedelta
from .utils import validate_email, validate_password
import bcrypt

class MentorApi(Resource):
    def get(self):
        return {"message": "Mentor API is working!"}, 200
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        email_password = data.get("email_password")
        role = data.get("role", "mentor")

        # Validate presence
        if not email or not password or not name:
            return {"message": "Email, password, and name are required"}, 400

        # Validate formats
        if not validate_email(email, "gmail.com"):
            return {"message": "Invalid email format"}, 400
        if not validate_password(password):
            return {"message": "Invalid password format"}, 400

        # Check duplicate
        existing = supabase.table("mentor").select("id").eq("email", email).execute()
        if existing.data and len(existing.data) > 0:
            return {"message": "Email already exists"}, 409  # 409 Conflict

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        try:
            response = supabase.table("mentor").insert({
                "name": name,
                "email": email,
                "password": hashed_password.decode("utf-8"),
                "email_password": email_password,
                "role": role
            }).execute()

            return {"message": "Mentor created successfully"}, 201

        except Exception as e:
            return {"message": "Error creating mentor", "error": str(e)}, 500

    @jwt_required()
    def delete(self):
        data = request.get_json()
        email = data.get("email")

        if not email:
            return {"message": "Email is required"}, 400

        try:
            # Check if mentor exists
            check = supabase.table("mentor").select("id").eq("email", email).execute()
            if not check.data:
                return {"message": "Mentor not found"}, 404

            # Delete mentor
            response = supabase.table("mentor").delete().eq("email", email).execute()

            return {"message": f"Mentor with email {email} deleted successfully"}, 200

        except Exception as e:
            return {"message": "Error deleting mentor", "error": str(e)}, 500

