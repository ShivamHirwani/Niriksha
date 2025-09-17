import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Users, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const [riskThresholds, setRiskThresholds] = useState({
    attendance: { high: 60, medium: 80 },
    gpa: { high: 2.0, medium: 2.5 },
    attempts: { high: 2, medium: 1 }
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    pushNotifications: true,
    dailyReports: true,
    weeklyReports: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    dataRetention: 365,
    sessionTimeout: 30,
    maxLoginAttempts: 3
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure risk thresholds, notifications, and system preferences</p>
      </div>

      {/* Risk Thresholds */}
      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Assessment Thresholds</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attendance Rate (%)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">High Risk (below)</label>
                <input
                  type="number"
                  value={riskThresholds.attendance.high}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    attendance: { ...prev.attendance, high: parseInt(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Medium Risk (below)</label>
                <input
                  type="number"
                  value={riskThresholds.attendance.medium}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    attendance: { ...prev.attendance, medium: parseInt(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GPA Threshold
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">High Risk (below)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskThresholds.gpa.high}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    gpa: { ...prev.gpa, high: parseFloat(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Medium Risk (below)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskThresholds.gpa.medium}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    gpa: { ...prev.gpa, medium: parseFloat(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject Attempts
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">High Risk (at/above)</label>
                <input
                  type="number"
                  value={riskThresholds.attempts.high}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    attempts: { ...prev.attempts, high: parseInt(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Medium Risk (at/above)</label>
                <input
                  type="number"
                  value={riskThresholds.attempts.medium}
                  onChange={(e) => setRiskThresholds(prev => ({
                    ...prev,
                    attempts: { ...prev.attempts, medium: parseInt(e.target.value) }
                  }))}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {key === 'email' && 'Send alerts and reports via email'}
                  {key === 'sms' && 'Send critical alerts via SMS'}
                  {key === 'pushNotifications' && 'Browser push notifications'}
                  {key === 'dailyReports' && 'Daily summary reports'}
                  {key === 'weeklyReports' && 'Weekly analytics reports'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic Backup</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Enable daily automatic data backups</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.autoBackup}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              value={systemSettings.dataRetention}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={systemSettings.sessionTimeout}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={systemSettings.maxLoginAttempts}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;