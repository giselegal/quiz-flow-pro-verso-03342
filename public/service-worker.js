// Service Worker para cache inteligente e performance
const CACHE_NAME = 'quiz-builder-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Arquivos para cache imediato
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estratégias de cache
const cacheStrategies = {
  // Cache first para assets estáticos
  cacheFirst: async (request) => {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    return cached || fetch(request);
  },

  // Network first para APIs
  networkFirst: async (request) => {
    const cache = await caches.open(DYNAMIC_CACHE);
    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      return cache.match(request) || new Response('Offline', { status: 503 });
    }
  },

  // Stale while revalidate para conteúdo dinâmico
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
      cache.put(request, response.clone());
      return response;
    });

    return cached || fetchPromise;
  }
};

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Escolher estratégia baseada no tipo de request
  if (request.method !== 'GET') return;

  // APIs do Supabase
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(cacheStrategies.networkFirst(request));
    return;
  }

  // Assets estáticos
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(cacheStrategies.cacheFirst(request));
    return;
  }

  // Páginas HTML
  if (request.destination === 'document') {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
    return;
  }

  // Default: network first
  event.respondWith(cacheStrategies.networkFirst(request));
});

// Background sync para operações offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Implementar sincronização de dados quando voltar online
  console.log('Background sync triggered');
}

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png'
  };

  event.waitUntil(
    self.registration.showNotification('Quiz Builder', options)
  );
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'get-latest-data') {
    event.waitUntil(updateData());
  }
});

async function updateData() {
  // Atualizar dados em background
  return fetch('/api/update-cache')
    .then(response => response.json())
    .catch(error => console.log('Background update failed:', error));
}