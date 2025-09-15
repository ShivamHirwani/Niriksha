import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Clock, User, Bell } from 'lucide-react';

interface RecentAlertsProps {
  onViewStudent: (studentId: string) => void;
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ onViewStudent }) => {
  const { alerts, students } = useStudentContext();
  
  const recentAlerts = alerts
    .filter(alert => !alert.resolved)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return Bell;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50';
      default: return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50';
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
        <span className="bg-red-100 text-red-800 dark:bg-gray-900 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {recentAlerts.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {recentAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active alerts</p>
          </div>
        ) : (
          recentAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.severity);
            const colorClass = getAlertColor(alert.severity);
            
            return (
              <div key={alert.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {alert.title}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onViewStudent(alert.studentId)}
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <User className="w-3 h-3" />
                        <span>{getStudentName(alert.studentId)}</span>
                      </button>
                      
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {recentAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            View All Alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;