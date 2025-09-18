from mimetypes import init

from flask import Flask, jsonify
from flask_cors import CORS
from gs_api import final_df, students_df, attendance_df, assessments_df, fees_df
from flask_jwt_extended import JWTManager
from application.resources import init_api
from application.config import LocalDevelopmentConfig
from application.resources import init_api


def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    # --- Initialize extensions ---
    jwt = JWTManager(app)
    init_api(app)
    
    return app


app = create_app()

# app= Flask(__name__)
CORS(app)






if __name__== '__main__':
    app.run(debug=True, port=5000)



