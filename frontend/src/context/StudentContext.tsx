import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  program: string;
  currentGPA: number;
  attendanceRate: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  subjects: Array<{
    name: string;
    grade: number;
    attempts: number;
    status: 'passing' | 'warning' | 'failing';
  }>;
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high';
    weight: number;
  }>;
}

export interface Alert {
  id: string;
  studentId: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
  interventions?: string[];
}

interface StudentContextType {
  students: Student[];
  alerts: Alert[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  resolveAlert: (alertId: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'Emma Johnson',
        studentId: 'ST001',
        email: 'emma.johnson@school.edu',
        phone: '+1-555-0123',
        program: 'Computer Science',
        currentGPA: 2.1,
        attendanceRate: 45,
        riskScore: 85,
        riskLevel: 'high',
        emergencyContact: {
          name: 'Sarah Johnson',
          relationship: 'Mother',
          phone: '+1-555-0124'
        },
        subjects: [
          { name: 'Data Structures', grade: 45, attempts: 2, status: 'failing' },
          { name: 'Algorithms', grade: 55, attempts: 1, status: 'warning' },
          { name: 'Database Systems', grade: 65, attempts: 1, status: 'warning' }
        ],
        riskFactors: [
          { factor: 'Low Attendance', severity: 'high', weight: 0.3 },
          { factor: 'Poor Academic Performance', severity: 'high', weight: 0.4 },
          { factor: 'Multiple Subject Failures', severity: 'medium', weight: 0.3 }
        ]
      },
      {
        id: '2',
        name: 'Michael Chen',
        studentId: 'ST002',
        email: 'michael.chen@school.edu',
        phone: '+1-555-0125',
        program: 'Engineering',
        currentGPA: 2.8,
        attendanceRate: 72,
        riskScore: 55,
        riskLevel: 'medium',
        emergencyContact: {
          name: 'David Chen',
          relationship: 'Father',
          phone: '+1-555-0126'
        },
        subjects: [
          { name: 'Calculus II', grade: 68, attempts: 1, status: 'warning' },
          { name: 'Physics', grade: 75, attempts: 1, status: 'passing' },
          { name: 'Engineering Drawing', grade: 82, attempts: 1, status: 'passing' }
        ],
        riskFactors: [
          { factor: 'Declining Grades', severity: 'medium', weight: 0.4 },
          { factor: 'Moderate Attendance', severity: 'medium', weight: 0.3 },
          { factor: 'Financial Difficulties', severity: 'low', weight: 0.3 }
        ]
      },
      {
        id: '3',
        name: 'Sarah Williams',
        studentId: 'ST003',
        email: 'sarah.williams@school.edu',
        phone: '+1-555-0127',
        program: 'Business Administration',
        currentGPA: 3.7,
        attendanceRate: 95,
        riskScore: 15,
        riskLevel: 'low',
        emergencyContact: {
          name: 'Robert Williams',
          relationship: 'Father',
          phone: '+1-555-0128'
        },
        subjects: [
          { name: 'Marketing', grade: 88, attempts: 1, status: 'passing' },
          { name: 'Finance', grade: 92, attempts: 1, status: 'passing' },
          { name: 'Statistics', grade: 85, attempts: 1, status: 'passing' }
        ],
        riskFactors: [
          { factor: 'Excellent Performance', severity: 'low', weight: 0.2 },
          { factor: 'High Engagement', severity: 'low', weight: 0.2 }
        ]
      },
      {
        id: '4',
        name: 'James Rodriguez',
        studentId: 'ST004',
        email: 'james.rodriguez@school.edu',
        phone: '+1-555-0129',
        program: 'Information Technology',
        currentGPA: 1.8,
        attendanceRate: 58,
        riskScore: 92,
        riskLevel: 'high',
        emergencyContact: {
          name: 'Maria Rodriguez',
          relationship: 'Mother',
          phone: '+1-555-0130'
        },
        subjects: [
          { name: 'Programming', grade: 35, attempts: 3, status: 'failing' },
          { name: 'Web Development', grade: 42, attempts: 2, status: 'failing' },
          { name: 'Networks', grade: 58, attempts: 1, status: 'warning' }
        ],
        riskFactors: [
          { factor: 'Critical Attendance Issues', severity: 'high', weight: 0.35 },
          { factor: 'Multiple Failed Subjects', severity: 'high', weight: 0.4 },
          { factor: 'Exhausted Attempts', severity: 'high', weight: 0.25 }
        ]
      },
      {
        id: '5',
        name: 'Lisa Park',
        studentId: 'ST005',
        email: 'lisa.park@school.edu',
        phone: '+1-555-0131',
        program: 'Graphic Design',
        currentGPA: 2.4,
        attendanceRate: 78,
        riskScore: 48,
        riskLevel: 'medium',
        emergencyContact: {
          name: 'Jennifer Park',
          relationship: 'Mother',
          phone: '+1-555-0132'
        },
        subjects: [
          { name: 'Digital Art', grade: 72, attempts: 1, status: 'passing' },
          { name: 'Typography', grade: 58, attempts: 2, status: 'warning' },
          { name: 'Branding', grade: 68, attempts: 1, status: 'warning' }
        ],
        riskFactors: [
          { factor: 'Inconsistent Performance', severity: 'medium', weight: 0.4 },
          { factor: 'Some Subject Struggles', severity: 'medium', weight: 0.3 },
          { factor: 'Average Attendance', severity: 'low', weight: 0.3 }
        ]
      }
    ];

    const sampleAlerts: Alert[] = [
      {
        id: 'alert-1',
        studentId: '1',
        title: 'Critical Attendance Alert',
        message: 'Emma Johnson attendance has dropped to 45%, triggering immediate intervention protocol.',
        severity: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        interventions: ['Parent meeting scheduled', 'Academic advisor assigned', 'Counseling referral made']
      },
      {
        id: 'alert-2',
        studentId: '4',
        title: 'Multiple Subject Failures',
        message: 'James Rodriguez has exhausted attempts in Programming and is failing Web Development.',
        severity: 'high',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        interventions: ['Tutor assigned', 'Study group enrollment', 'Meeting with department head']
      },
      {
        id: 'alert-3',
        studentId: '2',
        title: 'Declining Academic Performance',
        message: 'Michael Chen GPA has dropped below program requirements.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        interventions: ['Academic coaching scheduled']
      },
      {
        id: 'alert-4',
        studentId: '5',
        title: 'Attendance Concern',
        message: 'Lisa Park attendance pattern showing declining trend.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolved: false
      }
    ];

    setStudents(sampleStudents);
    setAlerts(sampleAlerts);
  }, []);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: `student-${Date.now()}`
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const addAlert = (alertData: Omit<Alert, 'id'>) => {
    const newAlert = {
      ...alertData,
      id: `alert-${Date.now()}`
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <StudentContext.Provider value={{
      students,
      alerts,
      addStudent,
      updateStudent,
      addAlert,
      resolveAlert
    }}>
      {children}
    </StudentContext.Provider>
  );
};