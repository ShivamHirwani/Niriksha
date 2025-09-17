﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        className="group relative p-2.5 rounded-lg transition-all duration-300 ease-out hover:scale-101 active:scale-99"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
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
  );
};

export default ThemeToggle;