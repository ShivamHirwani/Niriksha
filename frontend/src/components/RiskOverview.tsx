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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
      
      <div className="space-y-4">
        {Object.entries(riskGroups).map(([level, studentList]) => {
          const Icon = getRiskIcon(level);
          const colorClass = getRiskColor(level);
          
          return (
            <div key={level} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
                  <span className="font-medium capitalize text-gray-900">{level} Risk</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                    {studentList.length} students
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {studentList.slice(0, 3).map((student) => (
                  <div 
                    key={student.id}
                    onClick={() => onViewStudent(student.id)}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">Score: {student.riskScore}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Attendance: {student.attendanceRate}%</p>
                      <p className="text-xs text-gray-500">GPA: {student.currentGPA}</p>
                    </div>
                  </div>
                ))}
                
                {studentList.length > 3 && (
                  <button className="w-full text-sm text-blue-600 hover:text-blue-800 py-2">
                    View {studentList.length - 3} more...
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