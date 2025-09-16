import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallPrompt {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  install: () => Promise<boolean>;
  dismiss: () => void;
  platform: string;
}

interface PWACapabilities {
  serviceWorker: boolean;
  notification: boolean;
  backgroundSync: boolean;
  pushMessaging: boolean;
  storage: boolean;
}

interface NetworkInfo {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface PWAState {
  isSupported: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  installPrompt: PWAInstallPrompt | null;
  capabilities: PWACapabilities;
  networkInfo: NetworkInfo;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    installPrompt: null,
    capabilities: {
      serviceWorker: false,
      notification: false,
      backgroundSync: false,
      pushMessaging: false,
      storage: false,
    },
    networkInfo: {
      isOnline: navigator.onLine,
    },
    serviceWorkerRegistration: null,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check PWA support and capabilities
  const checkPWASupport = useCallback(() => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = isStandalone || (window.navigator as any).standalone === true;

    const capabilities: PWACapabilities = {
      serviceWorker: 'serviceWorker' in navigator,
      notification: 'Notification' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      pushMessaging: 'serviceWorker' in navigator && 'PushManager' in window,
      storage: 'storage' in navigator && 'estimate' in navigator.storage,
    };

    // Get network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const networkInfo: NetworkInfo = {
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
    };

    setPWAState(prev => ({
      ...prev,
      isSupported,
      isInstalled,
      isStandalone,
      capabilities,
      networkInfo,
    }));
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        console.log('New service worker version found');
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed, but old version still active');
              // You can show a notification to user about update availability
            }
          });
        }
      });

      setPWAState(prev => ({
        ...prev,
        serviceWorkerRegistration: registration,
      }));

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA install prompt result:', outcome);
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setPWAState(prev => ({
          ...prev,
          isInstalled: true,
          installPrompt: null,
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Dismiss install prompt
  const dismissInstallPrompt = useCallback(() => {
    setDeferredPrompt(null);
    setPWAState(prev => ({
      ...prev,
      installPrompt: null,
    }));
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (vapidKey: string) => {
    if (!pwaState.serviceWorkerRegistration) {
      console.warn('Service worker not registered');
      return null;
    }

    try {
      const subscription = await pwaState.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }, [pwaState.serviceWorkerRegistration]);

  // Get storage usage
  const getStorageInfo = useCallback(async () => {
    if (!pwaState.capabilities.storage) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        percentage: estimate.quota ? (estimate.usage! / estimate.quota) * 100 : 0,
      };
    } catch (error) {
      console.error('Storage estimation failed:', error);
      return null;
    }
  }, [pwaState.capabilities.storage]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setPWAState(prev => ({
        ...prev,
        isOnline: true,
        networkInfo: { ...prev.networkInfo, isOnline: true },
      }));
    };

    const handleOffline = () => {
      setPWAState(prev => ({
        ...prev,
        isOnline: false,
        networkInfo: { ...prev.networkInfo, isOnline: false },
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      
      const platform = (e as any).platforms?.[0] || 'unknown';
      
      setPWAState(prev => ({
        ...prev,
        installPrompt: {
          isInstallable: true,
          isInstalled: prev.isInstalled,
          isStandalone: prev.isStandalone,
          install: installPWA,
          dismiss: dismissInstallPrompt,
          platform,
        },
      }));
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        installPrompt: null,
      }));
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [installPWA, dismissInstallPrompt]);

  // Initialize PWA
  useEffect(() => {
    checkPWASupport();
    registerServiceWorker();
  }, [checkPWASupport, registerServiceWorker]);

  return {
    ...pwaState,
    installPWA,
    dismissInstallPrompt,
    requestNotificationPermission,
    subscribeToPush,
    getStorageInfo,
    checkPWASupport,
    registerServiceWorker,
  };
};

export default usePWA;