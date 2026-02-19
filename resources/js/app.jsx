import '../css/app.css';
import './bootstrap';
import './i18n';

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

// Capture install prompt (Chrome/Android)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.__pwaInstallPrompt = e;
});

import {createInertiaApp, router} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot} from 'react-dom/client';
import {useEffect, useState} from 'react';
import MusicPlayer from './components/MusicPlayer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Wrapper component para elementos persistentes (MusicPlayer en rutas de invitados)
function AppWrapper({ children }) {
    const [currentPath, setCurrentPath] = useState(
        typeof window !== 'undefined' ? window.location.pathname : '/'
    );

    useEffect(() => {
        return router.on('navigate', () => {
            setCurrentPath(window.location.pathname);
        });
    }, []);

    const isGuestRoute = currentPath.startsWith('/invitacion');

    const playlist = [
        '/audio/wedding-music.mp3',
        '/audio/wedding-music-2.mp3'
    ];

    return (
        <>
            {children}
            {isGuestRoute && <MusicPlayer playlist={playlist} autoplay />}
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({el, App, props}) {
        const root = createRoot(el);

        root.render(
            <AppWrapper>
                <App {...props} />
            </AppWrapper>
        );
    },
    progress: {
        color: '#4B5563',
    },
}).then(r =>{});
