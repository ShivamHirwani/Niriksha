const CACHE_NAME = 'ai-counselling-system-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  // Add other critical assets
];

// Routes that should be cached dynamically
const DYNAMIC_ROUTES = [
  '/dashboard',
  '/students',
  '/settings',
  '/risk-overview'
];

// Maximum cache sizes
const MAX_DYNAMIC_ITEMS = 50;
const MAX_IMAGE_ITEMS = 100;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Initialize other caches
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !cacheName.startsWith(CACHE_NAME))
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests for external APIs
  if (!url.origin.includes(self.location.origin) && !url.origin.includes('localhost')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

// Main fetch handler with different strategies
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Static assets - Cache First
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Images - Cache First with fallback
    if (isImage(url)) {
      return await cacheFirst(request, IMAGE_CACHE, true);
    }
    
    // Strategy 3: API calls - Network First
    if (isApiCall(url)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: Navigation requests - Stale While Revalidate
    if (isNavigationRequest(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Default: Network First
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    
    // Return offline fallback for navigation requests
    if (isNavigationRequest(request)) {
      return await getOfflineFallback();
    }
    
    throw error;
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName, limitCache = false) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const responseClone = networkResponse.clone();
    await cache.put(request, responseClone);
    
    // Limit cache size if specified
    if (limitCache) {
      await limitCacheSize(cacheName, cacheName === IMAGE_CACHE ? MAX_IMAGE_ITEMS : MAX_DYNAMIC_ITEMS);
    }
  }
  
  return networkResponse;
}

// Network First strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await limitCacheSize(cacheName, MAX_DYNAMIC_ITEMS);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await limitCacheSize(cacheName, MAX_DYNAMIC_ITEMS);
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors in background update
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|html|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

function isImage(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/);
}

function isApiCall(url) {
  return url.pathname.startsWith('/api/') || url.pathname.startsWith('/gs_api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Limit cache size
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Get offline fallback page
async function getOfflineFallback() {
  const cache = await caches.open(STATIC_CACHE);
  return await cache.match('/') || new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AI Counselling System - Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            text-align: center; 
            padding: 2rem;
            background: #f8fafc;
            color: #1e293b;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 { color: #3b82f6; margin-bottom: 1rem; }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          .retry-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📡</div>
          <h1>You're Offline</h1>
          <p>The AI Counselling System is currently unavailable. Please check your internet connection and try again.</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    }
  );
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'student-data-sync') {
    event.waitUntil(syncStudentData());
  }
});

// Handle background sync
async function syncStudentData() {
  try {
    // This would typically sync with your backend API
    console.log('[SW] Syncing student data...');
    
    // Get pending changes from IndexedDB or localStorage
    const pendingChanges = await getPendingChanges();
    
    if (pendingChanges.length > 0) {
      // Send changes to server
      await Promise.all(
        pendingChanges.map(change => 
          fetch('/api/students/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change)
          })
        )
      );
      
      // Clear pending changes
      await clearPendingChanges();
      console.log('[SW] Data sync completed');
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for data persistence
async function getPendingChanges() {
  // In a real implementation, you'd read from IndexedDB
  return [];
}

async function clearPendingChanges() {
  // In a real implementation, you'd clear IndexedDB
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    title: 'AI Counselling System',
    body: 'New student alert available',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'student-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Alert',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.title = data.title || options.title;
    options.body = data.body || options.body;
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/dashboard')
    );
  }
});

console.log('[SW] Service worker script loaded');