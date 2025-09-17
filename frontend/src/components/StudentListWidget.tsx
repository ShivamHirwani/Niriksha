import React, { useState } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Clock, CheckCircle, Users, ArrowUpDown } from 'lucide-react';

interface StudentListWidgetProps {
  onViewStudent: (studentId: string) => void;
}

const StudentListWidget: React.FC<StudentListWidgetProps> = ({ onViewStudent }) => {
  const { students, loading, error } = useStudentContext();
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Threshold configurations for each column
  const thresholds = {
    'Attendance%': { good: 85, warning: 70 },
    'q1_avg_score': { good: 80, warning: 60 },
    'q2_avg_score': { good: 80, warning: 60 },
    'q3_avg_score': { good: 80, warning: 60 },
    'q1_trend': { good: 0.1, warning: -0.1 },
    'q2_trend': { good: 0.1, warning: -0.1 },
    'q3_trend': { good: 0.1, warning: -0.1 },
    'q1_Attempts_Used': { good: 2, warning: 4 },
    'q2_Attempts_Used': { good: 2, warning: 4 },
    'q3_Attempts_Used': { good: 2, warning: 4 },
    'Fee_Paid': { good: 1, warning: 0.5 },
    'Fee_Due_Days': { good: 0, warning: 30 },
  };

  const getThresholdColor = (value: number, field: string) => {
    const threshold = thresholds[field as keyof typeof thresholds];
    if (!threshold) return 'bg-gray-400 dark:bg-gray-600';

    if (field.includes('Attempts_Used') || field === 'Fee_Due_Days') {
      if (value <= threshold.good) return 'bg-green-400 dark:bg-green-600';
      if (value <= threshold.warning) return 'bg-yellow-400 dark:bg-yellow-600';
      return 'bg-red-400 dark:bg-red-600';
    } else {
      if (value >= threshold.good) return 'bg-green-400 dark:bg-green-600';
      if (value >= threshold.warning) return 'bg-yellow-400 dark:bg-yellow-600';
      return 'bg-red-400 dark:bg-red-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50';
      default: return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/50';
    }
  };

  const formatValue = (value: any, field: string) => {
    if (typeof value === 'number') {
      if (field.includes('trend')) {
        return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
      }
      if (field === 'Attendance%') {
        return `${value.toFixed(1)}%`;
      }
      if (field!='Fee_Paid' || !field.includes('Attempts')){
      value.toFixed(1);
      }
    }
    return value;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const tableColumns = [
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'studentId', label: 'ID', sortable: true },
    { key: 'Attendance%', label: 'Attendance', threshold: true },
    { key: 'q1_avg_score', label: 'Q1 Score', threshold: true },
    { key: 'q2_avg_score', label: 'Q2 Score', threshold: true },
    { key: 'q3_avg_score', label: 'Q3 Score', threshold: true },
    { key: 'q1_trend', label: 'Q1 Trend', threshold: true },
    { key: 'q2_trend', label: 'Q2 Trend', threshold: true },
    { key: 'q3_trend', label: 'Q3 Trend', threshold: true },
    { key: 'q1_Attempts_Used', label: 'Q1 Attempts', threshold: true },
    { key: 'q2_Attempts_Used', label: 'Q2 Attempts', threshold: true },
    { key: 'q3_Attempts_Used', label: 'Q3 Attempts', threshold: true },
    { key: 'Fee_Paid', label: 'Fee Paid', threshold: true },
    { key: 'Fee_Due_Days', label: 'Due Days', threshold: true },
    { key: 'riskLevel', label: 'Risk Level', sortable: true },
  ];

  if (loading) {
    return (
      <div className="glass-morphism rounded-2xl shadow-glass p-6">
        <div className="flex items-center justify-center">
          <div className="text-body" style={{ color: 'var(--text-muted)' }}>Loading student data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-morphism rounded-2xl shadow-glass p-6">
        <div className="flex items-center justify-center">
          <div className="alert-danger">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-2xl shadow-glass border" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} />
            <h3 className="text-heading-3 font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>Student Performance Dashboard</h3>
          </div>
          <span 
            className="text-caption font-medium px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-primary-100)',
              color: 'var(--color-primary-800)'
            }}
          >
            {students.length} Students
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-caption font-medium tracking-wider transition-smooth"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="flex items-center space-x-1">
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center space-x-1 transition-smooth hover:scale-101"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                      >
                        <span>{column.label}</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    ) : (
                      <span>{column.label}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
            {students.map((student) => (
              <tr
                key={student.id}
                onClick={() => onViewStudent(student.id)}
                className="cursor-pointer transition-smooth hover:scale-101"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                }}
              >
                {tableColumns.map((column) => {
                  const value = (student as any)[column.key]; // Type assertion to fix the indexing issue
                  const RiskIcon = getRiskIcon(student.riskLevel);
                  const riskColorClass = getRiskColor(student.riskLevel);

                  return (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.key === 'name' && (
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-smooth"
                            style={{ backgroundColor: 'var(--bg-secondary)' }}
                          >
                            <span className="text-caption font-medium" style={{ color: 'var(--text-muted)' }}>
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium transition-smooth" style={{ color: 'var(--text-primary)' }}>{student.name}</p>
                            <p className="text-body-sm transition-smooth" style={{ color: 'var(--text-muted)' }}>{student.program}</p>
                          </div>
                        </div>
                      )}
                      
                      {column.key === 'riskLevel' && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${riskColorClass} w-fit`}>
                          <RiskIcon className="w-3 h-3" />
                          <span className="text-xs font-medium capitalize">{value}</span>
                        </div>
                      )}

                      {column.threshold && column.key !== 'riskLevel' && (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getThresholdColor(value, column.key)}`}
                            title={`${column.label}: ${formatValue(value, column.key)}`}
                          ></div>
                          <span className="font-medium transition-smooth" style={{ color: 'var(--text-primary)' }}>
                            {formatValue(value, column.key)}
                          </span>
                        </div>
                      )}

                      {!column.threshold && column.key !== 'name' && column.key !== 'riskLevel' && (
                        <span className="transition-smooth" style={{ color: 'var(--text-primary)' }}>{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-body" style={{ color: 'var(--text-muted)' }}>No students found</p>
        </div>
      )}

      <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between text-body-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success-500)' }}></div>
              <span>Good Performance</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning-500)' }}></div>
              <span>Needs Attention</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-danger-500)' }}></div>
              <span>At Risk</span>
            </div>
          </div>
          <span>Showing {students.length} students</span>
        </div>
      </div>
    </div>
  );
};

export default StudentListWidget;