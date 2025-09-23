/**
 * 🚀 SERVICE WORKER - CACHING ESTRATÉGICO PARA PRODUÇÃO
 * 
 * Service Worker otimizado para o editor consolidado:
 * - Cache inteligente de recursos estáticos
 * - Network-first para API calls
 * - Fallback para offline
 * - Update automático
 */

const CACHE_NAME = 'editor-consolidated-v1';
const STATIC_CACHE = 'editor-static-v1';
const DYNAMIC_CACHE = 'editor-dynamic-v1';

// 🎯 RECURSOS PARA CACHE ESTÁTICO
const STATIC_ASSETS = [
  '/',
  '/editor',
  '/manifest.json',
  // CSS files will be cached automatically
  // JS files will be cached automatically
];

// 🎯 ESTRATÉGIAS DE CACHE
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
  fallback: 'network-only'
};

// 🎯 INSTALL EVENT
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: Installation complete');
        return self.skipWaiting();
      })
  );
});

// 🎯 ACTIVATE EVENT
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// 🎯 FETCH EVENT
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Only handle GET requests
  if (method !== 'GET') {
    return;
  }

  // Determine cache strategy
  let strategy = CACHE_STRATEGIES.fallback;
  
  if (url.includes('/api/')) {
    strategy = CACHE_STRATEGIES.api;
  } else if (url.match(/\.(js|css|html)$/)) {
    strategy = CACHE_STRATEGIES.static;
  } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    strategy = CACHE_STRATEGIES.images;
  }

  // Apply strategy
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(request));
      break;
    case 'network-first':
      event.respondWith(networkFirst(request));
      break;
    default:
      // Let the browser handle it
      return;
  }
});

// 🎯 CACHE FIRST STRATEGY
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Cache first failed:', error);
    
    // Return offline fallback if available
    if (request.destination === 'document') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// 🎯 NETWORK FIRST STRATEGY
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network first failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 🎯 MESSAGE HANDLING
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('SW: Service Worker loaded');