import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(credentials);
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (role: string) => {
    const demoCredentials = {
      admin: { username: 'admin@eduwatch.com', password: 'admin123' },
      counselor: { username: 'counselor@eduwatch.com', password: 'counselor123' },
      teacher: { username: 'teacher@eduwatch.com', password: 'teacher123' }
    };
    
    const creds = demoCredentials[role as keyof typeof demoCredentials];
    setCredentials(creds);
    onLogin(creds);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl inline-block mb-4 shadow-lg">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduWatch</h1>
          <p className="text-gray-600">AI-Powered Dropout Prevention System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts</p>
            <div className="space-y-2">
              {[
                { role: 'admin', label: 'Administrator', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                { role: 'counselor', label: 'Counselor', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                { role: 'teacher', label: 'Teacher', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' }
              ].map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => handleDemoLogin(demo.role)}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${demo.color}`}
                >
                  Login as {demo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Secure access to student data and analytics
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2024 EduWatch. Built for educational institutions.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;