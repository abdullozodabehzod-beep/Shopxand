var CACHE_NAME = 'shopxand-v2';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/manifest.json',
    '/img/icons/icon-192x192.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
   caches.open(CACHE_NAME).then(function(cache) {
  return cache.addAll(urlsToCache);
   })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
   caches.match(event.request).then(function(response) {
  return response || fetch(event.request);
   })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
   caches.keys().then(function(keys) {
  return Promise.all(
 keys.filter(function(key) { return key !== CACHE_NAME; })
.map(function(key) { return caches.delete(key); })
  );
   })
    );
});

// Push
self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title || 'ShopXand', {
   body: data.body || '',
   icon: '/img/icons/logo.svg'
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
    
    // Кэшируем все запросы
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(fetchResponse) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    });