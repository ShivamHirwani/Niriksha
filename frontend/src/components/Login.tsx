import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

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
      admin: { username: 'admin@niriksha.com', password: 'admin123' },
      counselor: { username: 'counselor@niriksha.com', password: 'counselor123' },
      teacher: { username: 'teacher@niriksha.com', password: 'teacher123' }
    };
    
    const creds = demoCredentials[role as keyof typeof demoCredentials];
    setCredentials(creds);
    onLogin(creds);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-black dark:via-black dark:to-blue-900/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="p-2 rounded-2xl inline-block mb-4 shadow-lg bg-white dark:bg-gray-900">
            <img src="../../SIH2.webp" alt="Smart India Hackathon Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Niriksha</h1>
          <p className="text-gray-600 dark:text-gray-400">AI-Powered Dropout Prevention System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">Demo Accounts</p>
            <div className="space-y-2">
              {[
                { role: 'admin', label: 'Administrator', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-gray-900 dark:text-purple-200 dark:hover:bg-gray-800' },
                { role: 'counselor', label: 'Counselor', color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-gray-900 dark:text-green-200 dark:hover:bg-gray-800' },
                { role: 'teacher', label: 'Teacher', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-gray-900 dark:text-blue-200 dark:hover:bg-gray-800' }
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure access to student data and analytics
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Niriksha. Built for educational institutions.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;