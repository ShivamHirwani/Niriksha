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
      ? { backgroundColor: 'var(--color-danger-bg-dark, #fee2e2)', color: 'var(--color-danger-dark, #dc2626)', borderColor: 'var(--color-danger-600, #dc2626)' }
      : { backgroundColor: 'var(--color-warning-bg-dark, #fef3c7)', color: 'var(--color-warning-dark, #d97706)', borderColor: 'var(--color-warning-600, #d97706)' };
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance < 60) return 'var(--color-danger-dark, #dc2626)';
    if (attendance < 75) return 'var(--color-warning-dark, #d97706)';
    return 'var(--color-success-dark, #059669)';
  };

  const getGpaColor = (gpa: number) => {
    if (gpa < 2.0) return 'var(--color-danger-dark, #dc2626)';
    if (gpa < 2.5) return 'var(--color-warning-dark, #d97706)';
    return 'var(--color-success-dark, #059669)';
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
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-xl shadow-sm border p-6 mb-8" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-danger-bg-dark, #fee2e2)' }}>
              <AlertTriangle className="h-6 w-6" style={{ color: 'var(--color-danger-dark, #dc2626)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dropout Risk Report</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Students requiring immediate attention and parent communication</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--color-danger-bg-dark, #fee2e2)', borderColor: 'var(--color-danger-600, #dc2626)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-danger-dark, #7f1d1d)' }}>Critical Risk</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-danger-dark, #7f1d1d)' }}>
                    {mockStudents.filter(s => s.riskLevel === 'Critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8" style={{ color: 'var(--color-danger-dark, #dc2626)' }} />
              </div>
            </div>

            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--color-warning-bg-dark, #fef3c7)', borderColor: 'var(--color-warning-600, #d97706)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-warning-dark, #92400e)' }}>High Risk</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-warning-dark, #92400e)' }}>
                    {mockStudents.filter(s => s.riskLevel === 'High').length}
                  </p>
                </div>
                <User className="h-8 w-8" style={{ color: 'var(--color-warning-dark, #d97706)' }} />
              </div>
            </div>

            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--color-info-bg-dark, #cffafe)', borderColor: 'var(--color-info-600, #0891b2)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-info-dark, #164e63)' }}>Total Students</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-info-dark, #164e63)' }}>{mockStudents.length}</p>
                </div>
                <GraduationCap className="h-8 w-8" style={{ color: 'var(--color-info-dark, #0891b2)' }} />
              </div>
            </div>

            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--color-success-bg-dark, #d1fae5)', borderColor: 'var(--color-success-600, #059669)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-success-dark, #065f46)' }}>Emails Sent</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-success-dark, #065f46)' }}>{emailsSent.size}</p>
                </div>
                <Mail className="h-8 w-8" style={{ color: 'var(--color-success-dark, #10b981)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Risk Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Parent Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Attendance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>GPA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Last Contact</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                {mockStudents.map((student) => (
                  <tr key={student.id} style={{ backgroundColor: 'var(--bg-primary)' }} className="transition-colors hover:opacity-90">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                          <span className="text-white font-medium text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.name}</p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                        style={getRiskBadgeColor(student.riskLevel)}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {student.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.parentName}</p>
                        <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Mail className="h-3 w-3" />
                          {student.parentEmail}
                        </p>
                        <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="font-medium"
                        style={{ color: getAttendanceColor(student.attendance) }}
                      >
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="font-medium"
                        style={{ color: getGpaColor(student.gpa) }}
                      >
                        {student.gpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {new Date(student.lastContact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSendEmail(student)}
                        disabled={emailsSent.has(student.id) || isLoading === student.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${emailsSent.has(student.id)
                          ? 'cursor-default'
                          : 'text-white hover:shadow-md active:transform active:scale-95'
                          } ${isLoading === student.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        style={{
                          backgroundColor: emailsSent.has(student.id) 
                            ? 'var(--color-success-bg-dark, #d1fae5)' 
                            : 'var(--gradient-primary)',
                          color: emailsSent.has(student.id) 
                            ? 'var(--color-success-dark, #059669)' 
                            : 'var(--text-inverse)'
                        }}
                      >
                        {isLoading === student.id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-inverse)' }} />
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
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Filter by Risk Level:</label>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value as 'All' | 'High' | 'Critical')}
              className="px-3 py-2 rounded-lg focus:ring-2 focus:outline-none text-sm"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--color-primary-500)'
              } as React.CSSProperties}
            >
              <option value="All" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>All Levels</option>
              <option value="High" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>High Risk Only</option>
              <option value="Critical" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Critical Risk Only</option>
            </select>
          </div>

          <button
            onClick={handleSendAllEmails}
            disabled={allEmailsSent || isLoading === 'all'}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all ${allEmailsSent
              ? 'cursor-default'
              : 'text-white hover:shadow-lg active:transform active:scale-95'
              } ${isLoading === 'all' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            style={{
              background: allEmailsSent 
                ? 'var(--color-success-bg-dark, #d1fae5)' 
                : 'var(--gradient-primary)',
              color: allEmailsSent 
                ? 'var(--color-success-dark, #059669)' 
                : 'var(--text-inverse)'
            }}
          >
            {isLoading === 'all' ? (
              <>
                <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-inverse)' }} />
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
