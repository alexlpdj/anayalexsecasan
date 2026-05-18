import { Head } from '@inertiajs/react';
import { Music, ExternalLink, Clock } from 'lucide-react';

const SECTIONS = [
    { key: 'cena', label: 'Cena', emoji: '🍽️' },
    { key: 'fiesta', label: 'Fiesta', emoji: '🎉' },
];

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

export default function MusicPrint({ moments, bride, groom, weddingDate }) {
    return (
        <>
            <Head title="Organización musical — Imprimir" />

            <div className="min-h-screen bg-white p-8 font-sans text-gray-900 print:p-4">
                {/* Header */}
                <div className="mb-8 border-b border-gray-200 pb-6 text-center print:mb-6">
                    <div className="mb-2 flex items-center justify-center gap-2 text-[#8b7355]">
                        <Music className="h-6 w-6" />
                        <span className="text-lg font-semibold tracking-wide uppercase">Organización Musical</span>
                    </div>
                    {bride && groom && (
                        <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
                            {bride} &amp; {groom}
                        </h1>
                    )}
                    {weddingDate && (
                        <p className="mt-1 text-gray-500">{weddingDate}</p>
                    )}
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

                {/* Sections */}
                {SECTIONS.map((section) => {
                    const sectionMoments = moments.filter((m) => m.section === section.key);
                    if (sectionMoments.length === 0) return null;

                    return (
                        <div key={section.key} className="mb-8 print:mb-6 print:break-inside-avoid">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">
                                {section.emoji} {section.label}
                            </h2>

                            <div className="space-y-3">
                                {sectionMoments.map((moment, i) => (
                                    <div
                                        key={moment.id}
                                        className="rounded-lg border border-gray-200 p-4 print:border-gray-300 print:p-3"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8b7355]/10 text-xs font-bold text-[#8b7355]">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="font-semibold text-gray-900">{moment.name}</h3>
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
                                                    <p className="mt-2 text-sm text-gray-500 italic">
                                                        💬 {moment.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Footer */}
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
