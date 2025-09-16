import React, { useState } from 'react';
import { Mail, AlertTriangle, User, GraduationCap, Phone, Send, CheckCircle } from 'lucide-react';
import EmailForm from './Emailform.tsx';

interface Student {
  id: string;
  name: string;
  riskLevel: 'High' | 'Critical';
  parentEmail: string;
  parentName: string;
  phone: string;
  attendance: number;
  gpa: number;
  lastContact: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    riskLevel: 'Critical',
    parentEmail: 'mary.johnson@email.com',
    parentName: 'Mary Johnson',
    phone: '(555) 123-4567',
    attendance: 65,
    gpa: 1.8,
    lastContact: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    riskLevel: 'High',
    parentEmail: 'carlos.martinez@email.com',
    parentName: 'Carlos Martinez',
    phone: '(555) 234-5678',
    attendance: 72,
    gpa: 2.1,
    lastContact: '2024-01-12'
  },
  {
    id: '3',
    name: 'Michael Brown',
    riskLevel: 'Critical',
    parentEmail: 'lisa.brown@email.com',
    parentName: 'Lisa Brown',
    phone: '(555) 345-6789',
    attendance: 58,
    gpa: 1.5,
    lastContact: '2024-01-08'
  },
  {
    id: '4',
    name: 'Emma Davis',
    riskLevel: 'High',
    parentEmail: 'robert.davis@email.com',
    parentName: 'Robert Davis',
    phone: '(555) 456-7890',
    attendance: 78,
    gpa: 2.3,
    lastContact: '2024-01-10'
  },
  {
    id: '5',
    name: 'Jordan Wilson',
    riskLevel: 'Critical',
    parentEmail: 'jennifer.wilson@email.com',
    parentName: 'Jennifer Wilson',
    phone: '(555) 567-8901',
    attendance: 62,
    gpa: 1.9,
    lastContact: '2024-01-05'
  }
];

const Report: React.FC = () => {
  const [emailsSent, setEmailsSent] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [allEmailsSent, setAllEmailsSent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Critical'>('All');

  const handleSendEmail = (student: Student) => {
    setSelectedStudent(student);
    setShowEmailForm(true);
  };

  const handleEmailSent = async (emailData: any) => {
    if (selectedStudent) {
      setEmailsSent(prev => new Set(prev).add(selectedStudent.id));
      setShowEmailForm(false);
      setSelectedStudent(null);
    }
  };

  const handleBackToReport = () => {
    setShowEmailForm(false);
    setSelectedStudent(null);
  };

  const handleSendAllEmails = async () => {
    const studentsToEmail = selectedRiskFilter === 'All'
      ? mockStudents
      : mockStudents.filter(s => s.riskLevel === selectedRiskFilter);

    setIsLoading('all');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    const allIds = studentsToEmail.map(s => s.id);
    setEmailsSent(new Set(allIds));
    setAllEmailsSent(true);
    setIsLoading(null);
  };

  const getFilteredStudentsCount = () => {
    if (selectedRiskFilter === 'All') return mockStudents.length;
    return mockStudents.filter(s => s.riskLevel === selectedRiskFilter).length;
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    return riskLevel === 'Critical'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 60) return 'text-red-600';
    if (attendance < 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getGpaColor = (gpa: number) => {
    if (gpa < 2.0) return 'text-red-600';
    if (gpa < 2.5) return 'text-orange-600';
    return 'text-green-600';
  };

  if (showEmailForm && selectedStudent) {
    return (
      <EmailForm
        student={selectedStudent}
        onBack={handleBackToReport}
        onSend={handleEmailSent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dropout Risk Report</h1>
              <p className="text-gray-600 mt-1">Students requiring immediate attention and parent communication</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Critical Risk</p>
                  <p className="text-2xl font-bold text-red-900">
                    {mockStudents.filter(s => s.riskLevel === 'Critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">High Risk</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {mockStudents.filter(s => s.riskLevel === 'High').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">{mockStudents.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Emails Sent</p>
                  <p className="text-2xl font-bold text-green-900">{emailsSent.size}</p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Parent Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Attendance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">GPA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Contact</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeColor(student.riskLevel)}`}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.parentName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.parentEmail}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getGpaColor(student.gpa)}`}>
                        {student.gpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(student.lastContact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSendEmail(student)}
                        disabled={emailsSent.has(student.id) || isLoading === student.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${emailsSent.has(student.id)
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                          } ${isLoading === student.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        {isLoading === student.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : emailsSent.has(student.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Sent
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Email
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Send All Button */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by Risk Level:</label>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value as 'All' | 'High' | 'Critical')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="All">All Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Critical">Critical Risk Only</option>
            </select>
          </div>

          <button
            onClick={handleSendAllEmails}
            disabled={allEmailsSent || isLoading === 'all'}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all ${allEmailsSent
              ? 'bg-green-100 text-green-800 cursor-default'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:transform active:scale-95'
              } ${isLoading === 'all' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isLoading === 'all' ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Emails to {selectedRiskFilter} Risk Parents...
              </>
            ) : allEmailsSent ? (
              <>
                <CheckCircle className="h-5 w-5" />
                All Emails Sent Successfully
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                Send Email to {selectedRiskFilter} Risk Parents ({getFilteredStudentsCount()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
