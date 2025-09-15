import React from 'react';
import { useStudentContext } from '../context/StudentContext';
import RiskOverview from './RiskOverview';
import TrendChart from './TrendChart';
import RecentAlerts from './RecentAlerts';
import QuickStats from './QuickStats';
import StudentListWidget from './StudentListWidget';

interface DashboardProps {
  onViewStudent: (studentId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewStudent }) => {
  const { students } = useStudentContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor student risk levels and early warning indicators</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        
        <RiskOverview onViewStudent={onViewStudent} />
        <RecentAlerts onViewStudent={onViewStudent} />
      </div>
      
      <div className="mt-6">
        <StudentListWidget onViewStudent={onViewStudent} />
      </div>
    </div>
  );
};

export default Dashboard;