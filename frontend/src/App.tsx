import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import DataImport from './components/DataImport';
import Settings from './components/Settings';
import Header from './components/Header';
import { StudentProvider } from './context/StudentContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewStudent={(id) => {
          setSelectedStudent(id);
          setActiveView('student-detail');
        }} />;
      case 'students':
        return <StudentList onSelectStudent={(id) => {
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
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewStudent={(id) => {
          setSelectedStudent(id);
          setActiveView('student-detail');
        }} />;
    }
  };

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          activeView={activeView} 
          onViewChange={setActiveView}
          user={user}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 py-6">
          {renderContent()}
        </main>
      </div>
    </StudentProvider>
  );
}

export default App;