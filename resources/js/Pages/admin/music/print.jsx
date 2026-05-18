import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Music, ExternalLink, Clock, ListMusic } from 'lucide-react';

function playlistHost(url) {
    try {
        const host = new URL(url).hostname.replace('www.', '');
        if (host.includes('spotify')) return 'Spotify';
        if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube Music';
        if (host.includes('apple')) return 'Apple Music';
        return host;
    } catch {
        return url;
    }
}

export default function MusicPrint({ sections, moments, playlists = [], bride, groom, weddingDate }) {
    const [selectedPlaylists, setSelectedPlaylists] = useState(() => playlists.map((p) => p.id));

    const togglePlaylist = (id) => {
        setSelectedPlaylists((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    };

    const playlistsToPrint = playlists.filter((p) => selectedPlaylists.includes(p.id));

    return (
        <>
            <Head title="Música de la boda — Imprimir" />

            <div className="min-h-screen bg-white p-8 font-sans text-gray-900 print:p-4">
                {/* Header */}
                <div className="mb-8 border-b border-gray-200 pb-6 text-center print:mb-6">
                    <div className="mb-2 flex items-center justify-center gap-2 text-[#8b7355]">
                        <Music className="h-6 w-6" />
                        <span className="text-lg font-semibold uppercase tracking-wide">Música de la boda</span>
                    </div>
                    {bride && groom && (
                        <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">{bride} &amp; {groom}</h1>
                    )}
                    {weddingDate && <p className="mt-1 text-gray-500">{weddingDate}</p>}
                    <div className="mt-4 flex justify-center gap-6 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="rounded-lg bg-[#8b7355] px-5 py-2 text-sm font-medium text-white hover:bg-[#7a6248]"
                        >
                            Imprimir / Guardar PDF
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Playlist selector (no se imprime) */}
                {playlists.length > 0 && (
                    <div className="mx-auto mb-8 max-w-xl rounded-xl border border-[#e2dbd3] bg-[#faf8f5] p-4 print:hidden">
                        <p className="mb-2 text-sm font-semibold text-gray-700">Playlists a incluir en la impresión</p>
                        <div className="flex flex-wrap gap-2">
                            {playlists.map((playlist) => {
                                const checked = selectedPlaylists.includes(playlist.id);
                                return (
                                    <button
                                        key={playlist.id}
                                        type="button"
                                        onClick={() => togglePlaylist(playlist.id)}
                                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                            checked
                                                ? 'border-[#8b7355] bg-[#8b7355] text-white'
                                                : 'border-[#e2dbd3] bg-white text-gray-500 hover:border-[#c4b5a4]'
                                        }`}
                                    >
                                        <span className={`flex h-4 w-4 items-center justify-center rounded border ${
                                            checked ? 'border-white bg-white/20' : 'border-gray-300'
                                        }`}>
                                            {checked && (
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                        </span>
                                        {playlist.name}
                                        <span className={checked ? 'text-white/70' : 'text-gray-400'}>
                                            ({playlist.songs.length})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Momentos musicales */}
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-800 print:text-xl">
                    Momentos musicales
                </h2>
                {sections.map((section) => {
                    const sectionMoments = moments.filter((m) => m.section_id === section.id);
                    if (sectionMoments.length === 0) return null;

                    return (
                        <div key={section.id} className="mb-8 print:mb-6 print:break-inside-avoid">
                            <h3 className="mb-4 text-xl font-bold text-gray-800">
                                {section.emoji} {section.name}
                            </h3>
                            <div className="space-y-3">
                                {sectionMoments.map((moment, i) => (
                                    <div key={moment.id} className="rounded-lg border border-gray-200 p-4 print:border-gray-300 print:p-3">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8b7355]/10 text-xs font-bold text-[#8b7355]">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h4 className="font-semibold text-gray-900">{moment.name}</h4>
                                                    {moment.estimated_duration && (
                                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                                            <Clock className="h-3 w-3" />
                                                            {moment.estimated_duration}
                                                        </span>
                                                    )}
                                                </div>
                                                {moment.playlist_url && (
                                                    <a
                                                        href={moment.playlist_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 flex items-center gap-1.5 text-sm text-[#8b7355] hover:underline print:text-gray-700"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="break-all">{moment.playlist_url}</span>
                                                        <span className="hidden shrink-0 rounded bg-[#8b7355]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8b7355] print:inline">
                                                            {playlistHost(moment.playlist_url)}
                                                        </span>
                                                    </a>
                                                )}
                                                {moment.notes && (
                                                    <p className="mt-2 text-sm italic text-gray-500">💬 {moment.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Playlists */}
                {playlistsToPrint.length > 0 && (
                    <div className="mt-12 print:mt-8 print:break-before-page">
                        <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-800 print:text-xl">
                            Playlists
                        </h2>
                        {playlistsToPrint.map((playlist) => (
                            <div key={playlist.id} className="mb-8 print:mb-6 print:break-inside-avoid">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <ListMusic className="h-5 w-5 text-[#8b7355]" />
                                    <h3 className="text-xl font-bold text-gray-800">{playlist.name}</h3>
                                    <span className="text-sm text-gray-400">
                                        {playlist.songs.length} canción{playlist.songs.length !== 1 ? 'es' : ''}
                                    </span>
                                </div>
                                {playlist.description && (
                                    <p className="mb-3 text-sm text-gray-500">{playlist.description}</p>
                                )}
                                {playlist.songs.length === 0 ? (
                                    <p className="text-sm italic text-gray-400">Playlist vacía</p>
                                ) : (
                                    <ol className="divide-y divide-gray-100 rounded-lg border border-gray-200 print:border-gray-300">
                                        {playlist.songs.map((song, i) => (
                                            <li key={song.id} className="flex items-center gap-3 px-4 py-2 print:py-1.5">
                                                <span className="w-6 shrink-0 text-right text-xs text-gray-400">{i + 1}</span>
                                                <div className="min-w-0 flex-1">
                                                    <span className="font-medium text-gray-900">{song.title}</span>
                                                    {song.artist && (
                                                        <span className="text-gray-400"> — {song.artist}</span>
                                                    )}
                                                </div>
                                                {song.duration && (
                                                    <span className="shrink-0 text-xs text-gray-400">{song.duration}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 border-t border-gray-100 pt-4 text-center text-xs text-gray-400 print:mt-8">
                    Documento generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 1.5cm; }
                    a { color: inherit !important; }
                }
            `}</style>
        </>
    );
}
