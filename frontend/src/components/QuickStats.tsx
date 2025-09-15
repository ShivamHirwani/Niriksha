import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import { AlertTriangle, Users, TrendingUp, Bell } from 'lucide-react';

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
      color: 'bg-blue-500',
      trend: '+5.2% this month'
    },
    {
      title: 'High Risk',
      value: highRiskCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: '-2.1% from last week'
    },
    {
      title: 'Medium Risk',
      value: mediumRiskCount,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      trend: '+1.8% from last week'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      icon: Bell,
      color: 'bg-orange-500',
      trend: '3 new today'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;