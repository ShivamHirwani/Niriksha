import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import DataImport from './components/DataImport';
import Settings from './components/Settings';
import Header from './components/Header';
import Report from './components/Report';
import ToastContainer from './components/ToastContainer';
import ThemeIndicator from './components/ThemeIndicator';
import InstallPrompt from './components/InstallPrompt';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import AdvancedSearch, { SearchFilters } from './components/AdvancedSearch';
import { StudentProvider } from './context/StudentContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import usePWA from './hooks/usePWA';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    riskLevel: '',
    dateRange: '',
    department: '',
    status: ''
  });
  const { theme } = useTheme();
  const { isOnline } = usePWA();

  // Initialize PWA service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Handle navigation events from keyboard shortcuts
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveView(event.detail.view);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Custom keyboard shortcuts for this component
  const shortcuts = [
    {
      id: 'show-shortcuts',
      key: '?',
      action: () => setShowKeyboardShortcuts(true),
      description: 'Show keyboard shortcuts',
      category: 'General'
    },
    {
      id: 'advanced-search',
      key: 'f',
      ctrlKey: true,
      action: () => setShowAdvancedSearch(true),
      description: 'Open advanced search',
      category: 'General'
    }
  ];
  
  useKeyboardShortcuts(shortcuts);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simple demo authentication - in real app, this would validate against backend
    setUser({
      email: credentials.username,
      role: credentials.username.includes('admin') ? 'admin' :
        credentials.username.includes('counselor') ? 'counselor' : 'teacher'
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('dashboard');
    setSelectedStudent(null);
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // In a real app, this would filter the data
    console.log('Search filters updated:', filters);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewStudent={(id: string) => {
          setSelectedStudent(id);
          setActiveView('student-detail');
        }} />;
      case 'students':
        return <StudentList onSelectStudent={(id: string) => {
          setSelectedStudent(id);
          setActiveView('student-detail');
        }} />;
      case 'student-detail':
        return <StudentDetail
          studentId={selectedStudent}
          onBack={() => setActiveView('students')}
        />;
      case 'import':
        return <DataImport />;
      case 'report':
        return <Report />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewStudent={(id: string) => {
          setSelectedStudent(id);
          setActiveView('student-detail');
        }} />;
    }
  };

  return (
    <div className={`${theme} min-h-screen`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-20 lg:h-20"></div>
      
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="sticky top-20 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
          <div className="w-full px-6 lg:px-8 py-3">
            <div className="text-center text-sm font-medium">
              ⚠️ You are currently offline. Some features may be limited.
            </div>
          </div>
        </div>
      )}
      
      <main className="w-full px-6 lg:px-8 py-8 min-h-screen">
        {/* Added max-w-7xl for better content alignment */}
        <div className="max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
      
      {/* Global Components */}
      <ToastContainer />
      <ThemeIndicator />
      
      {/* Modals */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
          shortcuts={shortcuts}
        />
      )}
      
      {showAdvancedSearch && (
        <AdvancedSearch
          onSearch={handleSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <StudentProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </StudentProvider>
  );
}

export default App;