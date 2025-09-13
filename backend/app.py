from flask import Flask
from flask_jwt_extended import JWTManager
from flask_security import Security, SQLAlchemyUserDatastore, hash_password

from application.models import db, Mentor, Role
from application.config import LocalDevelopmentConfig
# from application.resources import init_api

# If you want to access data from gs_api
from gs_api import d, model

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    # --- Initialize extensions ---
    db.init_app(app)
    jwt = JWTManager(app)
    init_api(app)

    # --- Setup Flask-Security ---
    datastore = SQLAlchemyUserDatastore(db, Mentor, Role)
    security = Security(app, datastore)

    # --- Create tables and default data ---
    with app.app_context():
        db.create_all()

        # Default roles
        if not Role.query.filter_by(name='admin').first():
            datastore.create_role(name='admin', description='Administrator')
        if not Role.query.filter_by(name='mentor').first():
            datastore.create_role(name='mentor', description='Mentor')
        if not Role.query.filter_by(name='student').first():
            datastore.create_role(name='student', description='Student')

        # Default admin mentor
        if not Mentor.query.filter_by(email='admin@college.in').first():
            admin_user = datastore.create_user(
                email='admin@college.in',
                password=hash_password('admin123'),
                active=True
            )
            datastore.add_role_to_user(admin_user, 'admin')

        db.session.commit()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
