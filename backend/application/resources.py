from flask_restful import Api
from .auth import MentorLoginResource  # import the login resource
from .api import MentorApi
from .email_templates import EmailFormat
from .mail_to_mentor import SendEmailToStudentsResource
from .students_func import *

api = Api()

def init_api(app):
    # Register resources
    api = Api(app)
    api.add_resource(MentorLoginResource, "/mentor/login")
    api.add_resource(MentorApi, "/mentor")
    api.add_resource(SendEmailToStudentsResource, "/mentor/send-email")
    
    # Students resources
    api.add_resource(Student_df, "/students_df")
    api.add_resource(Students_info, "/students_info")
    api.add_resource(Attendance_info, "/attendance_info")
    api.add_resource(Assessments_info,"/assessments_info")
    api.add_resource(Fees_info, "/fees_info")

    # Email format api
    api.add_resource(EmailFormat, "/email_format")
