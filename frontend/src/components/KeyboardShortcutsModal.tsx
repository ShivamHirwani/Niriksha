import React from 'react';
import { X, Keyboard, Zap, Navigation, Settings, LogOut } from 'lucide-react';
import useKeyboardShortcuts, { KeyboardShortcut } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
}) => {
  const { formatShortcut, groupedShortcuts } = useKeyboardShortcuts(shortcuts);

  if (!isOpen) return null;

  const categoryIcons: { [key: string]: React.ElementType } = {
    'Navigation': Navigation,
    'Theme': Zap,
    'Settings': Settings,
    'System': LogOut,
    'General': Keyboard,
  };

  const categoryDescriptions: { [key: string]: string } = {
    'Navigation': 'Navigate between different sections',
    'Theme': 'Theme and appearance controls',
    'Settings': 'Application settings and preferences',
    'System': 'System-level actions',
    'General': 'General application shortcuts',
  };

  const grouped = groupedShortcuts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        style={{ backgroundColor: 'var(--bg-overlay)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl transition-all transform animate-scale-in"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
                <Keyboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-heading-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Keyboard Shortcuts
                </h2>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                  Use these shortcuts to navigate faster
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-smooth hover:scale-110 active:scale-95"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
              aria-label="Close shortcuts modal"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid gap-8">
            {Object.entries(grouped).map(([category, categoryShortcuts]) => {
              const CategoryIcon = categoryIcons[category] || Keyboard;
              
              return (
                <div key={category} className="animate-fade-in">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary-50)' }}>
                      <CategoryIcon className="w-4 h-4" style={{ color: 'var(--color-primary-600)' }} />
                    </div>
                    <div>
                      <h3 className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {category}
                      </h3>
                      <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                        {categoryDescriptions[category] || 'Keyboard shortcuts'}
                      </p>
                    </div>
                  </div>

                  {/* Shortcuts Grid */}
                  <div className="grid gap-3">
                    {categoryShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.id}
                        className={`
                          group p-4 rounded-xl transition-smooth hover:scale-102
                          ${shortcut.disabled ? 'opacity-50' : 'hover:shadow-glass'}
                        `}
                        style={{ 
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          {/* Shortcut Description */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-body font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                              {shortcut.description}
                            </h4>
                            {shortcut.disabled && (
                              <p className="text-body-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                Currently disabled
                              </p>
                            )}
                          </div>

                          {/* Keyboard Keys */}
                          <div className="flex items-center space-x-2 ml-4">
                            {formatShortcut(shortcut).split(' + ').map((key, index) => (
                              <React.Fragment key={index}>
                                {index > 0 && (
                                  <span className="text-body-sm" style={{ color: 'var(--text-muted)' }}>
                                    +
                                  </span>
                                )}
                                <kbd 
                                  className="px-3 py-1 text-body-sm font-medium rounded-lg border shadow-sm transition-smooth group-hover:scale-105"
                                  style={{ 
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderColor: 'var(--border-secondary)',
                                    color: 'var(--text-primary)'
                                  }}
                                >
                                  {key}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pro Tips */}
          <div className="mt-8 p-6 rounded-2xl border" style={{ 
            backgroundColor: 'var(--color-primary-50)',
            borderColor: 'var(--color-primary-200)'
          }}>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-body font-semibold mb-2" style={{ color: 'var(--color-primary-700)' }}>
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-body-sm" style={{ color: 'var(--color-primary-600)' }}>
                  <li>• Press <kbd className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">?</kbd> anytime to open this shortcuts panel</li>
                  <li>• Shortcuts work globally throughout the application</li>
                  <li>• Some shortcuts may be disabled when typing in input fields</li>
                  <li>• Use <kbd className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">Esc</kbd> to close any modal or dialog</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t" style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border-primary)' 
        }}>
          <div className="flex items-center justify-between">
            <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
              Total shortcuts: <span className="font-medium">{shortcuts.length}</span>
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl transition-smooth hover:scale-105 active:scale-95 font-medium"
                style={{ 
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-600)'
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;