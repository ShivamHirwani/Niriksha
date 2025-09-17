import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  id: string;
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  category: string;
  action: () => void;
  disabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enableGlobalShortcuts?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const {
    enableGlobalShortcuts = true,
    preventDefault = true,
    stopPropagation = true,
  } = options;

  const shortcutsRef = useRef<KeyboardShortcut[]>([]);
  const pressedKeysRef = useRef<Set<string>>(new Set());

  // Update shortcuts reference
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  // Helper function to normalize key names
  const normalizeKey = useCallback((key: string): string => {
    const keyMap: { [key: string]: string } = {
      ' ': 'Space',
      'ArrowUp': 'Up',
      'ArrowDown': 'Down',
      'ArrowLeft': 'Left',
      'ArrowRight': 'Right',
      'Delete': 'Del',
      'Escape': 'Esc',
    };
    return keyMap[key] || key;
  }, []);

  // Check if event matches shortcut
  const matchesShortcut = useCallback((event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const normalizedEventKey = normalizeKey(event.key);
    const normalizedShortcutKey = normalizeKey(shortcut.key);

    return (
      normalizedEventKey.toLowerCase() === normalizedShortcutKey.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrlKey &&
      !!event.altKey === !!shortcut.altKey &&
      !!event.shiftKey === !!shortcut.shiftKey &&
      !!event.metaKey === !!shortcut.metaKey
    );
  }, [normalizeKey]);

  // Format shortcut for display
  const formatShortcut = useCallback((shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.metaKey) parts.push('Cmd');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    
    const key = normalizeKey(shortcut.key);
    parts.push(key === ' ' ? 'Space' : key);
    
    return parts.join(' + ');
  }, [normalizeKey]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if typing in input fields
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true' ||
                        target.getAttribute('role') === 'textbox';

    if (isInputField && !enableGlobalShortcuts) {
      return;
    }

    // Add pressed key to set
    pressedKeysRef.current.add(event.key);

    // Find matching shortcut
    const matchingShortcut = shortcutsRef.current.find(shortcut => 
      !shortcut.disabled && matchesShortcut(event, shortcut)
    );

    if (matchingShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      if (stopPropagation) {
        event.stopPropagation();
      }

      try {
        matchingShortcut.action();
      } catch (error) {
        console.error(`Error executing keyboard shortcut "${matchingShortcut.id}":`, error);
      }
    }
  }, [enableGlobalShortcuts, preventDefault, stopPropagation, matchesShortcut]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Remove released key from set
    pressedKeysRef.current.delete(event.key);
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!enableGlobalShortcuts) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, enableGlobalShortcuts]);

  // Group shortcuts by category
  const groupedShortcuts = useCallback(() => {
    const groups: { [category: string]: KeyboardShortcut[] } = {};
    
    shortcutsRef.current.forEach(shortcut => {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    });
    
    return groups;
  }, []);

  // Get all shortcuts
  const getAllShortcuts = useCallback(() => {
    return shortcutsRef.current;
  }, []);

  // Check if shortcut is pressed
  const isShortcutPressed = useCallback((shortcut: KeyboardShortcut): boolean => {
    const requiredKeys = [];
    if (shortcut.ctrlKey) requiredKeys.push('Control');
    if (shortcut.altKey) requiredKeys.push('Alt');
    if (shortcut.shiftKey) requiredKeys.push('Shift');
    if (shortcut.metaKey) requiredKeys.push('Meta');
    requiredKeys.push(shortcut.key);
    
    return requiredKeys.every(key => pressedKeysRef.current.has(key));
  }, []);

  return {
    formatShortcut,
    groupedShortcuts,
    getAllShortcuts,
    isShortcutPressed,
    handleKeyDown,
    handleKeyUp,
  };
};

export default useKeyboardShortcuts;