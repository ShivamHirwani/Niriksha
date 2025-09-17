import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Upload, Settings, LogOut, User, FileText, HelpCircle, Download, Wifi, WifiOff } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import InstallPrompt from './InstallPrompt';
import ExportModal from './ExportModal';
import useKeyboardShortcuts, { KeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import usePWA from '../hooks/usePWA';
import { useTheme } from '../context/ThemeContext';
import { useStudentContext } from '../context/StudentContext';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, user, onLogout }) => {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDataType, setExportDataType] = useState<'students' | 'alerts'>('students');
  const [isOfflineNotificationShown, setIsOfflineNotificationShown] = useState(false);
  
  const { toggleTheme } = useTheme();
  const { students, alerts } = useStudentContext();
  const { 
    isOnline, 
    installPrompt, 
    isInstalled, 
    isStandalone,
    installPWA,
    dismissInstallPrompt 
  } = usePWA();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, ariaLabel: 'Go to Dashboard (Alt+1)', shortcut: 'Alt+1' },
    { id: 'students', label: 'Students', icon: Users, ariaLabel: 'Go to Students (Alt+2)', shortcut: 'Alt+2' },
    { id: 'import', label: 'Data Import', icon: Upload, ariaLabel: 'Go to Data Import (Alt+3)', shortcut: 'Alt+3' },
    { id: 'report', label: 'Report', icon: FileText, ariaLabel: 'Go to Report (Alt+4)', shortcut: 'Alt+4' },
    { id: 'settings', label: 'Settings', icon: Settings, ariaLabel: 'Go to Settings', shortcut: '' },
  ];

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      id: 'theme-toggle',
      key: 't',
      ctrlKey: true,
      description: 'Toggle theme',
      category: 'Theme',
      action: toggleTheme,
    },
    {
      id: 'show-shortcuts',
      key: '?',
      description: 'Show keyboard shortcuts',
      category: 'General',
      action: () => setShowShortcutsModal(true),
    },
    {
      id: 'close-modal',
      key: 'Escape',
      description: 'Close modal or dialog',
      category: 'General',
      action: () => {
        setShowShortcutsModal(false);
        setShowExportModal(false);
        if (installPrompt) {
          dismissInstallPrompt();
        }
      },
    },
    {
      id: 'logout',
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
      description: 'Logout',
      category: 'System',
      action: () => onLogout && onLogout(),
      disabled: !onLogout,
    },
    {
      id: 'nav-dashboard',
      key: '1',
      altKey: true,
      description: 'Go to Dashboard',
      category: 'Navigation',
      action: () => onViewChange('dashboard'),
    },
    {
      id: 'nav-students',
      key: '2',
      altKey: true,
      description: 'Go to Students',
      category: 'Navigation',
      action: () => onViewChange('students'),
    },
    {
      id: 'nav-import',
      key: '3',
      altKey: true,
      description: 'Go to Data Import',
      category: 'Navigation',
      action: () => onViewChange('import'),
    },
    {
      id: 'nav-report',
      key: '4',
      altKey: true,
      description: 'Go to Report',
      category: 'Navigation',
      action: () => onViewChange('report'),
    },
  ];

  // Register keyboard shortcuts
  useKeyboardShortcuts(shortcuts);

  // Handle offline status
  useEffect(() => {
    if (!isOnline && !isOfflineNotificationShown) {
      setIsOfflineNotificationShown(true);
      // You could show a toast notification here
    } else if (isOnline && isOfflineNotificationShown) {
      setIsOfflineNotificationShown(false);
    }
  }, [isOnline, isOfflineNotificationShown]);

  const handleExportStudents = () => {
    setExportDataType('students');
    setShowExportModal(true);
  };

  const handleExportAlerts = () => {
    setExportDataType('alerts');
    setShowExportModal(true);
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b transition-smooth" 
        style={{ borderColor: 'var(--border-primary)' }}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="w-full px-6 lg:px-8">
          {/* Main header content with improved alignment */}
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand - Left Section */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <div className="p-2 rounded-2xl shadow-glass transform hover:scale-105 transition-smooth" role="img" aria-label="Smart India Hackathon Logo">
                <img src="/SIH2.webp" alt="Smart India Hackathon Logo" className="w-12 h-12 object-contain" />
              </div>
            </div>

            {/* Main Navigation - Center Section */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-4" 
                 role="navigation" 
                 aria-label="Main menu">
              <div className="flex items-center space-x-2 bg-opacity-50 rounded-2xl p-2" 
                   style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`
                        flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200
                        transform hover:scale-101 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${activeView === item.id ? 'font-semibold shadow-lg scale-105' : 'hover:shadow-sm'}
                      `}
                      style={{
                        backgroundColor: activeView === item.id ? 'var(--color-primary-100)' : 'transparent',
                        color: activeView === item.id ? 'var(--color-primary-600)' : 'var(--text-muted)',
                        '--tw-ring-color': 'var(--color-primary-500)'
                      } as React.CSSProperties}
                      aria-label={item.ariaLabel}
                      aria-current={activeView === item.id ? 'page' : undefined}
                      title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                      onMouseEnter={(e) => {
                        if (activeView !== item.id) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeView !== item.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Actions - Right Section */}
            {user && (
              <div className="flex items-center justify-end min-w-0 flex-shrink-0">
                {/* Action Buttons Group */}
                <div className="flex items-center space-x-2 bg-opacity-50 rounded-xl p-1" 
                     style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  
                  {/* Export */}
                  <button
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-101 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      color: 'var(--text-muted)',
                      '--tw-ring-color': 'var(--color-primary-500)'
                    } as React.CSSProperties}
                    title="Export data (students/alerts)"
                    onClick={handleExportStudents}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden md:inline text-sm">Export</span>
                  </button>

                  {/* Theme Toggle - Simplified with only the toggle button */}
                  <div className="px-1">
                    <ThemeToggle />
                  </div>
                  
                  {/* Help */}
                  <button
                    onClick={() => setShowShortcutsModal(true)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-101 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      color: 'var(--text-muted)',
                      '--tw-ring-color': 'var(--color-primary-500)'
                    } as React.CSSProperties}
                    title="Show keyboard shortcuts (?)"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <HelpCircle className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden md:inline text-sm">Help</span>
                  </button>
                </div>
                
                {/* User Profile Section */}
                <div className="flex items-center space-x-3 ml-4 px-4 py-2 rounded-xl" 
                     style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                         style={{ background: 'var(--gradient-primary)' }}>
                      <User className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.email}
                      </span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                        style={{
                          background: 'var(--gradient-primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Logout */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-101 active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        color: 'var(--text-muted)',
                        '--tw-ring-color': 'var(--color-danger-500)'
                      } as React.CSSProperties}
                      title="Logout (Ctrl+Shift+L)"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-danger-50)';
                        e.currentTarget.style.color = 'var(--color-danger-600)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden lg:inline text-sm">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="px-6 py-3">
            <div className="flex items-center justify-between space-x-2">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`
                      flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200
                      transform hover:scale-101 active:scale-98
                      ${activeView === item.id ? 'font-semibold' : ''}
                    `}
                    style={{
                      backgroundColor: activeView === item.id ? 'var(--color-primary-100)' : 'transparent',
                      color: activeView === item.id ? 'var(--color-primary-600)' : 'var(--text-muted)'
                    }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Settings for mobile */}
              <button
                onClick={() => onViewChange('settings')}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200
                  transform hover:scale-101 active:scale-98
                  ${activeView === 'settings' ? 'font-semibold' : ''}
                `}
                style={{
                  backgroundColor: activeView === 'settings' ? 'var(--color-primary-100)' : 'transparent',
                  color: activeView === 'settings' ? 'var(--color-primary-600)' : 'var(--text-muted)'
                }}
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        shortcuts={shortcuts}
      />

      {/* PWA Install Prompt */}
      {installPrompt && !isInstalled && !isStandalone && (
        <InstallPrompt
          isVisible={true}
          onInstall={installPWA}
          onDismiss={dismissInstallPrompt}
          platform={installPrompt.platform}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={exportDataType === 'students' ? students : alerts}
        dataType={exportDataType}
        title={`Export ${exportDataType === 'students' ? 'Students' : 'Alerts'} Data`}
      />
    </>
  );
};

export default Header;