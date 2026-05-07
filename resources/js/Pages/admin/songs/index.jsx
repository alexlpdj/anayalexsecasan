import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

function MusicIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
    );
}

function ArtworkCell({ src, alt, previewUrl, isPlaying, onToggle }) {
    return (
        <button
            type="button"
            onClick={previewUrl ? onToggle : undefined}
            className={`relative flex-shrink-0 overflow-hidden rounded-md ${previewUrl ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ width: 40, height: 40 }}
            title={previewUrl ? (isPlaying ? 'Pausar preview' : 'Escuchar preview 30s') : undefined}
        >
            {src ? (
                <img src={src} alt={alt} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#f0ebe5]">
                    <MusicIcon className="h-5 w-5 text-[#c4b5a4]" />
                </div>
            )}
            {previewUrl && (
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlaying ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0 hover:bg-black/35 hover:opacity-100'}`}>
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

const OPTS = { preserveScroll: true, preserveState: true, only: ['songs', 'flash'] };

export default function SongsIndex({ songs }) {
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);
    const [confirmId, setConfirmId] = useState(null);

    const doDelete = () => {
        if (playingId === confirmId) {
            audioRef.current?.pause();
            setPlayingId(null);
        }
        router.delete(route('admin.songs.destroy', confirmId), OPTS);
        setConfirmId(null);
    };

    useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    const togglePreview = (songId, previewUrl) => {
        if (!previewUrl) return;

        if (playingId === songId) {
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }

        if (audioRef.current) audioRef.current.pause();

        const audio = new Audio(previewUrl);
        audio.volume = 0.7;
        audio.addEventListener('ended', () => setPlayingId(null));
        audio.play().catch(() => {});
        audioRef.current = audio;
        setPlayingId(songId);
    };

    return (
        <AdminSidebarLayout>
            <Head title="Canciones sugeridas" />

            <div className="mx-auto max-w-7xl space-y-5 p-4 pb-24 sm:p-6 lg:pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Canciones para la fiesta
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Canciones sugeridas por los invitados · Pulsa la carátula para escuchar 30s
                    </p>
                </div>

                <Card>
                    <CardHeader className="px-5 pb-3 pt-5">
                        <CardTitle>Lista de canciones</CardTitle>
                        <CardDescription>
                            {songs.length} {songs.length === 1 ? 'canción sugerida' : 'canciones sugeridas'} en total
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-0">
                        {songs.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">
                                Ningún invitado ha sugerido canciones todavía
                            </p>
                        ) : (
                            <>
                                {/* Mobile: Cards */}
                                <div className="space-y-3 md:hidden">
                                    {songs.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm"
                                        >
                                            <ArtworkCell
                                                src={s.artwork_url}
                                                alt={s.album_name}
                                                previewUrl={s.preview_url}
                                                isPlaying={playingId === s.id}
                                                onToggle={() => togglePreview(s.id, s.preview_url)}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900">{s.track_title}</p>
                                                <p className="truncate text-sm text-gray-500">{s.artist_name}</p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    <span className="rounded bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                                        {s.group_name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{s.created_at}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setConfirmId(s.id)}
                                                className="shrink-0 rounded p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: Table */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-14"></TableHead>
                                                <TableHead>Canción</TableHead>
                                                <TableHead>Artista</TableHead>
                                                <TableHead className="w-48">Grupo</TableHead>
                                                <TableHead className="w-40 text-right">Fecha</TableHead>
                                                <TableHead className="w-12" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {songs.map((s) => (
                                                <TableRow key={s.id} className={playingId === s.id ? 'bg-[#faf8f5]' : ''}>
                                                    <TableCell>
                                                        <ArtworkCell
                                                            src={s.artwork_url}
                                                            alt={s.album_name}
                                                            previewUrl={s.preview_url}
                                                            isPlaying={playingId === s.id}
                                                            onToggle={() => togglePreview(s.id, s.preview_url)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium">{s.track_title}</p>
                                                        {s.preview_url && playingId !== s.id && (
                                                            <p className="text-xs text-[#a89584]">▶ preview disponible</p>
                                                        )}
                                                        {playingId === s.id && (
                                                            <p className="text-xs font-medium text-[#8b7355]">♫ reproduciendo…</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{s.artist_name}</TableCell>
                                                    <TableCell>
                                                        <span className="rounded bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                                            {s.group_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm text-gray-500">
                                                        {s.created_at}
                                                    </TableCell>
                                                    <TableCell>
                                                        <button
                                                            onClick={() => setConfirmId(s.id)}
                                                            className="rounded p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Eliminar canción</DialogTitle>
                        <DialogDescription>
                            ¿Eliminar &quot;{songs.find(s => s.id === confirmId)?.track_title}&quot;? No se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmId(null)}>Cancelar</Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={doDelete}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
