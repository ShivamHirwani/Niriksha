import React, { useState } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { Search, AlertTriangle, Clock, CheckCircle, Eye, Filter, Download, Plus } from 'lucide-react';

// Step 1: This is our main StudentList component
// It's like a full page that shows all students in a big table
const StudentList = ({ onSelectStudent }) => {
  // Step 2: Get student data from our context (the data storage)
  const { students, loading, error } = useStudentContext();

  // Step 3: useState hooks - like memory boxes for things that can change
  const [searchTerm, setSearchTerm] = useState(''); // What user types in search
  const [filterRisk, setFilterRisk] = useState('all'); // Which risk level to show
  const [filterProgram, setFilterProgram] = useState('all'); // Which program to show
  const [sortBy, setSortBy] = useState('name'); // How to sort the table
  const [sortOrder, setSortOrder] = useState('asc'); // Ascending or descending

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

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'attendance':
          aValue = a['Attendance%'];
          bValue = b['Attendance%'];
          break;
        case 'risk':
          const riskOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = riskOrder[a.riskLevel];
          bValue = riskOrder[b.riskLevel];
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

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700';
      default: return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700';
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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading students...</p>
      </div>
    );
  }

  // Step 9: Show error state if there's a problem loading data
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg font-medium">Error loading student data</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  // Step 10: Main component return - this is what shows on screen
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student List</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and monitor all students ({filteredAndSortedStudents.length} of {students.length} shown)
        </p>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters & Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Programs</option>
            {uniquePrograms.map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Student {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Program
                </th>
                <th
                  onClick={() => handleSort('attendance')}
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Attendance {sortBy === 'attendance' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('risk')}
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Risk Level {sortBy === 'risk' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fee Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredAndSortedStudents.map((student) => {
                const RiskIcon = getRiskIcon(student.riskLevel);
                const riskBadgeColor = getRiskBadgeColor(student.riskLevel);

                return (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    {/* Student Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {student.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Program Column */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-300">{student.program}</span>
                    </td>

                    {/* Attendance Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`text-sm font-medium ${student['Attendance%'] >= 90 ? 'text-green-600 dark:text-green-400' :
                            student['Attendance%'] >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                          {student['Attendance%']}%
                        </span>
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.Fee_Paid === 100 ? 'bg-green-100 text-green-800 dark:bg-gray-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-gray-900 dark:text-red-200'
                        }`}>
                        {student.Fee_Paid === 100 ? 'Paid' : 'Pending'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onSelectStudent(student.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition-colors"
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
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">No students found</p>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-b-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing {filteredAndSortedStudents.length} of {students.length} students
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
