import { Head } from '@inertiajs/react';
import { Music, ExternalLink, Clock, Heart } from 'lucide-react';

const SECTIONS = [
    { key: 'cena', label: 'Cena', emoji: '🍽️' },
    { key: 'fiesta', label: 'Fiesta', emoji: '🎉' },
];

function PlatformBadge({ url }) {
    try {
        const host = new URL(url).hostname.replace('www.', '');
        let label = host;
        let color = 'bg-gray-100 text-gray-600';

        if (host.includes('spotify')) {
            label = 'Spotify';
            color = 'bg-green-100 text-green-700';
        } else if (host.includes('youtube') || host.includes('youtu.be')) {
            label = 'YouTube Music';
            color = 'bg-red-100 text-red-700';
        } else if (host.includes('apple')) {
            label = 'Apple Music';
            color = 'bg-pink-100 text-pink-700';
        }

        return (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${color}`}>
                {label}
            </span>
        );
    } catch {
        return null;
    }
}

export default function MusicShare({ moments, bride, groom, weddingDate }) {
    const hasMoments = moments.length > 0;

    return (
        <>
            <Head title={`Música de la boda${bride && groom ? ` · ${bride} & ${groom}` : ''}`} />

            <div className="min-h-screen bg-[#faf8f5]">
                {/* Header */}
                <div className="bg-white border-b border-[#e2dbd3]">
                    <div className="mx-auto max-w-2xl px-4 py-8 text-center">
                        <div className="mb-3 flex items-center justify-center gap-2 text-[#8b7355]">
                            <Music className="h-5 w-5" />
                            <span className="text-sm font-semibold uppercase tracking-widest">Organización Musical</span>
                        </div>
                        {bride && groom ? (
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {bride} <span className="text-[#c4b5a4]">&</span> {groom}
                            </h1>
                        ) : (
                            <h1 className="text-2xl font-bold text-gray-900">Momentos musicales</h1>
                        )}
                        {weddingDate && (
                            <p className="mt-1 text-gray-400 text-sm">{weddingDate}</p>
                        )}
                        <p className="mt-3 text-sm text-gray-500">
                            Este documento contiene los momentos musicales de la boda y los enlaces a las playlists.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-2xl px-4 py-8 space-y-10">
                    {!hasMoments && (
                        <div className="rounded-xl border border-[#e2dbd3] bg-white p-12 text-center">
                            <Music className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                            <p className="text-gray-400">No hay momentos musicales configurados aún.</p>
                        </div>
                    )}

                    {SECTIONS.map((section) => {
                        const sectionMoments = moments.filter((m) => m.section === section.key);
                        if (sectionMoments.length === 0) return null;

                        return (
                            <div key={section.key}>
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-xl">{section.emoji}</span>
                                    <h2 className="text-lg font-bold text-gray-800">{section.label}</h2>
                                    <span className="rounded-full bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                        {sectionMoments.length} momento{sectionMoments.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {sectionMoments.map((moment, i) => (
                                        <div
                                            key={moment.id}
                                            className="rounded-xl border border-[#e2dbd3] bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b7355]/10 text-sm font-bold text-[#8b7355]">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">{moment.name}</h3>
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
                                                            className="mt-2 flex items-start gap-2 rounded-lg border border-[#e2dbd3] bg-[#faf8f5] px-3 py-2 text-sm text-[#8b7355] hover:bg-[#f0ebe5] transition-colors group"
                                                        >
                                                            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                            <span className="break-all flex-1 group-hover:underline">
                                                                {moment.playlist_url}
                                                            </span>
                                                            <PlatformBadge url={moment.playlist_url} />
                                                        </a>
                                                    ) : (
                                                        <p className="mt-1 text-sm text-gray-400 italic">Sin playlist asignada</p>
                                                    )}

                                                    {moment.notes && (
                                                        <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-0.5">
                                                                Notas para el DJ
                                                            </p>
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

                {/* Footer */}
                <div className="border-t border-[#e2dbd3] bg-white py-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400">
                        <Heart className="h-3.5 w-3.5 text-[#c4b5a4]" />
                        <span>
                            {bride && groom ? `${bride} & ${groom}` : 'Boda'}
                            {weddingDate ? ` · ${weddingDate}` : ''}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
