import os
from dotenv import load_dotenv
load_dotenv()  # load .env values

class Config():
    DEBUG = False
    # SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    DEBUG = True

    # Connect directly to Supabase Postgres
    # SQLALCHEMY_DATABASE_URI = os.getenv("CONNECTION_STR")
    
    # SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security (for Flask-Security-Too)
    SECRET_KEY = "this-is-a-secret-key"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "this-is-a-salt-key"
    WTF_CSRF_ENABLED = False

    # JWT
    JWT_SECRET_KEY = "your-very-secret-key"
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    JWT_REFRESH_TOKEN_EXPIRES = 86400
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    SECURITY_TOKEN_AUTHENTICATION_HEADER = None
