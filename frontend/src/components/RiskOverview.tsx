import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface RiskOverviewProps {
  onViewStudent: (studentId: string) => void;
}

const RiskOverview: React.FC<RiskOverviewProps> = ({ onViewStudent }) => {
  const { students } = useStudentContext();
  
  const riskGroups = {
    high: students.filter(s => s.riskLevel === 'high'),
    medium: students.filter(s => s.riskLevel === 'medium'),
    low: students.filter(s => s.riskLevel === 'low')
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case 'high': return 'var(--color-danger-200)';
      case 'medium': return 'var(--color-warning-200)';
      default: return 'var(--color-success-200)';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return {
        backgroundColor: 'var(--color-danger-100)',
        color: 'var(--color-danger-700)'
      };
      case 'medium': return {
        backgroundColor: 'var(--color-warning-100)',
        color: 'var(--color-warning-700)'
      };
      default: return {
        backgroundColor: 'var(--color-success-100)',
        color: 'var(--color-success-700)'
      };
    }
  };

  const getRiskIconColor = (level: string) => {
    switch (level) {
      case 'high': return { color: 'var(--color-danger-600)' };
      case 'medium': return { color: 'var(--color-warning-600)' };
      default: return { color: 'var(--color-success-600)' };
    }
  };

  return (
    <div 
      className="glass-morphism p-6 rounded-2xl shadow-glass transition-smooth hover:shadow-xl animate-fade-in"
      style={{ borderColor: 'var(--border-primary)' }}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-heading-3 font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>
            Risk Level Distribution
          </h3>
          <p className="text-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Student risk assessment overview
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-red-500 animate-pulse-soft"></div>
          <span className="text-body-sm font-medium" style={{ color: 'var(--text-muted)' }}>Live</span>
        </div>
      </div>
      
      {/* Enhanced Risk Groups */}
      <div className="space-y-5">
        {Object.entries(riskGroups).map(([level, studentList], index) => {
          const Icon = getRiskIcon(level);
          const gradientClass = getRiskGradient(level);
          const badgeStyle = getRiskBadgeColor(level);
          const iconStyle = getRiskIconColor(level);
          
          return (
            <div 
              key={level} 
              className="modern-card p-5 rounded-xl transition-smooth hover:scale-102 animate-slide-in-right"
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                borderColor: getRiskBorderColor(level),
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Risk Level Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClass} shadow-glass`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-body font-semibold capitalize transition-smooth" style={{ color: 'var(--text-primary)' }}>
                      {level} Risk
                    </span>
                    <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                      {level === 'high' ? 'Immediate attention required' : 
                       level === 'medium' ? 'Monitor closely' : 'Performing well'}
                    </p>
                  </div>
                </div>
                <span 
                  className="px-3 py-1 text-caption font-medium rounded-full transition-smooth hover:scale-105"
                  style={badgeStyle}
                >
                  {studentList.length} {studentList.length === 1 ? 'student' : 'students'}
                </span>
              </div>
              
              {/* Students List */}
              <div className="space-y-3">
                {studentList.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-success-500)' }} />
                    <p className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
                      No students in {level} risk category
                    </p>
                  </div>
                ) : (
                  studentList.slice(0, 3).map((student, studentIndex) => (
                    <div 
                      key={student.id}
                      onClick={() => onViewStudent(student.id)}
                      className="flex items-center justify-between p-3 rounded-lg transition-smooth cursor-pointer hover:scale-102 card-interactive"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Student Avatar */}
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-body-sm shadow-glass"
                          style={{ 
                            background: `var(--gradient-${level === 'high' ? 'secondary' : level === 'medium' ? 'primary' : 'success'})`,
                            color: 'white'
                          }}
                        >
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        
                        {/* Student Info */}
                        <div className="flex-1">
                          <p className="text-body font-medium transition-smooth" style={{ color: 'var(--text-primary)' }}>
                            {student.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
                              ID: {student.studentId}
                            </span>
                            <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
                              {student.program}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Student Metrics */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>ATTENDANCE</span>
                          <span 
                            className="text-body-sm font-semibold px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: student['Attendance%'] >= 85 ? 'var(--color-success-100)' : 
                                              student['Attendance%'] >= 70 ? 'var(--color-warning-100)' : 'var(--color-danger-100)',
                              color: student['Attendance%'] >= 85 ? 'var(--color-success-700)' : 
                                     student['Attendance%'] >= 70 ? 'var(--color-warning-700)' : 'var(--color-danger-700)'
                            }}
                          >
                            {student['Attendance%'].toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>AVG SCORE</span>
                          <span 
                            className="text-body-sm font-semibold px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: 'var(--color-info-100)',
                              color: 'var(--color-info-700)'
                            }}
                          >
                            {((student.q1_avg_score + student.q2_avg_score + student.q3_avg_score) / 3).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Show More Button */}
                {studentList.length > 3 && (
                  <button 
                    className="w-full py-3 rounded-lg transition-smooth hover:scale-102 active:scale-98 font-medium"
                    style={{
                      backgroundColor: 'var(--color-primary-50)',
                      color: 'var(--color-primary-600)'
                    }}
                    onClick={() => {/* Navigate to filtered students view */}}
                  >
                    View {studentList.length - 3} more {level} risk {studentList.length - 3 === 1 ? 'student' : 'students'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskOverview;