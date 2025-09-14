import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';

interface StudentListWidgetProps {
  onViewStudent: (studentId: string) => void;
}

const StudentListWidget: React.FC<StudentListWidgetProps> = ({ onViewStudent }) => {
  const { students } = useStudentContext();

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {students.length} Total
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {students.map((student) => {
          const RiskIcon = getRiskIcon(student.riskLevel);
          const riskColorClass = getRiskColor(student.riskLevel);
          
          return (
            <div
              key={student.id}
              onClick={() => onViewStudent(student.id)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentId} • {student.program}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{student.attendanceRate}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{student.currentGPA}</p>
                  <p className="text-xs text-gray-500">GPA</p>
                </div>

                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${riskColorClass}`}>
                  <RiskIcon className="w-3 h-3" />
                  <span className="text-xs font-medium capitalize">{student.riskLevel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => {/* Navigate to full student list */}}
          className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
        >
          View All Students →
        </button>
      </div>
    </div>
  );
};

export default StudentListWidget;