import React from 'react';
import { GraduationCap, BarChart3, Users, Upload, Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'import', label: 'Data Import', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduWatch</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dropout Prediction System</p>
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
                      ? 'bg-blue-100 text-blue-700 dark:bg-gray-900 dark:text-blue-200 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
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
               <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-gray-900 dark:text-blue-200 rounded-full text-xs font-medium capitalize">
                  {user.role}
                </span>
              </div>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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