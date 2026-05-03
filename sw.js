// sw.js - Service Worker для PWA
const CACHE_NAME = 'shopxand-v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/Shopxand/',
                '/Shopxand/index.html',
                '/Shopxand/style.css',
                '/Shopxand/script.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});