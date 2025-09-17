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
    <div className="space-y-8 animate-fade-in">
      {/* 🚀 Quick Stats with Enhanced Animation */}
      <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <QuickStats />
      </div>
      
      {/* 📊 Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart - Full Width */}
        <div className="lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <TrendChart />
        </div>
        
        {/* Risk Overview & Recent Alerts */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
          <RiskOverview onViewStudent={onViewStudent} />
        </div>
        <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
          <RecentAlerts onViewStudent={onViewStudent} />
        </div>
      </div>
      
      {/* 👥 Student List Widget */}
      <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <StudentListWidget onViewStudent={onViewStudent} />
      </div>
    </div>
  );
};

export default Dashboard;