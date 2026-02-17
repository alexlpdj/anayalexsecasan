import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import MusicPlayer from './components/MusicPlayer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Wrapper component para elementos persistentes (MusicPlayer en rutas de invitados)
function AppWrapper({ children }) {
    const [currentPath, setCurrentPath] = useState(
        typeof window !== 'undefined' ? window.location.pathname : '/'
    );

    useEffect(() => {
        const removeListener = router.on('navigate', () => {
            setCurrentPath(window.location.pathname);
        });
        return removeListener;
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
    setup({ el, App, props }) {
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
});
