const CACHE_NAME = 'boda-ana-alex-v1';
const PRECACHE_URLS = [
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Install: precache essential assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: serve cached icons, let everything else pass through
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/icons/')) {
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request))
        );
    }
});

// Push notifications
self.addEventListener('push', event => {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title ?? 'Boda Ana & Alex', {
            body: data.body ?? '',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url: data.url || '/invitacion/dashboard' },
        })
    );
});

// Click on notification
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/invitacion/dashboard';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('/invitacion') && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});
