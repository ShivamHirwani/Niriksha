import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { AlertTriangle, Users, TrendingUp, Bell, ArrowUp, ArrowDown } from 'lucide-react';

const QuickStats: React.FC = () => {
  const { students, alerts } = useStudentContext();
  
  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = students.filter(s => s.riskLevel === 'medium').length;
  const totalStudents = students.length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  
  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      gradient: 'gradient-primary',
      trend: { value: 5.2, type: 'up', label: 'this month' },
      description: 'Active enrolled students'
    },
    {
      title: 'High Risk',
      value: highRiskCount,
      icon: AlertTriangle,
      gradient: 'gradient-secondary',
      trend: { value: 2.1, type: 'down', label: 'from last week' },
      description: 'Requiring immediate attention'
    },
    {
      title: 'Medium Risk',
      value: mediumRiskCount,
      icon: TrendingUp,
      gradient: 'gradient-success',
      trend: { value: 1.8, type: 'up', label: 'from last week' },
      description: 'Monitoring recommended'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      icon: Bell,
      gradient: 'gradient-primary',
      trend: { value: 3, type: 'new', label: 'new today' },
      description: 'Unresolved notifications'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const { value: animatedValue } = useAnimatedCounter(stat.value, {
          duration: 1000,
          delay: index * 200
        });
        const TrendIcon = stat.trend.type === 'up' ? ArrowUp : stat.trend.type === 'down' ? ArrowDown : Bell;
        
        return (
          <div 
            key={stat.title} 
            className="glass-morphism p-6 rounded-2xl shadow-glass hover:shadow-lg transition-smooth transform hover:scale-101 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-body-sm font-medium text-caption" style={{ color: 'var(--text-muted)' }}>
                  {stat.title}
                </p>
                <p className="text-heading-2 font-bold mt-2 transition-smooth" style={{ color: 'var(--text-primary)' }}>
                  {animatedValue}
                </p>
              </div>
              <div className={`${stat.gradient} p-4 rounded-xl shadow-glass`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendIcon 
                  className={`w-4 h-4`}
                  style={{ 
                    color: stat.trend.type === 'up' ? 'var(--color-success-dark, #10b981)' : 
                           stat.trend.type === 'down' ? 'var(--color-danger-dark, #ef4444)' : 'var(--color-info-dark, #06b6d4)'
                  }}
                />
                <span 
                  className={`text-body-sm font-medium`}
                  style={{ 
                    color: stat.trend.type === 'up' ? 'var(--color-success-dark, #059669)' : 
                           stat.trend.type === 'down' ? 'var(--color-danger-dark, #dc2626)' : 'var(--color-info-dark, #0891b2)'
                  }}
                >
                  {stat.trend.type === 'new' ? stat.trend.value : `${stat.trend.value}%`}
                </span>
                <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
                  {stat.trend.label}
                </span>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;