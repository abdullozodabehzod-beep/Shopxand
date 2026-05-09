// ShopXand Service Worker
const CACHE_NAME = 'shopxand-v1';

const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Установка — кешируем ресурсы
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Кеширую ресурсы...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Активация — удаляем старый кеш
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Стратегия: Сначала кеш, потом сеть
self.addEventListener('fetch', function(event) {
    // Пропускаем запросы к API или внешние
    if (event.request.url.includes('chrome-extension') || 
        event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) {
                return cached;
            }
            
            return fetch(event.request).then(function(response) {
                // Кешируем новые запросы
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            }).catch(function() {
                // Оффлайн — показываем заглушку
                if (event.request.url.includes('.html') || event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});