import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Music, ExternalLink, Clock, Heart, Printer, CalendarClock, ListMusic, Youtube } from 'lucide-react';

function PlatformBadge({ url }) {
    try {
        const host = new URL(url).hostname.replace('www.', '');
        let label = host;
        let color = 'bg-gray-100 text-gray-600';
        if (host.includes('spotify')) { label = 'Spotify'; color = 'bg-green-100 text-green-700'; }
        else if (host.includes('youtube') || host.includes('youtu.be')) { label = 'YouTube Music'; color = 'bg-red-100 text-red-700'; }
        else if (host.includes('apple')) { label = 'Apple Music'; color = 'bg-pink-100 text-pink-700'; }
        return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}>{label}</span>;
    } catch {
        return null;
    }
}

/* ── Momentos panel ──────────────────────────────────────── */

function MomentsPanel({ sections, moments }) {
    return (
        <div className="space-y-10">
            <div className="hidden border-b border-[#e2dbd3] pb-2 print:block">
                <h2 className="font-serif text-xl italic text-[#8b7355]">Momentos musicales</h2>
            </div>

            {moments.length === 0 && (
                <div className="rounded-xl border border-[#e2dbd3] bg-white p-12 text-center">
                    <Music className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                    <p className="text-gray-400">No hay momentos musicales configurados aún.</p>
                </div>
            )}

            {sections.map((section) => {
                const sectionMoments = moments.filter((m) => m.section_id === section.id);
                if (sectionMoments.length === 0) {
                    return null;
                }

                return (
                    <div key={section.id} className="print:break-inside-avoid">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-xl">{section.emoji}</span>
                            <h3 className="text-lg font-bold text-gray-800">{section.name}</h3>
                            <span className="rounded-full bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                {sectionMoments.length} momento{sectionMoments.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {sectionMoments.map((moment, i) => (
                                <div key={moment.id} className="rounded-xl border border-[#e2dbd3] bg-white p-4 shadow-sm print:break-inside-avoid print:shadow-none">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b7355]/10 text-sm font-bold text-[#8b7355]">
                                            {i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{moment.name}</h4>
                                                {moment.estimated_duration && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Clock className="h-3 w-3" />
                                                        {moment.estimated_duration}
                                                    </span>
                                                )}
                                            </div>

                                            {moment.playlist_url ? (
                                                <a
                                                    href={moment.playlist_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group mt-2 flex items-start gap-2 rounded-lg border border-[#e2dbd3] bg-[#faf8f5] px-3 py-2 text-sm text-[#8b7355] transition-colors hover:bg-[#f0ebe5]"
                                                >
                                                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                    <span className="flex-1 break-all group-hover:underline">{moment.playlist_url}</span>
                                                    <PlatformBadge url={moment.playlist_url} />
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-sm italic text-gray-400">Sin playlist asignada</p>
                                            )}

                                            {moment.notes && (
                                                <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                                                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-amber-600">Notas para el DJ</p>
                                                    <p className="text-sm text-amber-900">{moment.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ── Playlists panel ─────────────────────────────────────── */

function PlaylistsPanel({ playlists }) {
    return (
        <div className="space-y-10">
            <div className="hidden border-b border-[#e2dbd3] pb-2 print:block">
                <h2 className="font-serif text-xl italic text-[#8b7355]">Playlists</h2>
            </div>

            {playlists.length === 0 && (
                <div className="rounded-xl border border-[#e2dbd3] bg-white p-12 text-center">
                    <ListMusic className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                    <p className="text-gray-400">No hay playlists configuradas aún.</p>
                </div>
            )}

            {playlists.map((playlist) => (
                <div key={playlist.id} className="print:break-inside-avoid">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <ListMusic className="h-5 w-5 text-[#8b7355]" />
                        <h3 className="text-lg font-bold text-gray-800">{playlist.name}</h3>
                        <span className="rounded-full bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                            {playlist.songs.length} canción{playlist.songs.length !== 1 ? 'es' : ''}
                        </span>
                    </div>
                    {playlist.description && (
                        <p className="mb-3 text-sm text-gray-400">{playlist.description}</p>
                    )}

                    {playlist.songs.length === 0 ? (
                        <p className="rounded-xl border border-[#e2dbd3] bg-white px-4 py-6 text-center text-sm italic text-gray-400">
                            Playlist vacía
                        </p>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-[#e2dbd3] bg-white shadow-sm print:shadow-none">
                            <div className="divide-y divide-[#f0ebe5]">
                                {playlist.songs.map((song, i) => (
                                    <div key={song.id} className="flex items-center gap-3 px-4 py-2.5 print:break-inside-avoid">
                                        <span className="w-6 shrink-0 text-right text-xs text-gray-300">{i + 1}</span>
                                        {song.thumbnail_url ? (
                                            <img
                                                src={song.thumbnail_url}
                                                alt={song.title}
                                                className="h-9 w-9 shrink-0 rounded object-cover print:hidden"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#f0ebe5] print:hidden">
                                                <Music className="h-4 w-4 text-[#c4b5a4]" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">{song.title}</p>
                                            {song.artist && (
                                                <p className="truncate text-xs text-gray-400">{song.artist}</p>
                                            )}
                                        </div>
                                        {song.duration && (
                                            <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" /> {song.duration}
                                            </span>
                                        )}
                                        <a
                                            href={`https://music.youtube.com/watch?v=${song.youtube_video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 text-gray-300 transition-colors hover:text-red-500 print:hidden"
                                            title="Abrir en YouTube Music"
                                        >
                                            <Youtube className="h-4 w-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ── Main page ───────────────────────────────────────────── */

export default function MusicShare({ sections, moments, playlists, bride, groom, weddingDate }) {
    const [tab, setTab] = useState('moments');

    const tabs = [
        { key: 'moments', label: 'Momentos musicales', icon: CalendarClock },
        { key: 'playlists', label: 'Playlists', icon: ListMusic },
    ];

    return (
        <>
            <Head title={`Música de la boda${bride && groom ? ` · ${bride} & ${groom}` : ''}`} />

            <style>{`
                @media print {
                    @page { margin: 1.4cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>

            <div className="min-h-screen bg-[#faf8f5]">
                {/* Header */}
                <div className="border-b border-[#e2dbd3] bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-8 text-center">
                        <div className="mb-3 flex items-center justify-center gap-2 text-[#8b7355]">
                            <span className="h-px w-8 bg-[#d8ccbd]" />
                            <Music className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Organización Musical</span>
                            <Music className="h-4 w-4" />
                            <span className="h-px w-8 bg-[#d8ccbd]" />
                        </div>
                        {bride && groom ? (
                            <h1 className="font-serif text-3xl italic text-gray-900 sm:text-4xl">
                                {bride} <span className="text-[#c4b5a4]">&</span> {groom}
                            </h1>
                        ) : (
                            <h1 className="font-serif text-3xl italic text-gray-900">Música de la boda</h1>
                        )}
                        {weddingDate && <p className="mt-1 text-sm tracking-wide text-gray-400">{weddingDate}</p>}
                        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
                            Guía musical para la empresa de sonido: momentos clave de la boda y playlists completas.
                        </p>

                        <button
                            onClick={() => window.print()}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#8b7355] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7a6248] print:hidden"
                        >
                            <Printer className="h-4 w-4" /> Imprimir todo
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sticky top-0 z-10 border-b border-[#e2dbd3] bg-white/95 backdrop-blur-sm print:hidden">
                    <div className="mx-auto flex max-w-2xl gap-1 px-4 py-2">
                        {tabs.map((t) => {
                            const Icon = t.icon;
                            const active = tab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                                        active
                                            ? 'bg-[#8b7355] text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-[#f0ebe5]'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-2xl space-y-12 px-4 py-8">
                    <div className={tab === 'moments' ? '' : 'hidden print:block'}>
                        <MomentsPanel sections={sections} moments={moments} />
                    </div>
                    <div className={tab === 'playlists' ? '' : 'hidden print:block'}>
                        <PlaylistsPanel playlists={playlists} />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e2dbd3] bg-white py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400">
                        <Heart className="h-3.5 w-3.5 text-[#c4b5a4]" />
                        <span>{bride && groom ? `${bride} & ${groom}` : 'Boda'}{weddingDate ? ` · ${weddingDate}` : ''}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
