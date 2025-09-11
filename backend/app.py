import joblib
from sklearn.preprocessing import LabelEncoder


model= joblib.load('Student_risk_model.pkl')

val= model.predict([[91,	42,	1	,0	,1,	0]])
print(val)