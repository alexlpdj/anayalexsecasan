import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import MusicPlayer from './components/MusicPlayer';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Overlay de bienvenida - al pulsar, arranca la música
function WelcomeOverlay({ onEnter }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/animations/anillos.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(err => console.log('No se pudo cargar la animación Lottie:', err));
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#f5f1ed] via-[#faf8f5] to-[#f0ebe5]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <div className="text-center px-6">
                <motion.h1
                    className="font-serif text-8xl italic leading-none text-[#8b7355]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A <span className="mx-2 text-7xl font-light">&</span> A
                </motion.h1>

                <motion.div
                    className="mx-auto mt-6 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                    <span className="text-xs text-[#d4c5b9]">&#10047;</span>
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                </motion.div>

                <motion.p
                    className="mt-4 text-sm uppercase tracking-[0.25em] text-[#a89584]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                >
                    20 de junio de 2026
                </motion.p>

                {/* Animación Lottie de anillos */}
                <motion.div
                    className="mx-auto mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                >
                    {animationData ? (
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            style={{ width: 120, height: 120, margin: '0 auto' }}
                        />
                    ) : (
                        <div className="flex gap-1.5 justify-center" style={{ height: 120 }}>
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-2 w-2 rounded-full bg-[#8b7355] self-center"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.button
                    onClick={onEnter}
                    className="mt-6 rounded-full border-2 border-[#8b7355] bg-transparent px-10 py-3 font-serif text-lg italic text-[#8b7355] transition-all hover:bg-[#8b7355] hover:text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Descubrir nuestra boda
                </motion.button>

                <motion.p
                    className="mt-4 text-xs text-[#c4b5a4]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                >
                    toca para entrar con música
                </motion.p>
            </div>
        </motion.div>
    );
}

// Wrapper component para elementos persistentes
function AppWrapper({ children }) {
    const [showWelcome, setShowWelcome] = useState(true);

    const handleEnter = () => {
        // Disparar evento custom que el MusicPlayer escucha
        document.dispatchEvent(new Event('startMusic'));
        setShowWelcome(false);
    };

    // Playlist de canciones
    const playlist = [
        '/audio/wedding-music.mp3',
        '/audio/wedding-music-2.mp3'
    ];

    return (
        <>
            <AnimatePresence>
                {showWelcome && <WelcomeOverlay onEnter={handleEnter} />}
            </AnimatePresence>
            {children}
            <MusicPlayer playlist={playlist} autoplay />
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
