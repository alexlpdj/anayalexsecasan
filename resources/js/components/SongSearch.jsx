import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_SONGS = 5;

function MusicIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
    );
}

function Spinner({ className }) {
    return (
        <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

function ArtworkButton({ src, alt, isPlaying, hasPreview, onClick, size = 'md' }) {
    const dim = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
    return (
        <button
            type="button"
            onClick={hasPreview ? onClick : undefined}
            className={`relative flex-shrink-0 overflow-hidden rounded-md ${dim} ${hasPreview ? 'cursor-pointer' : 'cursor-default'}`}
        >
            {src ? (
                <img src={src} alt={alt} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f0ebe5]">
                    <MusicIcon className={size === 'sm' ? 'h-4 w-4 text-[#c4b5a4]' : 'h-5 w-5 text-[#c4b5a4]'} />
                </div>
            )}
            {hasPreview && (
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlaying ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0 hover:bg-black/30 hover:opacity-100'}`}>
                    {isPlaying ? (
                        <svg className="h-4 w-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </div>
            )}
        </button>
    );
}

export default function SongSearch({ suggestions }) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(new Set());
    const [removing, setRemoving] = useState(new Set());
    const [playingId, setPlayingId] = useState(null);
    const debounceRef = useRef(null);
    const audioRef = useRef(null);

    // Stop audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!query.trim() || query.trim().length < 2) {
            setResults([]);
            setError(null);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    route('guest.songs.search') + '?' + new URLSearchParams({ q: query.trim() })
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                setError(t('songs.search_error'));
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const togglePreview = (trackId, previewUrl) => {
        if (!previewUrl) return;

        if (playingId === trackId) {
            // Pause current
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }

        // Stop previous
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(previewUrl);
        audio.volume = 0.7;
        audio.addEventListener('ended', () => setPlayingId(null));
        audio.play().catch(() => {});
        audioRef.current = audio;
        setPlayingId(trackId);
    };

    const isSuggested = (itunesId) =>
        suggestions.some((s) => s.itunes_track_id === itunesId);

    const suggest = (track) => {
        if (suggestions.length >= MAX_SONGS || isSuggested(track.id)) return;
        setSubmitting((prev) => new Set(prev).add(track.id));
        router.post(
            route('guest.songs.suggest'),
            {
                track_title: track.title,
                artist_name: track.artist,
                album_name: track.album,
                artwork_url: track.artwork,
                itunes_track_id: track.id,
                preview_url: track.preview_url,
            },
            {
                preserveScroll: true,
                onFinish: () =>
                    setSubmitting((prev) => {
                        const next = new Set(prev);
                        next.delete(track.id);
                        return next;
                    }),
            }
        );
    };

    const remove = (suggestionId) => {
        setRemoving((prev) => new Set(prev).add(suggestionId));
        router.delete(route('guest.songs.remove', suggestionId), {
            preserveScroll: true,
            onFinish: () =>
                setRemoving((prev) => {
                    const next = new Set(prev);
                    next.delete(suggestionId);
                    return next;
                }),
        });
    };

    const isAtMax = suggestions.length >= MAX_SONGS;

    return (
        <div className="space-y-4">
            {/* Search input */}
            <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Spinner className="h-4 w-4 text-[#a89584]" />
                    ) : (
                        <MusicIcon className="h-4 w-4 text-[#a89584]" />
                    )}
                </div>
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-[#e2dbd3] bg-[#faf8f5] pl-9 transition-colors focus:border-[#8b7355] focus:ring-[#8b7355]/20"
                    placeholder={isAtMax ? t('songs.max_reached') : t('songs.search_placeholder')}
                    disabled={isAtMax}
                />
            </div>

            {/* Error */}
            {error && <p className="text-center text-xs text-red-400">{error}</p>}

            {/* Search results */}
            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="overflow-hidden rounded-xl border border-[#e2dbd3] bg-white/90 shadow-sm"
                    >
                        <div className="divide-y divide-[#f0ebe5]">
                            {results.map((track) => {
                                const already = isSuggested(track.id);
                                const isSubmitting = submitting.has(track.id);
                                const isPlaying = playingId === track.id;
                                return (
                                    <div key={track.id} className="flex items-center gap-3 px-3 py-2.5">
                                        <ArtworkButton
                                            src={track.artwork}
                                            alt={track.album}
                                            isPlaying={isPlaying}
                                            hasPreview={!!track.preview_url}
                                            onClick={() => togglePreview(track.id, track.preview_url)}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-[#3d3530]">{track.title}</p>
                                            <p className="truncate text-xs text-[#a89584]">{track.artist}</p>
                                        </div>
                                        <button
                                            onClick={() => suggest(track)}
                                            disabled={already || isSubmitting || isAtMax}
                                            className={`flex-shrink-0 rounded-full p-1.5 transition-all ${
                                                already
                                                    ? 'cursor-default bg-green-50 text-green-500'
                                                    : 'bg-[#8b7355]/10 text-[#8b7355] hover:bg-[#8b7355]/20 disabled:opacity-40'
                                            }`}
                                        >
                                            {already ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            ) : isSubmitting ? (
                                                <Spinner className="h-4 w-4" />
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Suggestions list */}
            {suggestions.length > 0 && (
                <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#b5a594]">
                        {t('songs.your_suggestions')} ({suggestions.length}/{MAX_SONGS})
                    </p>
                    <div className="space-y-2">
                        <AnimatePresence initial={false}>
                            {suggestions.map((s) => (
                                <motion.div
                                    key={s.id}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-3 rounded-xl border border-[#e2dbd3] bg-[#faf8f5] px-3 py-2.5"
                                >
                                    {s.artwork_url ? (
                                        <img
                                            src={s.artwork_url}
                                            alt={s.album_name}
                                            className="h-9 w-9 flex-shrink-0 rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[#e8e0d8]">
                                            <MusicIcon className="h-4 w-4 text-[#c4b5a4]" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-[#3d3530]">{s.track_title}</p>
                                        <p className="truncate text-xs text-[#a89584]">{s.artist_name}</p>
                                    </div>
                                    <button
                                        onClick={() => remove(s.id)}
                                        disabled={removing.has(s.id)}
                                        className="flex-shrink-0 rounded-full p-1.5 text-[#c4b5a4] transition-colors hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
                                    >
                                        {removing.has(s.id) ? (
                                            <Spinner className="h-4 w-4" />
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Empty hint */}
            {suggestions.length === 0 && !query && (
                <p className="text-center text-sm text-[#c4b5a4]">{t('songs.empty_hint')}</p>
            )}
        </div>
    );
}
