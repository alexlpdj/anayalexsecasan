self.addEventListener('push', event => {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title ?? 'Boda Ana & Alex', {
            body: data.body ?? '',
            icon: '/icons/icon-512.png',
            badge: '/icons/icon-512.png',
            data: { url: '/invitacion/dashboard' },
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('/invitacion') && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/invitacion/dashboard');
        })
    );
});
