from flask import Flask
from flask_jwt_extended import JWTManager

from application.config import LocalDevelopmentConfig
# from application.resources import init_api

# If you want to access data from gs_api
from gs_api import d, model

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)

    # --- Initialize extensions ---
    jwt = JWTManager(app)
    # init_api(app)  # Uncomment if you want to use your API initialization
    print(d)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
