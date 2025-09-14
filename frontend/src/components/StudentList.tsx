import React, { useState } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { Search, Filter, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface StudentListProps {
  onSelectStudent: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onSelectStudent }) => {
  const { students } = useStudentContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || student.riskLevel === filterRisk;
    return matchesSearch && matchesFilter;
  });

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all students in the system</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredStudents.map((student) => {
            const RiskIcon = getRiskIcon(student.riskLevel);
            const riskColorClass = getRiskColor(student.riskLevel);
            
            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                      <p className="text-sm text-gray-500">{student.program}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{student.attendanceRate}%</p>
                      <p className="text-xs text-gray-500">Attendance</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{student.currentGPA}</p>
                      <p className="text-xs text-gray-500">GPA</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{student.riskScore}%</p>
                      <p className="text-xs text-gray-500">Risk Score</p>
                    </div>

                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${riskColorClass}`}>
                      <RiskIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{student.riskLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;