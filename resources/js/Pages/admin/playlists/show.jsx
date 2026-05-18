import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft, Music, Youtube, Trash2, Clock, Search,
    Download, ListMusic, Pencil, Check, X,
} from 'lucide-react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

/* ── Import from YouTube dialog ──────────────────────────── */

function ImportDialog({ open, onClose, playlistId }) {
    const { data, setData, post, processing, errors, reset } = useForm({ playlist_url: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.playlists.import', playlistId), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" /> Importar desde YouTube Music
                    </DialogTitle>
                    <DialogDescription>
                        Pega el enlace de una playlist pública de YouTube o YouTube Music. Se importarán todas las canciones.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <Input
                            autoFocus
                            placeholder="https://music.youtube.com/playlist?list=…"
                            value={data.playlist_url}
                            onChange={(e) => setData('playlist_url', e.target.value)}
                            className="border-[#c4b5a4]"
                        />
                        {errors.playlist_url && (
                            <p className="mt-1 text-xs text-red-500">{errors.playlist_url}</p>
                        )}
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            También funciona con URLs de YouTube estándar (<code className="rounded bg-gray-100 px-1">youtube.com/playlist?list=…</code>)
                        </p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.playlist_url.trim()}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {processing ? (
                                <span className="flex items-center gap-1.5">
                                    <Download className="h-4 w-4 animate-bounce" /> Importando…
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Download className="h-4 w-4" /> Importar canciones
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/* ── Song row ────────────────────────────────────────────── */

function SongRow({ song, playlistId, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
        router.delete(route('admin.playlists.songs.destroy', { playlist: playlistId, song: song.id }), {
            preserveScroll: true,
            onSuccess: () => setConfirmDelete(false),
        });
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#faf8f5] group">
            {song.thumbnail_url ? (
                <img
                    src={song.thumbnail_url}
                    alt={song.title}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#f0ebe5]">
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
                <span className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" /> {song.duration}
                </span>
            )}

            <a
                href={`https://music.youtube.com/watch?v=${song.youtube_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                title="Abrir en YouTube Music"
            >
                <Youtube className="h-4 w-4" />
            </a>

            {confirmDelete ? (
                <div className="flex shrink-0 items-center gap-1">
                    <button onClick={handleDelete} className="rounded px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50">
                        Eliminar
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setConfirmDelete(true)}
                    className="shrink-0 rounded p-1 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

/* ── Main page ───────────────────────────────────────────── */

export default function PlaylistShow({ playlist, songs: initialSongs }) {
    const [songs, setSongs] = useState(initialSongs);
    const [search, setSearch] = useState('');
    const [showImport, setShowImport] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [draftName, setDraftName] = useState(playlist.name);
    const [confirmDeletePlaylist, setConfirmDeletePlaylist] = useState(false);

    const filtered = search
        ? songs.filter((s) =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            (s.artist ?? '').toLowerCase().includes(search.toLowerCase()),
          )
        : songs;

    const saveName = () => {
        setEditingName(false);
        if (draftName.trim() && draftName !== playlist.name) {
            router.patch(route('admin.playlists.update', playlist.id), { name: draftName.trim() }, {
                preserveScroll: true,
                preserveState: true,
                only: ['flash'],
            });
        }
    };

    const deletePlaylist = () => {
        router.delete(route('admin.playlists.destroy', playlist.id));
    };

    // Refresh songs list after import
    const handleImportClose = () => {
        setShowImport(false);
        router.reload({ only: ['songs'] });
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Playlist · ${playlist.name}`} />

            <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:pb-8">
                {/* Back */}
                <Link
                    href={route('admin.playlists.index')}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#8b7355]"
                >
                    <ArrowLeft className="h-4 w-4" /> Todas las playlists
                </Link>

                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8b7355]/10">
                            <ListMusic className="h-6 w-6 text-[#8b7355]" />
                        </div>
                        <div>
                            {editingName ? (
                                <div className="flex items-center gap-1">
                                    <Input
                                        autoFocus
                                        value={draftName}
                                        onChange={(e) => setDraftName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                                        className="h-7 border-[#c4b5a4] text-base font-bold"
                                    />
                                    <button onClick={saveName} className="rounded p-1 text-green-600 hover:bg-green-50"><Check className="h-4 w-4" /></button>
                                    <button onClick={() => setEditingName(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <h1 className="text-lg font-bold text-gray-900">{playlist.name}</h1>
                                    <button onClick={() => setEditingName(true)} className="rounded p-1 text-gray-300 hover:text-[#8b7355]">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                            <p className="text-sm text-gray-400">
                                {songs.length} canción{songs.length !== 1 ? 'es' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {confirmDeletePlaylist ? (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setConfirmDeletePlaylist(false)}>Cancelar</Button>
                                <Button size="sm" onClick={deletePlaylist} className="bg-red-600 text-white hover:bg-red-700">Eliminar playlist</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setConfirmDeletePlaylist(true)} className="border-red-200 text-red-400 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={() => setShowImport(true)} className="bg-red-600 text-white hover:bg-red-700">
                                    <Youtube className="mr-1.5 h-4 w-4" /> Importar de YouTube
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Song list */}
                <div className="rounded-xl border border-[#e2dbd3] bg-white shadow-sm">
                    {songs.length > 0 && (
                        <div className="border-b border-[#f0ebe5] px-4 py-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                                <Input
                                    placeholder="Buscar canciones…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-[#e2dbd3] pl-9 focus:ring-[#8b7355]"
                                />
                            </div>
                        </div>
                    )}

                    {songs.length === 0 ? (
                        <div className="py-16 text-center">
                            <Music className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                            <p className="text-sm font-medium text-gray-500">Esta playlist está vacía</p>
                            <p className="mt-1 text-xs text-gray-400">Importa canciones desde YouTube Music</p>
                            <Button onClick={() => setShowImport(true)} variant="outline" className="mt-4 border-[#c4b5a4] text-[#8b7355]">
                                <Youtube className="mr-1.5 h-4 w-4" /> Importar de YouTube
                            </Button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="py-10 text-center text-sm text-gray-400">No hay canciones que coincidan con "{search}"</p>
                    ) : (
                        <div className="divide-y divide-[#f0ebe5]">
                            {filtered.map((song, i) => (
                                <div key={song.id} className="flex items-center">
                                    <span className="w-10 shrink-0 text-center text-xs text-gray-300">{i + 1}</span>
                                    <div className="flex-1">
                                        <SongRow song={song} playlistId={playlist.id} onDelete={(id) => setSongs((prev) => prev.filter((s) => s.id !== id))} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ImportDialog open={showImport} onClose={handleImportClose} playlistId={playlist.id} />
        </AdminSidebarLayout>
    );
}
