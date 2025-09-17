from flask_restful import Resource
from flask import jsonify, request
email_templates = [
    {
        "id": 1,
        "subject": "Concern Regarding Low Attendance",
        "body": (
            "Dear Parent,\n\n"
            "We have noticed that your child has been maintaining a low attendance in classes recently. "
            "Regular attendance is essential for academic success, and we are concerned this may impact their performance.\n\n"
            "We kindly request you to discuss this with your child and encourage regular participation.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 2,
        "subject": "Academic Performance Alert",
        "body": (
            "Dear Parent,\n\n"
            "This is to inform you that your child's recent assessment scores have been below expectations. "
            "We believe that with proper guidance and consistent effort, they can improve.\n\n"
            "We encourage you to support them at home and reach out if you need additional academic assistance.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 3,
        "subject": "Outstanding Academic Performance",
        "body": (
            "Dear Parent,\n\n"
            "We are pleased to inform you that your child has shown excellent academic performance recently. "
            "Their dedication and hard work are truly commendable.\n\n"
            "Please join us in appreciating their efforts and encouraging them to continue performing well.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 4,
        "subject": "Behavioral Concern",
        "body": (
            "Dear Parent,\n\n"
            "We would like to bring to your attention some recent behavioral concerns regarding your child in class. "
            "We believe that timely intervention can help resolve the matter.\n\n"
            "We request your cooperation in discussing this issue and working with us to guide your child.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 5,
        "subject": "General Academic Progress Update",
        "body": (
            "Dear Parent,\n\n"
            "We would like to share that your child is progressing steadily in their academics. "
            "Consistent effort and support from home will help them achieve even better results.\n\n"
            "Please feel free to contact us if you wish to discuss their performance in detail.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 6,
        "subject": "Missed Assignment Reminder",
        "body": (
            "Dear Parent,\n\n"
            "We have observed that your child has not submitted some of their recent assignments. "
            "Timely submission of assignments is crucial for their understanding and grades.\n\n"
            "Please remind them to complete and submit their pending work as soon as possible.\n\n"
            "Regards,\n"
            "Mentor"
        )
    },
    {
        "id": 7,
        "subject": "Parent-Teacher Meeting Invitation",
        "body": (
            "Dear Parent,\n\n"
            "We would like to invite you to attend a Parent-Teacher meeting to discuss your child’s progress and well-being. "
            "Your presence will be valuable in supporting their academic journey.\n\n"
            "Please confirm your availability at your earliest convenience.\n\n"
            "Regards,\n"
            "Mentor"
        )
    }
]


class EmailFormat(Resource):
    def get(self):
        # return all templates
        return email_templates, 200

    