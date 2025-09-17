# ML model predicted df
import numpy as np
from flask import jsonify
from gs_api import final_df, students_df, attendance_df, assessments_df, fees_df
from flask_restful import Resource


class Student_df(Resource):
    def get(self):
        # Replace NaN with None (turns into null in JSON)
        students_data = final_df.replace({np.nan: None}).to_dict('records')
        return jsonify(students_data)

# all spreadSheet dataset
class Students_info(Resource):
    def get(self):
        s_info= students_df.to_dict('records')

        return jsonify(s_info)

class Attendance_info(Resource):
    def get(self):
        a_info= attendance_df.to_dict('records')

        return jsonify(a_info)

class Assessments_info(Resource):
    def get(self):
        ass_info= assessments_df.to_dict('records')

        return jsonify(ass_info)

class Fees_info(Resource):
    def get(self):
        f_info= fees_df.to_dict('records')

        return jsonify(f_info)