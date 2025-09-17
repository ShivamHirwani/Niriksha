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


app= Flask(__name__)
CORS(app)



# ML model predicted df
import numpy as np

@app.route('/students_df', methods=['GET'])
def Student_df():
    # Replace NaN with None (turns into null in JSON)
    students_data = final_df.replace({np.nan: None}).to_dict('records')
    return jsonify(students_data)



# all spreadSheet dataset
@app.route('/students_info', methods=['GET'])
def Students_info():
    s_info= students_df.to_dict('records')

    return jsonify(s_info)


@app.route('/attendance_info', methods=['GET'])
def Attendance_info():
    a_info= attendance_df.to_dict('records')

    return jsonify(a_info)


@app.route('/assessments_info', methods=['GET'])
def Assessments_info():
    ass_info= assessments_df.to_dict('records')

    return jsonify(ass_info)


@app.route('/fees_info', methods=['GET'])
def Fees_info():
    f_info= fees_df.to_dict('records')

    return jsonify(f_info)





if __name__== '__main__':
    app.run(debug=True, port=5000)



