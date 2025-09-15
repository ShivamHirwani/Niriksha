
import React, { useState } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { Search, AlertTriangle, Clock, CheckCircle, Eye, Filter, Download, Plus } from 'lucide-react';

// Step 1: This is our main StudentList component
// It's like a full page that shows all students in a big table
const StudentList = () => {
  // Step 2: Get student data from our context (the data storage)
  const { students, loading, error } = useStudentContext();
  
  // Step 3: useState hooks - like memory boxes for things that can change
  const [searchTerm, setSearchTerm] = useState(''); // What user types in search
  const [filterRisk, setFilterRisk] = useState('all'); // Which risk level to show
  const [filterProgram, setFilterProgram] = useState('all'); // Which program to show
  const [sortBy, setSortBy] = useState('name'); // How to sort the table
  const [sortOrder, setSortOrder] = useState('asc'); // Ascending or descending
  const [selectedStudentId, setSelectedStudentId] = useState(null); // Which student is selected

  // Step 4: Filter and sort the students based on user choices
  const filteredAndSortedStudents = students
    .filter(student => {
      // Check if student matches search term (name or ID)
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if student matches risk filter
      const matchesRiskFilter = filterRisk === 'all' || student.riskLevel === filterRisk;
      
      // Check if student matches program filter
      const matchesProgramFilter = filterProgram === 'all' || student.program === filterProgram;
      
      return matchesSearch && matchesRiskFilter && matchesProgramFilter;
    })
    .sort((a, b) => {
      // Sort students based on selected column
      let aValue, bValue;
      
      switch(sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'attendance':
          aValue = a['Attendance%'];
          bValue = b['Attendance%'];
          break;
        case 'risk':
          aValue = a.riskLevel;
          bValue = b.riskLevel;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  // Step 5: Get unique programs for the filter dropdown
  const uniquePrograms = [...new Set(students.map(student => student.program))];

  // Step 6: Helper functions to get colors and icons for risk levels
  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Step 7: Handle sorting when user clicks column header
  const handleSort = (column) => {
    if (sortBy === column) {
      // If clicking same column, reverse order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking new column, set it as sort column
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Step 8: Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading students...</p>
        </div>
      </div>
    );
  }

  // Step 9: Show error state if there's a problem loading data
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">Error loading student data</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Step 10: Main component return - this is what shows on screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student List</h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor all students ({filteredAndSortedStudents.length} of {students.length} shown)
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Risk Level Filter */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Program Filter */}
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Programs</option>
              {uniquePrograms.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="risk">Sort by Risk Level</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Student {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th 
                    onClick={() => handleSort('attendance')}
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Attendance {sortBy === 'attendance' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz Scores
                  </th>
                  <th 
                    onClick={() => handleSort('risk')}
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Risk Level {sortBy === 'risk' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedStudents.map((student) => {
                  const RiskIcon = getRiskIcon(student.riskLevel);
                  const riskColor = getRiskColor(student.riskLevel);
                  const riskBadgeColor = getRiskBadgeColor(student.riskLevel);
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      {/* Student Info Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Program Column */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{student.program}</span>
                      </td>
                      
                      {/* Attendance Column */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`text-sm font-medium ${
                            student['Attendance%'] >= 90 ? 'text-green-600' :
                            student['Attendance%'] >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student['Attendance%']}%
                          </span>
                        </div>
                      </td>
                      
                      {/* Quiz Scores Column */}
                      <td className="px-6 py-4 text-center">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-center space-x-2">
                            <span className="text-gray-600">Q1: {student.q1_avg_score}</span>
                            <span className="text-gray-600">Q2: {student.q2_avg_score}</span>
                            <span className="text-gray-600">Q3: {student.q3_avg_score}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Risk Level Column */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${riskBadgeColor}`}>
                          <RiskIcon className="w-3 h-3 mr-1" />
                          {student.riskLevel}
                        </span>
                      </td>
                      
                      {/* Fee Status Column */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.Fee_Paid === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.Fee_Paid === 100 ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewStudent(student.id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAndSortedStudents.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No students found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {filteredAndSortedStudents.length} of {students.length} students
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;