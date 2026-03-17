import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useTranslation } from 'react-i18next';

export default function MusicPlayer({ playlist = [], autoplay = false }) {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [showControls, setShowControls] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const soundRef = useRef(null);
    const volumeRef = useRef(volume);
    const isPlayingRef = useRef(false);
    const pausedByExternalRef = useRef(false);

    // Mantener el ref sincronizado con el state
    useEffect(() => {
        volumeRef.current = volume;
        if (soundRef.current) {
            soundRef.current.volume(volume);
        }
    }, [volume]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Pausa/reanuda cuando SongSearch reproduce un preview
    useEffect(() => {
        const handleExternalPause = () => {
            if (isPlayingRef.current && soundRef.current) {
                soundRef.current.fade(volumeRef.current, 0, 300);
                setTimeout(() => soundRef.current?.pause(), 300);
                pausedByExternalRef.current = true;
            }
        };
        const handleExternalResume = () => {
            if (pausedByExternalRef.current && soundRef.current) {
                soundRef.current.play();
                soundRef.current.fade(0, volumeRef.current, 500);
                pausedByExternalRef.current = false;
            }
        };

        document.addEventListener('pauseBackgroundMusic', handleExternalPause);
        document.addEventListener('resumeBackgroundMusic', handleExternalResume);
        return () => {
            document.removeEventListener('pauseBackgroundMusic', handleExternalPause);
            document.removeEventListener('resumeBackgroundMusic', handleExternalResume);
        };
    }, []);

    // Función para cargar y reproducir una canción
    const loadAndPlayTrack = (index, shouldPlay = false) => {
        if (soundRef.current) {
            soundRef.current.unload();
        }

        if (!playlist || playlist.length === 0 || !playlist[index]) {
            setAudioError(true);
            return;
        }

        soundRef.current = new Howl({
            src: [playlist[index]],
            html5: true,
            loop: false,
            volume: volumeRef.current,
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onend: () => {
                const nextIndex = (index + 1) % playlist.length;
                setCurrentTrackIndex(nextIndex);
            },
            onloaderror: () => {
                console.warn(`No se pudo cargar el archivo de audio: ${playlist[index]}`);
                const nextIndex = (index + 1) % playlist.length;
                if (nextIndex !== index) {
                    setCurrentTrackIndex(nextIndex);
                } else {
                    setAudioError(true);
                }
            },
        });

        if (shouldPlay) {
            setTimeout(() => {
                if (soundRef.current) {
                    soundRef.current.play();
                    soundRef.current.fade(0, volumeRef.current, 1000);
                    setHasStarted(true);
                }
            }, 300);
        }
    };

    // Cargar la pista
    useEffect(() => {
        const shouldAutoResume = hasStarted && isPlaying;
        loadAndPlayTrack(currentTrackIndex, shouldAutoResume);

        return () => {
            if (soundRef.current) {
                soundRef.current.unload();
            }
        };
    }, [currentTrackIndex]);

    // Escuchar evento custom 'startMusic' (disparado desde WelcomeOverlay)
    useEffect(() => {
        if (!autoplay || hasStarted) return;

        const startPlayback = () => {
            if (soundRef.current && !hasStarted) {
                soundRef.current.play();
                soundRef.current.fade(0, volumeRef.current, 1000);
                setHasStarted(true);
            }
        };

        document.addEventListener('startMusic', startPlayback, { once: true });

        return () => {
            document.removeEventListener('startMusic', startPlayback);
        };
    }, [autoplay, hasStarted]);

    const togglePlay = () => {
        if (!soundRef.current) return;

        if (isPlaying) {
            soundRef.current.fade(volume, 0, 500);
            setTimeout(() => soundRef.current.pause(), 500);
        } else {
            soundRef.current.play();
            soundRef.current.fade(0, volume, 1000);
            setHasStarted(true);
        }
    };

    // No mostrar el player si hay error de audio
    if (audioError) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Botón principal */}
            <motion.button
                onClick={() => setShowControls(!showControls)}
                onHoverStart={() => setShowControls(true)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8b7355] text-white shadow-lg transition-all hover:bg-[#7a6448] hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.svg
                            key="playing"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Icono de ondas de sonido animadas */}
                            <motion.path
                                d="M12 3v18M8 6v12M16 6v12M4 9v6M20 9v6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                animate={{
                                    scaleY: [1, 1.2, 0.8, 1.2, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="paused"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                            />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Panel de controles expandido */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-64 rounded-2xl border border-[#e2dbd3]/60 bg-white/95 p-4 shadow-xl backdrop-blur-sm"
                        onMouseLeave={() => setShowControls(false)}
                    >
                        {/* Play/Pause */}
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-[#8b7355]">
                                {t('player.title')}
                            </span>
                            <button
                                onClick={togglePlay}
                                className="rounded-full p-2 transition-colors hover:bg-[#f5f1ed]"
                            >
                                {isPlaying ? (
                                    <svg
                                        className="h-5 w-5 text-[#8b7355]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-[#8b7355]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Control de volumen */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#a89584]">{t('player.volume')}</span>
                                <span className="text-xs text-[#8b7355]">
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full accent-[#8b7355]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
