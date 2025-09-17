import os
from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, create_refresh_token
from supabase import create_client
from dotenv import load_dotenv
from datetime import timedelta
from .utils import validate_email, validate_password
import bcrypt

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase = create_client(
    os.getenv("SUPABASE_PROJECT_URL"),
    os.getenv("SUPABASE_API_KEY")
)

class MentorLoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validate presence
        if not email or not password:
            return {"message": "Email and password are required"}, 400

        # Validate email + password formats
        if not validate_email(email, "gmail.com"):
            return {"message": "Invalid email format"}, 400

        if not validate_password(password):
            return {"message": "Invalid password format"}, 400

        try:
            response = supabase.table("mentor").select("*").eq("email", email).execute()
            if not response.data:
                return {"message": "Invalid email or password"}, 401

            mentor = response.data[0]

            print(password)
            # Check hashed password
            if not bcrypt.checkpw(password.encode("utf-8"), mentor["password"].encode("utf-8")):
                return {"message": "Invalid email or password"}, 401

            # Generate JWT tokens
            access_token = create_access_token(
                identity=str(mentor["id"]),      # <--- only id as string
                expires_delta=timedelta(hours=1)
            )
            refresh_token = create_refresh_token(identity=str(mentor["id"]))

            # ✅ Return dict only
            return {
                "message": "Login successful",
                "mentor": {
                    "id": mentor["id"],
                    "name": mentor["name"],
                    "email": mentor["email"]
                },
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 200

        except Exception as e:
            return {"message": "Error logging in", "error": str(e)}, 500
