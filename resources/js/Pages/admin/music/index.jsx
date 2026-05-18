import { useState, useRef, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical, Plus, Trash2, ExternalLink, ChevronDown, ChevronUp,
    Music, X, Check, ListMusic, Share2, Printer, Copy, CheckCheck,
    Youtube, Settings2, Pencil,
} from 'lucide-react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

/* ── helpers ─────────────────────────────────────────────── */

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

/* ── Inline editable field ───────────────────────────────── */

function EditableField({ value, onSave, placeholder, textarea = false, className = '' }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value ?? '');
    const ref = useRef(null);

    useEffect(() => {
        if (editing) ref.current?.focus();
    }, [editing]);

    const commit = () => {
        setEditing(false);
        if (draft !== (value ?? '')) onSave(draft || null);
    };

    const Tag = textarea ? 'textarea' : 'input';

    if (!editing) {
        return (
            <span
                onClick={() => { setDraft(value ?? ''); setEditing(true); }}
                className={`cursor-text rounded px-1 -mx-1 hover:bg-[#f0ebe5] transition-colors ${!value ? 'text-gray-400 italic' : ''} ${className}`}
                title="Haz clic para editar"
            >
                {value || placeholder}
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1">
            <Tag
                ref={ref}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !textarea) commit();
                    if (e.key === 'Escape') { setEditing(false); setDraft(value ?? ''); }
                }}
                rows={textarea ? 3 : undefined}
                className={`w-full rounded border border-[#c4b5a4] bg-white px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b7355] ${className}`}
                placeholder={placeholder}
            />
            <button onClick={commit} className="shrink-0 rounded p-1 text-green-600 hover:bg-green-50">
                <Check className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setEditing(false); setDraft(value ?? ''); }} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-3.5 w-3.5" />
            </button>
        </span>
    );
}

/* ── Sortable moment card ────────────────────────────────── */

function MomentCard({ moment, sections, onUpdate, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: moment.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const save = (field) => (value) => onUpdate(moment.id, { [field]: value });

    return (
        <div ref={setNodeRef} style={style} className="rounded-xl border border-[#e2dbd3] bg-white shadow-sm">
            <div className="flex items-start gap-2 p-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                    <EditableField
                        value={moment.name}
                        onSave={save('name')}
                        placeholder="Nombre del momento"
                        className="text-sm font-semibold text-gray-800"
                    />

                    <div className="mt-1 flex items-center gap-1.5">
                        {moment.playlist_url ? (
                            <>
                                <a
                                    href={moment.playlist_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-medium text-[#8b7355] hover:underline"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    {playlistHost(moment.playlist_url)}
                                </a>
                                <button
                                    onClick={() => save('playlist_url')(null)}
                                    className="text-gray-300 hover:text-red-400"
                                    title="Quitar enlace"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </>
                        ) : (
                            <EditableField
                                value={moment.playlist_url}
                                onSave={save('playlist_url')}
                                placeholder="+ Añadir enlace a playlist"
                                className="text-xs text-[#8b7355]"
                            />
                        )}
                    </div>
                </div>

                <div className="shrink-0">
                    <EditableField
                        value={moment.estimated_duration}
                        onSave={save('estimated_duration')}
                        placeholder="duración"
                        className="text-xs text-gray-400"
                    />
                </div>

                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button
                    onClick={() => onDelete(moment)}
                    className="shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {expanded && (
                <div className="border-t border-[#f0ebe5] px-4 pb-3 pt-2">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">Notas para el DJ</p>
                    <EditableField
                        value={moment.notes}
                        onSave={save('notes')}
                        placeholder="Añadir instrucciones, estilo musical, BPM…"
                        textarea
                        className="text-sm text-gray-700"
                    />
                </div>
            )}
        </div>
    );
}

/* ── Section panel ───────────────────────────────────────── */

function SectionPanel({ section, moments, onUpdate, onDelete, onReorder, onAdd }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = moments.findIndex((m) => m.id === active.id);
        const newIndex = moments.findIndex((m) => m.id === over.id);
        onReorder(arrayMove(moments, oldIndex, newIndex));
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={moments.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                    {moments.length === 0 && (
                        <p className="py-6 text-center text-sm text-gray-400">
                            No hay momentos en esta sección todavía
                        </p>
                    )}
                    {moments.map((m) => (
                        <MomentCard key={m.id} moment={m} onUpdate={onUpdate} onDelete={onDelete} />
                    ))}
                </SortableContext>
            </DndContext>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onAdd(section.id)}
                className="w-full border-dashed border-[#c4b5a4] text-[#8b7355] hover:bg-[#faf8f5]"
            >
                <Plus className="mr-1 h-4 w-4" /> Añadir momento
            </Button>
        </div>
    );
}

