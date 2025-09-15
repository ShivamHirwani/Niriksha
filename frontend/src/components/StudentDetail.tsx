import React, { useState, useEffect } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { StudentDetail as StudentDetailType } from '../context/StudentContext';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, Mail, Phone, FileText, Calendar } from 'lucide-react';

interface StudentDetailProps {
  studentId: string | null;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onBack }) => {
  const { alerts, getStudentDetail } = useStudentContext();
  const [student, setStudent] = useState<StudentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchStudentDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const detailData = await getStudentDetail(studentId);
        setStudent(detailData);
      } catch (err) {
        setError('Failed to load student details');
        console.error('Error loading student detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [studentId, getStudentDetail]);

  if (!studentId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No student selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading student details...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Student not found'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const studentAlerts = alerts.filter(a => a.studentId === studentId);

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/50 dark:border-red-800';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-800';
      default: return 'text-green-600 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/50 dark:border-green-800';
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
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Student ID: {student.studentId} • {student.program}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Class: {student.class} • Batch: {student.batch}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${riskColorClass}`}>
          <RiskIcon className="w-5 h-5" />
          <span className="font-medium capitalize">{student.riskLevel} Risk</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{student.riskScore}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Risk Score</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{student.attendanceRate}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{student.currentGPA.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current GPA</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{studentAlerts.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Alerts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">Mentor: {student.mentorEmail}</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 dark:text-white mt-6 mb-3">Parent Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{student.parentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{student.parentPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Factors</h3>
                <div className="space-y-3">
                  {student.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(factor.weight * 100)}% weight</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          factor.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-gray-900 dark:text-red-200' :
                          factor.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-gray-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-gray-900 dark:text-green-200'
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Current Grade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Attempts</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {student.subjects.map((subject) => (
                      <tr key={subject.name}>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-300">{subject.name}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            subject.grade >= 80 ? 'text-green-600 dark:text-green-400' :
                            subject.grade >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {subject.grade.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{subject.attempts}/3</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subject.status === 'passing' ? 'bg-green-100 text-green-800 dark:bg-gray-900 dark:text-green-200' :
                            subject.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-gray-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-gray-900 dark:text-red-200'
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Record</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Overall Attendance: {student.attendanceRate}%</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 dark:bg-green-900/50 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Present ({Math.round(student.attendanceRate)}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-100 dark:bg-red-900/50 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Absent ({Math.round(100 - student.attendanceRate)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Sample attendance grid for current month */}
                {Array.from({ length: 30 }, (_, i) => {
                  const isPresent = Math.random() * 100 < student.attendanceRate;
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                        isPresent ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts & Interventions</h3>
              <div className="space-y-4">
                {studentAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getRiskColor(alert.severity)}`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {alert.interventions && alert.interventions.length > 0 && (
                      <div className="mt-3 pl-6">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Interventions:</h5>
                        <ul className="space-y-1">
                          {alert.interventions.map((intervention, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
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
                    <CheckCircle className="w-12 h-12 text-green-300 dark:text-green-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No alerts for this student</p>
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