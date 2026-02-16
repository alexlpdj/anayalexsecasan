import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import MusicPlayer from './components/MusicPlayer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Wrapper component para elementos persistentes
function AppWrapper({ children }) {
    const [showMusic, setShowMusic] = useState(false);

    useEffect(() => {
        // Mostrar música después de un pequeño delay
        const timer = setTimeout(() => setShowMusic(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Playlist de canciones
    const playlist = [
        '/audio/wedding-music.mp3',
        '/audio/wedding-music-2.mp3'
    ];

    return (
        <>
            {children}
            {/* Music Player persistente con playlist */}
            {showMusic && <MusicPlayer playlist={playlist} autoplay />}
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
