import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeIndicator: React.FC = () => {
  const { theme } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return {
          icon: Sun,
          name: 'Light Mode',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
      case 'dark':
        return {
          icon: Moon,
          name: 'Dark Mode',
          color: 'text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        };
      default:
        return {
          icon: Sun,
          name: 'Light Mode',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        };
    }
  };

  const themeInfo = getThemeInfo();
  const Icon = themeInfo.icon;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg border ${themeInfo.bgColor}`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}
      >
        <Icon className={`w-4 h-4 ${themeInfo.color}`} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          {themeInfo.name}
        </span>
      </div>
    </div>
  );
};

export default ThemeIndicator;