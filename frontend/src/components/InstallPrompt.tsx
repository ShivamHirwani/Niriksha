import React, { useState } from 'react';
import { X, Download, Smartphone, Monitor, Zap, Shield, Wifi, Bell } from 'lucide-react';
import usePWA from '../hooks/usePWA';

interface InstallPromptProps {
  isVisible: boolean;
  onInstall: () => Promise<boolean>;
  onDismiss: () => void;
  platform?: string;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({
  isVisible,
  onInstall,
  onDismiss,
  platform = 'unknown'
}) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const { capabilities, networkInfo } = usePWA();

  if (!isVisible) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await onInstall();
      if (success) {
        console.log('PWA installed successfully');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const getPlatformIcon = () => {
    if (platform.includes('mobile') || platform.includes('android')) {
      return <Smartphone className="w-8 h-8" />;
    }
    return <Monitor className="w-8 h-8" />;
  };

  const getPlatformText = () => {
    if (platform.includes('mobile') || platform.includes('android')) {
      return {
        title: 'Add to Home Screen',
        subtitle: 'Install AI Counselling System on your device',
        action: 'Add to Home Screen'
      };
    }
    return {
      title: 'Install App',
      subtitle: 'Install AI Counselling System as a desktop app',
      action: 'Install App'
    };
  };

  const platformText = getPlatformText();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity animate-fade-in"
        style={{ backgroundColor: 'var(--bg-overlay)' }}
        onClick={onDismiss}
      />
      
      {/* Install Prompt */}
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-xl transition-all transform animate-scale-in"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b" 
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderColor: 'var(--border-primary)' 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                {getPlatformIcon()}
                <span className="text-white" />
              </div>
              <div>
                <h3 className="text-heading-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {platformText.title}
                </h3>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                  {platformText.subtitle}
                </p>
              </div>
            </div>
            
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl transition-smooth hover:scale-101 active:scale-98"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
              aria-label="Close install prompt"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-body font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Why install the app?
            </h4>
            
            <div className="grid gap-3">
              {/* Offline Access */}
              <div className="flex items-center space-x-3 p-3 rounded-xl transition-smooth hover:scale-101" 
                   style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-success-50)' }}>
                  <Wifi className="w-4 h-4" style={{ color: 'var(--color-success-600)' }} />
                </div>
                <div>
                  <p className="text-body-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Works Offline
                  </p>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    Access student data even without internet
                  </p>
                </div>
              </div>

              {/* Fast Performance */}
              <div className="flex items-center space-x-3 p-3 rounded-xl transition-smooth hover:scale-101" 
                   style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-warning-50)' }}>
                  <Zap className="w-4 h-4" style={{ color: 'var(--color-warning-600)' }} />
                </div>
                <div>
                  <p className="text-body-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Lightning Fast
                  </p>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    Instant loading with native performance
                  </p>
                </div>
              </div>

              {/* Push Notifications */}
              {capabilities.notification && (
                <div className="flex items-center space-x-3 p-3 rounded-xl transition-smooth hover:scale-101" 
                     style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-info-50)' }}>
                    <Bell className="w-4 h-4" style={{ color: 'var(--color-info-600)' }} />
                  </div>
                  <div>
                    <p className="text-body-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Smart Notifications
                    </p>
                    <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                      Get alerted about critical student risks
                    </p>
                  </div>
                </div>
              )}

              {/* Secure */}
              <div className="flex items-center space-x-3 p-3 rounded-xl transition-smooth hover:scale-101" 
                   style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-50)' }}>
                  <Shield className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <div>
                  <p className="text-body-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Secure & Private
                  </p>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                    Student data protected with encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Status */}
          {!networkInfo.isOnline && (
            <div className="mb-6 p-4 rounded-xl border" style={{ 
              backgroundColor: 'var(--color-warning-50)',
              borderColor: 'var(--color-warning-200)'
            }}>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4" style={{ color: 'var(--color-warning-600)' }} />
                <p className="text-body-sm font-medium" style={{ color: 'var(--color-warning-700)' }}>
                  Currently Offline
                </p>
              </div>
              <p className="text-caption mt-1" style={{ color: 'var(--color-warning-600)' }}>
                The app will still work offline after installation
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                font-medium transition-smooth transform hover:scale-101 active:scale-99
                ${isInstalling ? 'opacity-70 cursor-not-allowed' : ''}
              `}
              style={{ 
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{platformText.action}</span>
                </>
              )}
            </button>
            
            <button
              onClick={onDismiss}
              className="px-4 py-3 rounded-xl font-medium transition-smooth transform hover:scale-101 active:scale-99"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center justify-center">
            <p className="text-caption text-center" style={{ color: 'var(--text-muted)' }}>
              The app takes less than 1MB of storage space
              {networkInfo.saveData && ' • Data Saver mode detected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;