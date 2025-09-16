import React, { useState, useEffect } from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Clock, User, Bell, X, CheckCircle2, Zap } from 'lucide-react';

interface RecentAlertsProps {
  onViewStudent: (studentId: string) => void;
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ onViewStudent }) => {
  const { alerts, students } = useStudentContext();
  const [dismissingAlerts, setDismissingAlerts] = useState<Set<string>>(new Set());
  const [visibleAlerts, setVisibleAlerts] = useState<string[]>([]);
  
  const recentAlerts = alerts
    .filter(alert => !alert.resolved)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Staggered animation for alerts appearing
  useEffect(() => {
    const alertIds = recentAlerts.map(alert => alert.id);
    setVisibleAlerts([]);
    
    alertIds.forEach((id, index) => {
      setTimeout(() => {
        setVisibleAlerts(prev => [...prev, id]);
      }, index * 150);
    });
  }, [recentAlerts.length]);

  // Time ago formatter
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  // Dismiss alert with animation
  const handleDismissAlert = async (alertId: string) => {
    setDismissingAlerts(prev => new Set([...prev, alertId]));
    
    // Wait for exit animation
    setTimeout(() => {
      // In a real app, you would call an API to update the alert
      // For now, we'll just remove it from the dismissing set
      setDismissingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }, 300);
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return Bell;
    }
  };

  const getAlertGradient = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getAlertBorderColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 dark:border-red-800';
      case 'medium': return 'border-yellow-200 dark:border-yellow-800';
      default: return 'border-blue-200 dark:border-blue-800';
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div className="glass-morphism p-6 rounded-2xl shadow-glass animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-heading-3 font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>
            Recent Alerts
          </h3>
          <p className="text-body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Latest student risk notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full" style={{ background: 'var(--gradient-secondary)' }}>
            <Bell className="w-4 h-4 text-white" />
            <span className="text-body-sm font-medium text-white">
              {recentAlerts.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Alerts List */}
      <div className="space-y-4">
        {recentAlerts.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="relative">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500 animate-pulse-soft" />
              <Zap className="w-6 h-6 absolute top-0 right-1/2 transform translate-x-8 -translate-y-2 text-yellow-400" />
            </div>
            <h4 className="text-heading-3 font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              All Clear!
            </h4>
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
              No active alerts. Your students are doing great!
            </p>
          </div>
        ) : (
          recentAlerts
            .filter(alert => !dismissingAlerts.has(alert.id))
            .map((alert, index) => {
              const Icon = getAlertIcon(alert.severity);
              const gradientClass = getAlertGradient(alert.severity);
              const borderClass = getAlertBorderColor(alert.severity);
              const isVisible = visibleAlerts.includes(alert.id);
              
              return (
                <div
                  key={alert.id}
                  className={`
                    relative border rounded-2xl p-5 transition-smooth transform hover:scale-102
                    ${borderClass} ${isVisible ? 'animate-slide-in-right opacity-100' : 'opacity-0'}
                    hover:shadow-glass
                  `}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Dismiss Button */}
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="absolute top-3 right-3 p-1 rounded-full transition-smooth hover:scale-110 active:scale-95"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </button>
                  
                  <div className="flex items-start space-x-4">
                    {/* Gradient Icon */}
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClass} shadow-glass`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-8">
                      {/* Alert Title and Severity */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-body font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {alert.title}
                        </h4>
                        <span 
                          className={`px-3 py-1 text-caption font-medium rounded-full bg-gradient-to-r ${gradientClass} text-white shadow-sm`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Alert Message */}
                      <p className="text-body-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {alert.message}
                      </p>
                      
                      {/* Student Info and Time */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onViewStudent(alert.studentId)}
                          className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-smooth hover:scale-105 active:scale-95"
                          style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-body-sm font-medium">
                            {getStudentName(alert.studentId)}
                          </span>
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span className="text-body-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                            {getTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Enhanced Footer */}
      {recentAlerts.length > 0 && (
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <button 
            className="w-full py-3 rounded-xl transition-smooth transform hover:scale-105 active:scale-95 font-medium"
            style={{ 
              backgroundColor: 'var(--color-primary-50)',
              color: 'var(--color-primary-600)'
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>View All Alerts</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;