/* ── Songs sidebar ───────────────────────────────────────── */

function SongsSidebar({ songs }) {
    const [open, setOpen] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => () => audioRef.current?.pause(), []);

    const toggle = (song) => {
        if (!song.preview_url) return;
        if (playingId === song.id) {
            audioRef.current?.pause();
            setPlayingId(null);
            return;
        }
        audioRef.current?.pause();
        const a = new Audio(song.preview_url);
        a.volume = 0.7;
        a.addEventListener('ended', () => setPlayingId(null));
        a.play().catch(() => {});
        audioRef.current = a;
        setPlayingId(song.id);
    };

    return (
        <div className="rounded-xl border border-[#e2dbd3] bg-white shadow-sm">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
                <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-[#8b7355]" />
                    <span className="text-sm font-semibold text-gray-800">Canciones sugeridas</span>
                    <Badge variant="secondary" className="bg-[#8b7355]/10 text-[#8b7355]">{songs.length}</Badge>
                </div>
                {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>

            {open && (
                <div className="max-h-[500px] divide-y divide-[#f0ebe5] overflow-y-auto border-t border-[#f0ebe5]">
                    {songs.length === 0 && (
                        <p className="px-4 py-6 text-center text-sm text-gray-400">
                            Ningún invitado ha sugerido canciones todavía
                        </p>
                    )}
                    {songs.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => toggle(s)}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#faf8f5]"
                        >
                            {s.artwork_url ? (
                                <img src={s.artwork_url} alt={s.track_title} className="h-8 w-8 shrink-0 rounded object-cover" />
                            ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#f0ebe5]">
                                    <Music className="h-4 w-4 text-[#c4b5a4]" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-gray-800">
                                    {playingId === s.id && <span className="mr-1 text-[#8b7355]">♫</span>}
                                    {s.track_title}
                                </p>
                                <p className="truncate text-[11px] text-gray-400">{s.artist_name}</p>
                            </div>
                            {s.source === 'youtube' ? (
                                <span className="shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">YouTube</span>
                            ) : (
                                <span className="shrink-0 rounded bg-[#8b7355]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8b7355]">{s.group_name}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Share dialog ────────────────────────────────────────── */

function ShareDialog({ open, onClose }) {
    const [shareUrl, setShareUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open && !shareUrl) {
            setLoading(true);
            fetch(route('admin.music.share-url'))
                .then((r) => r.json())
                .then((data) => { setShareUrl(data.url); setLoading(false); })
                .catch(() => setLoading(false));
        }
    }, [open]);

    const copyUrl = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-[#8b7355]" /> Compartir con la empresa de sonido
                    </DialogTitle>
                    <DialogDescription>
                        Enlace público sin contraseña. Cualquiera con él puede ver los momentos y playlists.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    {loading && <p className="py-4 text-center text-sm text-gray-400">Generando enlace…</p>}
                    {shareUrl && (
                        <>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={shareUrl} className="border-[#c4b5a4] bg-[#faf8f5] font-mono text-sm" onClick={(e) => e.target.select()} />
                                <Button type="button" size="sm" onClick={copyUrl} className={copied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#8b7355] hover:bg-[#7a6248]'}>
                                    {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#8b7355] hover:underline">
                                <ExternalLink className="h-3 w-3" /> Abrir en nueva pestaña
                            </a>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ── Assign YouTube playlist dialog ──────────────────────── */

function AssignPlaylistDialog({ open, onClose, sections, moments, onMomentsChange }) {
    const [url, setUrl] = useState('');
    const [targetType, setTargetType] = useState('existing'); // 'existing' | 'new'
    const [selectedMomentId, setSelectedMomentId] = useState('');
    const [newName, setNewName] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setUrl(''); setTargetType('existing'); setSelectedMomentId('');
            setNewName(''); setSelectedSectionId(sections[0]?.id ?? ''); setError('');
        }
    }, [open, sections]);

    const isValidUrl = (u) => {
        try { new URL(u); return true; } catch { return false; }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValidUrl(url)) { setError('URL no válida'); return; }

        if (targetType === 'existing') {
            if (!selectedMomentId) { setError('Selecciona un momento'); return; }
            const snapshot = moments;
            onMomentsChange((prev) => prev.map((m) => m.id === Number(selectedMomentId) ? { ...m, playlist_url: url } : m));
            router.patch(route('admin.music.update', selectedMomentId), { playlist_url: url }, {
                preserveScroll: true, preserveState: true, only: ['flash'],
                onError: () => { onMomentsChange(snapshot); setError('No se pudo guardar'); },
            });
            onClose();
        } else {
            if (!newName.trim()) { setError('Introduce un nombre para el momento'); return; }
            if (!selectedSectionId) { setError('Selecciona una sección'); return; }
            router.post(route('admin.music.store'), {
                section_id: selectedSectionId,
                name: newName.trim(),
                playlist_url: url,
            }, {
                preserveScroll: true,
                onSuccess: (page) => { onMomentsChange(page.props.moments); onClose(); },
                onError: () => setError('No se pudo crear el momento'),
            });
        }
    };

    const momentsBySectionId = (sid) => moments.filter((m) => m.section_id === sid);

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" /> Asignar playlist de YouTube Music
                    </DialogTitle>
                    <DialogDescription>
                        Pega el enlace de la playlist y elige a qué momento asignarla.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Enlace de la playlist</label>
                        <Input
                            placeholder="https://music.youtube.com/playlist?list=..."
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setError(''); }}
                            className="border-[#c4b5a4]"
                        />
                    </div>

                    {/* Target type toggle */}
                    <div className="flex rounded-lg border border-[#e2dbd3] bg-[#faf8f5] p-1">
                        {[
                            { key: 'existing', label: 'Momento existente' },
                            { key: 'new', label: 'Crear nuevo momento' },
                        ].map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setTargetType(opt.key)}
                                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    targetType === opt.key ? 'bg-white shadow-sm text-[#8b7355]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {targetType === 'existing' ? (
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Momento</label>
                            <select
                                value={selectedMomentId}
                                onChange={(e) => setSelectedMomentId(e.target.value)}
                                className="w-full rounded-lg border border-[#c4b5a4] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b7355]"
                            >
                                <option value="">— Selecciona un momento —</option>
                                {sections.map((s) => (
                                    <optgroup key={s.id} label={`${s.emoji} ${s.name}`}>
                                        {momentsBySectionId(s.id).map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Nombre del momento</label>
                                <Input
                                    placeholder="ej. Cocktail, Entrada, Primer baile…"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="border-[#c4b5a4]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Sección</label>
                                <select
                                    value={selectedSectionId}
                                    onChange={(e) => setSelectedSectionId(e.target.value)}
                                    className="w-full rounded-lg border border-[#c4b5a4] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8b7355]"
                                >
                                    {sections.map((s) => (
                                        <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
                            Asignar playlist
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/* ── Manage sections dialog ──────────────────────────────── */

function ManageSectionsDialog({ open, onClose, sections, onSectionsChange }) {
    const [newName, setNewName] = useState('');
    const [newEmoji, setNewEmoji] = useState('🎵');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmoji, setEditEmoji] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        router.post(route('admin.music.sections.store'), { name: newName.trim(), emoji: newEmoji }, {
            preserveScroll: true,
            onSuccess: (page) => { onSectionsChange(page.props.sections); setNewName(''); setNewEmoji('🎵'); },
        });
    };

    const handleUpdate = (id) => {
        router.patch(route('admin.music.sections.update', id), { name: editName, emoji: editEmoji }, {
            preserveScroll: true,
            onSuccess: (page) => { onSectionsChange(page.props.sections); setEditingId(null); },
        });
    };

    const handleDelete = (id) => {
        router.delete(route('admin.music.sections.destroy', id), {
            preserveScroll: true,
            onSuccess: (page) => { onSectionsChange(page.props.sections); setConfirmDeleteId(null); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-[#8b7355]" /> Gestionar secciones
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {sections.map((s) => (
                        <div key={s.id} className="flex items-center gap-2 rounded-lg border border-[#e2dbd3] bg-white px-3 py-2">
                            {editingId === s.id ? (
                                <>
                                    <Input value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)} className="w-14 border-[#c4b5a4] text-center text-lg" />
                                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 border-[#c4b5a4]" onKeyDown={(e) => e.key === 'Enter' && handleUpdate(s.id)} autoFocus />
                                    <button onClick={() => handleUpdate(s.id)} className="text-green-600 hover:bg-green-50 rounded p-1"><Check className="h-4 w-4" /></button>
                                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-100 rounded p-1"><X className="h-4 w-4" /></button>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">{s.emoji}</span>
                                    <span className="flex-1 text-sm font-medium text-gray-800">{s.name}</span>
                                    <button onClick={() => { setEditingId(s.id); setEditName(s.name); setEditEmoji(s.emoji); }} className="rounded p-1 text-gray-400 hover:bg-[#faf8f5] hover:text-[#8b7355]">
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    {confirmDeleteId === s.id ? (
                                        <>
                                            <button onClick={() => handleDelete(s.id)} className="rounded px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50">Eliminar</button>
                                            <button onClick={() => setConfirmDeleteId(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X className="h-3.5 w-3.5" /></button>
                                        </>
                                    ) : (
                                        <button onClick={() => setConfirmDeleteId(s.id)} className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
                        <Input value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-14 border-[#c4b5a4] text-center text-lg" placeholder="🎵" />
                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 border-[#c4b5a4]" placeholder="Nueva sección…" />
                        <Button type="submit" size="sm" disabled={!newName.trim()} className="bg-[#8b7355] text-white hover:bg-[#7a6248]">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ── Main page ───────────────────────────────────────────── */

export default function MusicIndex({ sections: initialSections, moments: initialMoments, songs }) {
    const [sections, setSections] = useState(initialSections);
    const [moments, setMoments] = useState(initialMoments);
    const [activeSection, setActiveSection] = useState(initialSections[0]?.id ?? null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showShare, setShowShare] = useState(false);
    const [showAssign, setShowAssign] = useState(false);
    const [showManageSections, setShowManageSections] = useState(false);

    // Keep activeSection valid if sections change
    useEffect(() => {
        if (activeSection && !sections.find((s) => s.id === activeSection)) {
            setActiveSection(sections[0]?.id ?? null);
        }
    }, [sections]);

    const handleUpdate = (id, patch) => {
        const snapshot = moments;
        setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
        router.patch(route('admin.music.update', id), patch, {
            preserveScroll: true,
            preserveState: true,
            only: ['flash'],
            onError: () => setMoments(snapshot),
        });
    };

    const handleDelete = (moment) => setConfirmDelete(moment);

    const confirmDoDelete = () => {
        if (!confirmDelete) return;
        setMoments((prev) => prev.filter((m) => m.id !== confirmDelete.id));
        router.delete(route('admin.music.destroy', confirmDelete.id), {
            preserveScroll: true, preserveState: true, only: ['flash'],
        });
        setConfirmDelete(null);
    };

    const handleAdd = (sectionId) => {
        router.post(route('admin.music.store'), { section_id: sectionId, name: 'Nuevo momento' }, {
            preserveScroll: true,
            onSuccess: (page) => setMoments(page.props.moments),
        });
    };

    const handleReorder = (sectionId, reordered) => {
        const snapshot = moments;
        const withOrder = reordered.map((m, i) => ({ ...m, sort_order: i }));
        setMoments((prev) => [...prev.filter((m) => m.section_id !== sectionId), ...withOrder]);
        router.post(route('admin.music.reorder'),
            { moments: withOrder.map((m) => ({ id: m.id, sort_order: m.sort_order })) },
            { preserveScroll: true, preserveState: true, only: ['flash'], onError: () => setMoments(snapshot) },
        );
    };

    return (
        <AdminSidebarLayout>
            <Head title="Organización musical" />

            <div className="mx-auto max-w-7xl p-4 pb-24 sm:p-6 lg:pb-8">
                {/* header */}
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b7355]/10">
                            <ListMusic className="h-5 w-5 text-[#8b7355]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Organización musical</h1>
                            <p className="text-sm text-gray-500">Planifica los momentos musicales de la boda</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAssign(true)} className="border-red-200 text-red-600 hover:bg-red-50">
                            <Youtube className="mr-1.5 h-3.5 w-3.5" /> Asignar YouTube
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(route('admin.music.print'), '_blank')} className="border-[#c4b5a4] text-[#8b7355] hover:bg-[#faf8f5]">
                            <Printer className="mr-1.5 h-3.5 w-3.5" /> Imprimir
                        </Button>
                        <Button size="sm" onClick={() => setShowShare(true)} className="bg-[#8b7355] text-white hover:bg-[#7a6248]">
                            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Compartir
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* left: moments */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* section tabs */}
                        <div className="flex items-center gap-2">
                            <div className="flex flex-1 flex-wrap gap-1 rounded-xl border border-[#e2dbd3] bg-[#faf8f5] p-1">
                                {sections.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                                            activeSection === s.id
                                                ? 'bg-white shadow-sm text-[#8b7355]'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {s.emoji} {s.name}
                                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                                            ({moments.filter((m) => m.section_id === s.id).length})
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowManageSections(true)}
                                title="Gestionar secciones"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2dbd3] bg-white text-gray-400 hover:bg-[#faf8f5] hover:text-[#8b7355]"
                            >
                                <Settings2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* active section content */}
                        {sections.map((s) => (
                            <div key={s.id} className={activeSection === s.id ? '' : 'hidden'}>
                                <Card className="border-[#e2dbd3] shadow-none">
                                    <CardHeader className="px-5 pb-3 pt-5">
                                        <CardTitle className="text-base">{s.emoji} {s.name}</CardTitle>
                                        <CardDescription>Arrastra para reordenar · Haz clic en cualquier texto para editarlo</CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-5 pb-5 pt-0">
                                        <SectionPanel
                                            section={s}
                                            moments={moments.filter((m) => m.section_id === s.id)}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                            onReorder={(reordered) => handleReorder(s.id, reordered)}
                                            onAdd={handleAdd}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        ))}

                        {sections.length === 0 && (
                            <div className="rounded-xl border border-dashed border-[#c4b5a4] p-12 text-center">
                                <ListMusic className="mx-auto mb-3 h-10 w-10 text-[#c4b5a4]" />
                                <p className="text-sm text-gray-400">No hay secciones. Crea una con el botón ⚙️</p>
                            </div>
                        )}
                    </div>

                    {/* right: songs sidebar */}
                    <div className="space-y-4">
                        <SongsSidebar songs={songs} />
                    </div>
                </div>
            </div>

            {/* delete moment confirmation */}
            <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Eliminar momento</DialogTitle>
                        <DialogDescription>
                            ¿Eliminar &quot;{confirmDelete?.name}&quot;? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDoDelete}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ShareDialog open={showShare} onClose={() => setShowShare(false)} />
            <AssignPlaylistDialog
                open={showAssign}
                onClose={() => setShowAssign(false)}
                sections={sections}
                moments={moments}
                onMomentsChange={setMoments}
            />
            <ManageSectionsDialog
                open={showManageSections}
                onClose={() => setShowManageSections(false)}
                sections={sections}
                onSectionsChange={setSections}
            />
        </AdminSidebarLayout>
    );
}
