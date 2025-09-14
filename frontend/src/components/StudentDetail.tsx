import React, { useState } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, Mail, Phone, FileText, Calendar } from 'lucide-react';

interface StudentDetailProps {
  studentId: string | null;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onBack }) => {
  const { students, alerts } = useStudentContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!studentId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No student selected</p>
      </div>
    );
  }

  const student = students.find(s => s.id === studentId);
  const studentAlerts = alerts.filter(a => a.studentId === studentId);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const RiskIcon = getRiskIcon(student.riskLevel);
  const riskColorClass = getRiskColor(student.riskLevel);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academic', label: 'Academic History' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'alerts', label: 'Alerts & Interventions' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-600">Student ID: {student.studentId} • {student.program}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${riskColorClass}`}>
          <RiskIcon className="w-5 h-5" />
          <span className="font-medium capitalize">{student.riskLevel} Risk</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{student.riskScore}%</p>
            <p className="text-sm text-gray-500">Risk Score</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{student.attendanceRate}%</p>
            <p className="text-sm text-gray-500">Attendance</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{student.currentGPA}</p>
            <p className="text-sm text-gray-500">Current GPA</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{studentAlerts.length}</p>
            <p className="text-sm text-gray-500">Active Alerts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{student.phone}</span>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">Emergency Contact</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">{student.emergencyContact.name}</p>
                  <p className="text-gray-600 text-sm">{student.emergencyContact.relationship}</p>
                  <p className="text-gray-600 text-sm">{student.emergencyContact.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                <div className="space-y-3">
                  {student.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{factor.weight * 100}% weight</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          factor.severity === 'high' ? 'bg-red-100 text-red-800' :
                          factor.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {factor.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Current Grade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Attempts</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {student.subjects.map((subject) => (
                      <tr key={subject.name}>
                        <td className="py-3 px-4 text-gray-900">{subject.name}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            subject.grade >= 80 ? 'text-green-600' :
                            subject.grade >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {subject.grade}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{subject.attempts}/3</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subject.status === 'passing' ? 'bg-green-100 text-green-800' :
                            subject.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subject.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Record</h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Sample attendance grid for current month */}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                      Math.random() > 0.2 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span className="text-gray-600">Absent</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Interventions</h3>
              <div className="space-y-4">
                {studentAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getRiskColor(alert.severity)}`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {alert.interventions && alert.interventions.length > 0 && (
                      <div className="mt-3 pl-6">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Interventions:</h5>
                        <ul className="space-y-1">
                          {alert.interventions.map((intervention, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <Calendar className="w-3 h-3" />
                              <span>{intervention}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
                
                {studentAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <p className="text-gray-500">No alerts for this student</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;