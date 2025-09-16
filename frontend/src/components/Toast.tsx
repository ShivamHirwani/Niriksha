import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Toast as ToastType } from '../context/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor()}
        max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3
      `}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {toast.message}
          </p>
        </div>
        
        <button
          onClick={handleRemove}
          className="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </div>
  );
};

export default Toast;