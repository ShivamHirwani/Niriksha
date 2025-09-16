import React, { useState } from 'react';
import { Search, Filter, X, Calendar, User, AlertTriangle } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

export interface SearchFilters {
  query: string;
  riskLevel: string;
  dateRange: string;
  department: string;
  status: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onClose }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    riskLevel: '',
    dateRange: '',
    department: '',
    status: ''
  });

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      query: '',
      riskLevel: '',
      dateRange: '',
      department: '',
      status: ''
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="w-full max-w-2xl mx-4 rounded-lg shadow-xl"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Advanced Search
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 space-y-6">
          {/* Main Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search students, ID, or keywords..."
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleInputChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <User className="w-4 h-4 inline mr-2" />
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">All Departments</option>
                <option value="computer-science">Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="business">Business</option>
                <option value="arts">Arts & Sciences</option>
                <option value="medicine">Medicine</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--text-muted)'
              }}
            >
              Clear Filters
            </button>
            
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Press <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">Ctrl+F</kbd> to open search
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;