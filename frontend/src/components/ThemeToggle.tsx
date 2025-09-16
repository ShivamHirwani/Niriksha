﻿﻿﻿﻿﻿﻿﻿import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      color: 'text-amber-500',
      activeColor: '#f59e0b'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      color: 'text-purple-400',
      activeColor: '#a78bfa'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <div className="flex items-center gap-4">
      <div 
        className="flex items-center gap-1 px-3 py-2 rounded-xl shadow-sm border"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = themeOption.id === theme;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`
                relative p-2.5 rounded-lg transition-all duration-300 ease-out
                ${isActive 
                  ? 'scale-110 shadow-lg transform' 
                  : 'opacity-60 hover:opacity-90 hover:scale-105'
                }
              `}
              style={{
                backgroundColor: isActive ? 'var(--color-focus)' : 'transparent',
                boxShadow: isActive 
                  ? `0 4px 12px ${themeOption.activeColor}25, 0 2px 4px ${themeOption.activeColor}15`
                  : 'none'
              }}
              title={`Switch to ${themeOption.name} theme`}
            >
              <Icon 
                className={`w-4 h-4 transition-colors duration-300 ${
                  isActive ? themeOption.color : ''
                }`}
                style={{
                  color: isActive ? themeOption.activeColor : 'var(--text-muted)'
                }}
              />
              
              {isActive && (
                <div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: themeOption.activeColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden sm:block">
        <div className="text-right">
          <div 
            className="text-sm font-medium leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentTheme?.name}
          </div>
          <div 
            className="text-xs leading-tight"
            style={{ color: 'var(--text-muted)' }}
          >
            Mode
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="group relative p-2.5 rounded-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
          style={{ 
            backgroundColor: 'var(--color-focus)',
            border: '1px solid var(--border-primary)'
          }}
          title={`Current: ${currentTheme?.name} - Click to toggle (Ctrl+T)`}
        >
          {currentTheme && (
            <currentTheme.icon 
              className="w-4 h-4 transition-all duration-300"
              style={{ color: currentTheme.activeColor }}
            />
          )}
          
          <Zap 
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 opacity-0 group-hover:opacity-70 transition-opacity duration-300"
            style={{ color: 'var(--color-primary)' }}
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;