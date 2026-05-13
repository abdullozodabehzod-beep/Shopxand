// ShopXand Service Worker
var CACHE_NAME = 'shopxand-v1';

var ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('SW: Кеширую...');
            return cache.addAll(ASSETS).catch(function(err) {
                console.log('SW: Ошибка кеширования', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) return cached;
            
            return fetch(event.request).then(function(response) {
                if (response && response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function() {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Push событие
self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json() : {};
    var title = data.title || 'ShopXand';
    var options = {
        body: data.body || 'Новое уведомление',
        icon: '/img/icons/icon-192x192.png',
        badge: '/img/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/' }
    };
    
    event.waitUntil(self.registration.showNotification(title, options));
});

// Клик по уведомлению
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});