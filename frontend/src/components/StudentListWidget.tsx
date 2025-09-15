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

  // Debug logs
  console.log('Component Debug Info:');
  console.log('- Loading:', loading);
  console.log('- Error:', error);
  console.log('- Students count:', students?.length);
  console.log('- Students data:', students);

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
    'Fee_Paid': { good: 100, warning: 50 },
    'Fee_Due_Days': { good: 0, warning: 30 },
  };

  const getThresholdColor = (value: number, field: string) => {
    const threshold = thresholds[field];
    if (!threshold) return 'bg-gray-400';

    if (field.includes('Attempts_Used') || field === 'Fee_Due_Days') {
      if (value <= threshold.good) return 'bg-green-400';
      if (value <= threshold.warning) return 'bg-yellow-400';
      return 'bg-red-400';
    } else {
      if (value >= threshold.good) return 'bg-green-400';
      if (value >= threshold.warning) return 'bg-yellow-400';
      return 'bg-red-400';
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
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const formatValue = (value: any, field: string) => {
    if (typeof value === 'number') {
      if (field.includes('trend')) {
        return value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
      }
      if (field === 'Attendance%' || field === 'Fee_Paid') {
        return `${value.toFixed(1)}%`;
      }
      return value.toFixed(1);
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="text-gray-500">Loading student data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Student Performance Dashboard</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {students.length} Students
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-1">
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center space-x-1 hover:text-gray-700"
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
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student.id}
                onClick={() => onViewStudent(student.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {tableColumns.map((column) => {
                  const value = (student as any)[column.key]; // Type assertion to fix the indexing issue
                  const RiskIcon = getRiskIcon(student.riskLevel);
                  const riskColorClass = getRiskColor(student.riskLevel);

                  return (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.key === 'name' && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.program}</p>
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
                          <span className="text-gray-900 font-medium">
                            {formatValue(value, column.key)}
                          </span>
                        </div>
                      )}

                      {!column.threshold && column.key !== 'name' && column.key !== 'riskLevel' && (
                        <span className="text-gray-900">{value}</span>
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
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found</p>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Good Performance</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Needs Attention</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
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