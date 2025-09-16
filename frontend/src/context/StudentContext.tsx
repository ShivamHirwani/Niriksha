import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  program: string;
  'Attendance%': number;
  q1_avg_score: number;
  q2_avg_score: number;
  q3_avg_score: number;
  q1_trend: number;
  q2_trend: number;
  q3_trend: number;
  q1_Attempts_Used: number;
  q2_Attempts_Used: number;
  q3_Attempts_Used: number;
  Fee_Paid: number;
  Fee_Due_Days: number;
  high_risk: number;
  medium_risk: number;
  low_risk: number;
  riskLevel: 'high' | 'medium' | 'low';
  [key: string]: any; // Index signature to allow dynamic property access
}

// New interface for detailed student information
export interface StudentDetail {
  id: string;
  name: string;
  studentId: string;
  class: string;
  batch: string;
  program: string;
  email: string;
  phone: string;
  mentorEmail: string;
  parentEmail: string;
  parentPhone: string;
  currentGPA: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  attendanceRate: number;
  subjects: Array<{
    name: string;
    grade: number;
    attempts: number;
    status: 'passing' | 'warning' | 'failing';
  }>;
  riskFactors: Array<{
    factor: string;
    severity: 'high' | 'medium' | 'low';
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
  loading: boolean;
  error: string | null;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  resolveAlert: (alertId: string) => void;
  getStudentDetail: (studentId: string) => Promise<StudentDetail>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process DataFrame data into Student objects
  const processStudentData = (rawData: any[]): Student[] => {
    return rawData.map((row, index) => {
      // Determine risk level based on the risk columns
      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      if (row.high_risk === 1) riskLevel = 'high';
      else if (row.medium_risk === 1) riskLevel = 'medium';
      else if (row.low_risk === 1) riskLevel = 'low';

      return {
        id: row.student_id || `student_${index}`,
        name: row.student_name || `Student ${index + 1}`,
        studentId: row.student_id || `ST${String(index + 1).padStart(3, '0')}`,
        program: row.program || 'General',
        'Attendance%': Number(row.attendance_percentage) || 0,
        q1_avg_score: Number(row.q1_average_test_score) || 0,
        q2_avg_score: Number(row.q2_average_test_score) || 0,
        q3_avg_score: Number(row.q3_average_test_score) || 0,
        q1_trend: Number(row.q1_test_score_trend) || 0,
        q2_trend: Number(row.q2_test_score_trend) || 0,
        q3_trend: Number(row.q3_test_score_trend) || 0,
        q1_Attempts_Used: Number(row.q1_attempts_used) || 0,
        q2_Attempts_Used: Number(row.q2_attempts_used) || 0,
        q3_Attempts_Used: Number(row.q3_attempts_used) || 0,
        Fee_Paid: Number(row.fee_status) || 0,
        Fee_Due_Days: Number(row.fee_due_date) || 0,
        high_risk: Number(row.high_risk) || 0,
        medium_risk: Number(row.medium_risk) || 0,
        low_risk: Number(row.low_risk) || 0,
        riskLevel: riskLevel
      };
    });
  };

  // Process detailed student information
  const processStudentDetailData = (rawData: any, attendanceData: any[], assessmentData: any[], feeData: any[]): StudentDetail => {
    // Calculate risk level and score based on various factors
    const calculateRiskLevel = (gpa: number, attendance: number): { level: 'high' | 'medium' | 'low', score: number } => {
      let riskScore = 0;
      
      // GPA risk factor (40% weight)
      if (gpa < 2.0) riskScore += 40;
      else if (gpa < 2.5) riskScore += 30;
      else if (gpa < 3.0) riskScore += 20;
      else if (gpa < 3.5) riskScore += 10;
      
      // Attendance risk factor (35% weight)
      if (attendance < 60) riskScore += 35;
      else if (attendance < 70) riskScore += 25;
      else if (attendance < 80) riskScore += 15;
      else if (attendance < 90) riskScore += 5;
      
      // Fee status (25% weight) - you can enhance this based on your fee data
      const studentFees = feeData.filter(fee => fee.student_id === rawData.student_id);
      if (studentFees.some(fee => fee.status === 'overdue')) {
        riskScore += 25;
      } else if (studentFees.some(fee => fee.status === 'pending')) {
        riskScore += 15;
      }
      
      let level: 'high' | 'medium' | 'low' = 'low';
      if (riskScore >= 50) level = 'high';
      else if (riskScore >= 25) level = 'medium';
      
      return { level, score: Math.min(riskScore, 100) };
    };

    // Get student's attendance data
    const studentAttendance = attendanceData.filter(att => att.student_id === rawData.student_id);
    const attendanceRate = studentAttendance.length > 0 
      ? studentAttendance.reduce((sum, att) => sum + (att.present ? 1 : 0), 0) / studentAttendance.length * 100
      : 85; // Default attendance rate

    // Get student's assessment data
    const studentAssessments = assessmentData.filter(ass => ass.student_id === rawData.student_id);
    
    // Create subjects array from assessments
    const subjectsMap = new Map();
    studentAssessments.forEach(assessment => {
      const subject = assessment.subject || 'General';
      if (!subjectsMap.has(subject)) {
        subjectsMap.set(subject, {
          name: subject,
          grades: [],
          attempts: 0
        });
      }
      const subjectData = subjectsMap.get(subject);
      subjectData.grades.push(assessment.score || 0);
      subjectData.attempts += 1;
    });

    const subjects = Array.from(subjectsMap.entries()).map(([name, data]) => {
      const avgGrade = data.grades.reduce((sum: number, grade: number) => sum + grade, 0) / data.grades.length || 0;
      const status = avgGrade >= 80 ? 'passing' : avgGrade >= 60 ? 'warning' : 'failing';
      
      return {
        name,
        grade: avgGrade,
        attempts: data.attempts,
        status: status as 'passing' | 'warning' | 'failing'
      };
    });

    // If no assessments, create default subjects
    if (subjects.length === 0) {
      const defaultSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'];
      defaultSubjects.forEach(subject => {
        const grade = 70 + Math.random() * 25; // Random grade between 70-95
        subjects.push({
          name: subject,
          grade,
          attempts: Math.floor(Math.random() * 3) + 1,
          status: grade >= 80 ? 'passing' : grade >= 60 ? 'warning' : 'failing'
        });
      });
    }

    const gpa = rawData.gpa || subjects.reduce((sum, subject) => sum + subject.grade, 0) / subjects.length / 25; // Convert to 4.0 scale
    const { level: riskLevel, score: riskScore } = calculateRiskLevel(gpa, attendanceRate);

    // Generate risk factors
    const riskFactors = [];
    
    if (gpa < 2.5) {
      riskFactors.push({
        factor: 'Low Academic Performance',
        severity: gpa < 2.0 ? 'high' : 'medium' as 'high' | 'medium' | 'low',
        weight: 0.4
      });
    }
    
    if (attendanceRate < 80) {
      riskFactors.push({
        factor: 'Poor Attendance',
        severity: attendanceRate < 60 ? 'high' : 'medium' as 'high' | 'medium' | 'low',
        weight: 0.35
      });
    }
    
    // Check for fee issues
    const studentFees = feeData.filter(fee => fee.student_id === rawData.student_id);
    if (studentFees.some(fee => fee.status === 'overdue' || fee.status === 'pending')) {
      riskFactors.push({
        factor: 'Fee Payment Issues',
        severity: studentFees.some(fee => fee.status === 'overdue') ? 'high' : 'medium' as 'high' | 'medium' | 'low',
        weight: 0.25
      });
    }

    return {
      id: rawData.student_id || `student_${Date.now()}`,
      name: rawData.student_name || 'Unknown Student',
      studentId: rawData.student_id || 'Unknown',
      class: rawData.class || 'Not Assigned',
      batch: rawData.batch || 'Not Assigned',
      program: rawData.program || 'General',
      email: rawData.email || `${rawData.student_id}@student.edu`,
      phone: rawData.phone || '+1234567890',
      mentorEmail: rawData.mentor_email || 'mentor@institution.edu',
      parentEmail: rawData.parent_email || 'parent@email.com',
      parentPhone: rawData.parent_phone || '+1234567890',
      currentGPA: gpa,
      riskLevel,
      riskScore,
      attendanceRate,
      subjects,
      riskFactors
    };
  };

  // Get detailed student information (demo version)
  const getStudentDetail = async (studentId: string): Promise<StudentDetail> => {
    console.log('Getting student detail for:', studentId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find student in our demo data
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      console.log('Student not found, returning fallback data');
    }
    
    // Generate realistic demo data based on the student
    const demoDetails: StudentDetail = {
      id: studentId,
      name: student?.name || 'Demo Student',
      studentId: student?.studentId || studentId,
      class: 'Class A',
      batch: '2024',
      program: student?.program || 'Computer Science',
      email: `${student?.studentId || studentId}@student.edu`,
      phone: '+1-555-0123',
      mentorEmail: 'mentor@institution.edu',
      parentEmail: 'parent@email.com',
      parentPhone: '+1-555-0456',
      currentGPA: student ? (student.q1_avg_score + student.q2_avg_score + student.q3_avg_score) / 75 : 3.2,
      riskLevel: student?.riskLevel || 'medium',
      riskScore: student?.riskLevel === 'high' ? 75 : student?.riskLevel === 'medium' ? 45 : 25,
      attendanceRate: student?.['Attendance%'] || 78,
      subjects: [
        { 
          name: 'Quiz 1', 
          grade: student?.q1_avg_score || 75, 
          attempts: student?.q1_Attempts_Used || 2, 
          status: (student?.q1_avg_score || 75) >= 80 ? 'passing' : (student?.q1_avg_score || 75) >= 60 ? 'warning' : 'failing'
        },
        { 
          name: 'Quiz 2', 
          grade: student?.q2_avg_score || 82, 
          attempts: student?.q2_Attempts_Used || 1, 
          status: (student?.q2_avg_score || 82) >= 80 ? 'passing' : (student?.q2_avg_score || 82) >= 60 ? 'warning' : 'failing'
        },
        { 
          name: 'Quiz 3', 
          grade: student?.q3_avg_score || 68, 
          attempts: student?.q3_Attempts_Used || 3, 
          status: (student?.q3_avg_score || 68) >= 80 ? 'passing' : (student?.q3_avg_score || 68) >= 60 ? 'warning' : 'failing'
        }
      ],
      riskFactors: [
        ...(student?.['Attendance%'] && student['Attendance%'] < 80 ? [
          { factor: 'Poor Attendance', severity: student['Attendance%'] < 60 ? 'high' : 'medium' as 'high' | 'medium' | 'low', weight: 0.35 }
        ] : []),
        ...(student && (student.q1_avg_score + student.q2_avg_score + student.q3_avg_score) / 3 < 75 ? [
          { factor: 'Academic Performance', severity: 'medium' as 'high' | 'medium' | 'low', weight: 0.4 }
        ] : []),
        ...(student?.Fee_Due_Days && student.Fee_Due_Days > 0 ? [
          { factor: 'Fee Payment Issues', severity: student.Fee_Due_Days > 15 ? 'high' : 'low' as 'high' | 'medium' | 'low', weight: 0.25 }
        ] : [])
      ]
    };
    
    console.log('Generated demo student detail:', demoDetails);
    return demoDetails;
  };

  // Initialize with demo data (backend disabled for now)
  useEffect(() => {
    console.log('Initializing with demo data...');
    
    // Simulate loading delay
    setTimeout(() => {
      // Set comprehensive demo data
      setStudents([
        {
          id: '1',
          name: 'Alice Johnson',
          studentId: 'ST001',
          program: 'Computer Science',
          'Attendance%': 92,
          q1_avg_score: 85,
          q2_avg_score: 78,
          q3_avg_score: 88,
          q1_trend: 0.15,
          q2_trend: -0.05,
          q3_trend: 0.12,
          q1_Attempts_Used: 2,
          q2_Attempts_Used: 3,
          q3_Attempts_Used: 1,
          Fee_Paid: 100,
          Fee_Due_Days: 0,
          high_risk: 0,
          medium_risk: 0,
          low_risk: 1,
          riskLevel: 'low'
        },
        {
          id: '2',
          name: 'Bob Smith',
          studentId: 'ST002',
          program: 'Engineering',
          'Attendance%': 65,
          q1_avg_score: 72,
          q2_avg_score: 68,
          q3_avg_score: 70,
          q1_trend: -0.08,
          q2_trend: -0.12,
          q3_trend: 0.03,
          q1_Attempts_Used: 3,
          q2_Attempts_Used: 3,
          q3_Attempts_Used: 2,
          Fee_Paid: 80,
          Fee_Due_Days: 15,
          high_risk: 1,
          medium_risk: 0,
          low_risk: 0,
          riskLevel: 'high'
        },
        {
          id: '3',
          name: 'Carol Davis',
          studentId: 'ST003',
          program: 'Mathematics',
          'Attendance%': 88,
          q1_avg_score: 79,
          q2_avg_score: 82,
          q3_avg_score: 84,
          q1_trend: 0.05,
          q2_trend: 0.08,
          q3_trend: 0.10,
          q1_Attempts_Used: 2,
          q2_Attempts_Used: 2,
          q3_Attempts_Used: 1,
          Fee_Paid: 100,
          Fee_Due_Days: 0,
          high_risk: 0,
          medium_risk: 0,
          low_risk: 1,
          riskLevel: 'low'
        },
        {
          id: '4',
          name: 'David Wilson',
          studentId: 'ST004',
          program: 'Physics',
          'Attendance%': 75,
          q1_avg_score: 76,
          q2_avg_score: 74,
          q3_avg_score: 78,
          q1_trend: -0.02,
          q2_trend: -0.05,
          q3_trend: 0.07,
          q1_Attempts_Used: 2,
          q2_Attempts_Used: 3,
          q3_Attempts_Used: 2,
          Fee_Paid: 90,
          Fee_Due_Days: 5,
          high_risk: 0,
          medium_risk: 1,
          low_risk: 0,
          riskLevel: 'medium'
        },
        {
          id: '5',
          name: 'Emma Brown',
          studentId: 'ST005',
          program: 'Chemistry',
          'Attendance%': 94,
          q1_avg_score: 91,
          q2_avg_score: 89,
          q3_avg_score: 93,
          q1_trend: 0.12,
          q2_trend: 0.08,
          q3_trend: 0.15,
          q1_Attempts_Used: 1,
          q2_Attempts_Used: 2,
          q3_Attempts_Used: 1,
          Fee_Paid: 100,
          Fee_Due_Days: 0,
          high_risk: 0,
          medium_risk: 0,
          low_risk: 1,
          riskLevel: 'low'
        },
        {
          id: '6',
          name: 'Frank Miller',
          studentId: 'ST006',
          program: 'Biology',
          'Attendance%': 58,
          q1_avg_score: 64,
          q2_avg_score: 61,
          q3_avg_score: 59,
          q1_trend: -0.15,
          q2_trend: -0.18,
          q3_trend: -0.22,
          q1_Attempts_Used: 3,
          q2_Attempts_Used: 3,
          q3_Attempts_Used: 3,
          Fee_Paid: 60,
          Fee_Due_Days: 30,
          high_risk: 1,
          medium_risk: 0,
          low_risk: 0,
          riskLevel: 'high'
        }
      ]);
      
      // Set sample alerts
      setAlerts([
        {
          id: 'alert1',
          studentId: '2',
          title: 'Critical Attendance Alert',
          message: 'Bob Smith attendance has dropped to 65% - immediate intervention required',
          severity: 'high',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: 'alert2',
          studentId: '6',
          title: 'Academic Performance Warning',
          message: 'Frank Miller showing consistent decline in all subjects',
          severity: 'high',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: 'alert3',
          studentId: '4',
          title: 'Fee Payment Reminder',
          message: 'David Wilson fee payment is 5 days overdue',
          severity: 'medium',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: 'alert4',
          studentId: '2',
          title: 'Quiz Attempt Limit Reached',
          message: 'Bob Smith has used all attempts for Q1 and Q2',
          severity: 'medium',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: 'alert5',
          studentId: '1',
          title: 'Performance Improvement',
          message: 'Alice Johnson shows positive trend in Q3 performance',
          severity: 'low',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          resolved: false
        }
      ]);
      
      setLoading(false);
      setError(null);
      console.log('✅ Demo data initialized successfully!');
    }, 1000); // 1 second loading simulation
  }, []);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: `student-${Date.now()}`
    } as Student;
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
      loading,
      error,
      addStudent,
      updateStudent,
      addAlert,
      resolveAlert,
      getStudentDetail
    }}>
      {children}
    </StudentContext.Provider>
  );
};