// ShopXand service worker v2
// Сеть в приоритете: сайт всегда берёт свежую версию, кэш — только запасной вариант без интернета.
var CACHE_NAME = 'shopxand-react-v2';

self.addEventListener('install', function() {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) { return key !== CACHE_NAME; })
                    .map(function(key) { return caches.delete(key); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(event) {
    var req = event.request;
    var url = new URL(req.url);

    // Не трогаем: POST/PUT/DELETE, чужие сайты, запросы к API
    if (req.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;
    if (url.pathname.indexOf('/api/') === 0) return;

    event.respondWith(
        fetch(req).then(function(res) {
            if (res && res.ok && res.type === 'basic') {
                var copy = res.clone();
                caches.open(CACHE_NAME).then(function(cache) { cache.put(req, copy); });
            }
            return res;
        }).catch(function() {
            return caches.match(req).then(function(cached) {
                return cached || caches.match('/index.html');
            });
        })
    );
});

// Push
self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title || 'ShopXand', {
        body: data.body || '',
        icon: '/img/icons/icon-192x192.png'
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});