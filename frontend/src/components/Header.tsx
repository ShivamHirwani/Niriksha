import React from 'react';
import { GraduationCap, BarChart3, Users, Upload, Settings, LogOut, User } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'import', label: 'Data Import', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduWatch</h1>
              <p className="text-sm text-gray-500">Dropout Prediction System</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                  {user.role}
                </span>
              </div>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;