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
    Music, X, Check, ListMusic,
} from 'lucide-react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

/* ── helpers ─────────────────────────────────────────────── */

function playlistHost(url) {
    try {
        const host = new URL(url).hostname.replace('www.', '');
        if (host.includes('spotify')) return 'Spotify';
        if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube';
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

function MomentCard({ moment, onUpdate, onDelete }) {
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
                {/* drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                    {/* name */}
                    <EditableField
                        value={moment.name}
                        onSave={save('name')}
                        placeholder="Nombre del momento"
                        className="text-sm font-semibold text-gray-800"
                    />

                    {/* playlist link */}
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

                {/* duration badge */}
                <div className="shrink-0">
                    <EditableField
                        value={moment.estimated_duration}
                        onSave={save('estimated_duration')}
                        placeholder="duración"
                        className="text-xs text-gray-400"
                    />
                </div>

                {/* expand / delete */}
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

            {/* expanded: notes */}
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

function SectionPanel({ section, label, moments, onUpdate, onDelete, onReorder, onAdd }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = moments.findIndex((m) => m.id === active.id);
        const newIndex = moments.findIndex((m) => m.id === over.id);
        const reordered = arrayMove(moments, oldIndex, newIndex);
        onReorder(reordered);
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
                onClick={() => onAdd(section)}
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
                    <span className="text-sm font-semibold text-gray-800">
                        Canciones sugeridas
                    </span>
                    <Badge variant="secondary" className="bg-[#8b7355]/10 text-[#8b7355]">
                        {songs.length}
                    </Badge>
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
                            <span className="shrink-0 rounded bg-[#8b7355]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8b7355]">
                                {s.group_name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Main page ───────────────────────────────────────────── */

const SECTIONS = [
    { key: 'cena',   label: 'Cena',   emoji: '🍽️' },
    { key: 'fiesta', label: 'Fiesta', emoji: '🎉' },
];

export default function MusicIndex({ moments: initialMoments, songs }) {
    const [moments, setMoments] = useState(initialMoments);
    const [activeSection, setActiveSection] = useState('cena');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const sectioned = (section) => moments.filter((m) => m.section === section);

    const handleUpdate = (id, patch) => {
        setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
        router.patch(route('admin.music.update', id), patch, {
            preserveScroll: true,
            preserveState: true,
            only: ['flash'],
        });
    };

    const handleDelete = (moment) => setConfirmDelete(moment);

    const confirmDoDelete = () => {
        if (!confirmDelete) return;
        setMoments((prev) => prev.filter((m) => m.id !== confirmDelete.id));
        router.delete(route('admin.music.destroy', confirmDelete.id), {
            preserveScroll: true,
            preserveState: true,
            only: ['flash'],
        });
        setConfirmDelete(null);
    };

    const handleAdd = (section) => {
        router.post(
            route('admin.music.store'),
            { section, name: 'Nuevo momento' },
            {
                preserveScroll: true,
                onSuccess: (page) => setMoments(page.props.moments),
            },
        );
    };

    const handleReorder = (section, reordered) => {
        const withOrder = reordered.map((m, i) => ({ ...m, sort_order: i }));
        setMoments((prev) => [
            ...prev.filter((m) => m.section !== section),
            ...withOrder,
        ]);
        router.post(
            route('admin.music.reorder'),
            { moments: withOrder.map((m) => ({ id: m.id, sort_order: m.sort_order })) },
            { preserveScroll: true, preserveState: true, only: ['flash'] },
        );
    };

    return (
        <AdminSidebarLayout>
            <Head title="Organización musical" />

            <div className="mx-auto max-w-7xl p-4 pb-24 sm:p-6 lg:pb-8">
                {/* header */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b7355]/10">
                        <ListMusic className="h-5 w-5 text-[#8b7355]" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Organización musical</h1>
                        <p className="text-sm text-gray-500">Planifica los momentos musicales de la boda</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* ── left: moments ── */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* tabs */}
                        <div className="flex rounded-xl border border-[#e2dbd3] bg-[#faf8f5] p-1">
                            {SECTIONS.map((s) => (
                                <button
                                    key={s.key}
                                    onClick={() => setActiveSection(s.key)}
                                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                        activeSection === s.key
                                            ? 'bg-white shadow-sm text-[#8b7355]'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {s.emoji} {s.label}
                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                        ({sectioned(s.key).length})
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* section content */}
                        {SECTIONS.map((s) => (
                            <div key={s.key} className={activeSection === s.key ? '' : 'hidden'}>
                                <Card className="border-[#e2dbd3] shadow-none">
                                    <CardHeader className="px-5 pb-3 pt-5">
                                        <CardTitle className="text-base">
                                            {s.emoji} {s.label}
                                        </CardTitle>
                                        <CardDescription>
                                            Arrastra para reordenar · Haz clic en cualquier texto para editarlo
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-5 pb-5 pt-0">
                                        <SectionPanel
                                            section={s.key}
                                            label={s.label}
                                            moments={sectioned(s.key)}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                            onReorder={(reordered) => handleReorder(s.key, reordered)}
                                            onAdd={handleAdd}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {/* ── right: songs sidebar ── */}
                    <div className="space-y-4">
                        <SongsSidebar songs={songs} />
                    </div>
                </div>
            </div>

            {/* delete confirmation */}
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
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDoDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
