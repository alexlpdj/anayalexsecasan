import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ListMusic, Plus, Trash2, Music, ChevronRight } from 'lucide-react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

function NewPlaylistDialog({ open, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.playlists.store'), { onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Nueva playlist</DialogTitle>
                    <DialogDescription>Dale un nombre a la playlist. Luego podrás importar canciones desde YouTube.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <Input
                            autoFocus
                            placeholder="ej. Cena, Fiesta, Cocktail…"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="border-[#c4b5a4]"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Input
                            placeholder="Descripción (opcional)"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="border-[#c4b5a4]"
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={processing || !data.name.trim()} className="bg-[#8b7355] text-white hover:bg-[#7a6248]">
                            Crear playlist
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function PlaylistsIndex({ playlists }) {
    const [showNew, setShowNew] = useState(false);

    return (
        <AdminSidebarLayout>
            <Head title="Playlists" />

            <div className="mx-auto max-w-3xl p-4 pb-24 sm:p-6 lg:pb-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b7355]/10">
                            <ListMusic className="h-5 w-5 text-[#8b7355]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Playlists</h1>
                            <p className="text-sm text-gray-500">Crea playlists e importa canciones desde YouTube Music</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowNew(true)} className="bg-[#8b7355] text-white hover:bg-[#7a6248]">
                        <Plus className="mr-1.5 h-4 w-4" /> Nueva playlist
                    </Button>
                </div>

                {/* List */}
                {playlists.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#c4b5a4] p-14 text-center">
                        <ListMusic className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                        <p className="text-sm font-medium text-gray-500">No hay playlists todavía</p>
                        <p className="mt-1 text-xs text-gray-400">Crea una y empieza a importar canciones desde YouTube Music</p>
                        <Button onClick={() => setShowNew(true)} variant="outline" className="mt-4 border-[#c4b5a4] text-[#8b7355]">
                            <Plus className="mr-1.5 h-4 w-4" /> Nueva playlist
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {playlists.map((playlist) => (
                            <Link
                                key={playlist.id}
                                href={route('admin.playlists.show', playlist.id)}
                                className="flex items-center gap-4 rounded-xl border border-[#e2dbd3] bg-white p-4 shadow-sm transition-colors hover:border-[#c4b5a4] hover:bg-[#faf8f5]"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#8b7355]/10">
                                    <Music className="h-5 w-5 text-[#8b7355]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900">{playlist.name}</p>
                                    {playlist.description && (
                                        <p className="truncate text-sm text-gray-400">{playlist.description}</p>
                                    )}
                                </div>
                                <span className="shrink-0 rounded-full bg-[#8b7355]/10 px-2.5 py-0.5 text-xs font-medium text-[#8b7355]">
                                    {playlist.songs_count} canción{playlist.songs_count !== 1 ? 'es' : ''}
                                </span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <NewPlaylistDialog open={showNew} onClose={() => setShowNew(false)} />
        </AdminSidebarLayout>
    );
}
