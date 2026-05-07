import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import {
    Pencil, Check, X, Mail, Info, Bus, Car, HelpCircle, AlertTriangle,
    Phone, Home, Users, Monitor, Smartphone, Activity, Save, ChevronDown,
    ChevronUp, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

/* ── helpers ─────────────────────────────────────────────────── */

function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', year: 'numeric',
    });
}

const langLabel = { es: 'Español', 'pt-BR': 'Portugués (BR)', fr: 'Francés' };

/* ── AttendingToggle ─────────────────────────────────────────── */

function AttendingToggle({ value, onChange }) {
    const options = [
        { v: true,  label: 'Asiste',    on: 'bg-green-100 text-green-700 border-green-200', off: 'hover:bg-green-50 hover:text-green-600' },
        { v: null,  label: '—',         on: 'bg-gray-100 text-gray-500 border-gray-200',   off: 'hover:bg-gray-50' },
        { v: false, label: 'No asiste', on: 'bg-red-100 text-red-700 border-red-200',      off: 'hover:bg-red-50 hover:text-red-600' },
    ];

    return (
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
            {options.map(({ v, label, on, off }, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={() => onChange(v === value ? null : v)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${i > 0 ? 'border-l border-gray-200' : ''} ${
                        value === v ? on : `bg-white text-gray-400 ${off}`
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

/* ── EmailRow ────────────────────────────────────────────────── */

function EmailRow({ label, sentAt, onSend, isSending }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between border-b py-3 last:border-0">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    {sentAt ? (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-green-600">
                            <Check className="h-3 w-3" /> Enviado el {formatDate(sentAt)}
                        </p>
                    ) : (
                        <p className="mt-0.5 text-xs text-gray-400">— Aún no enviado</p>
                    )}
                </div>
                <Button
                    size="sm"
                    variant={sentAt ? 'outline' : 'default'}
                    className={sentAt
                        ? 'ml-3 border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10'
                        : 'ml-3 bg-[#8b7355] text-white hover:bg-[#7a6449]'}
                    onClick={() => setDialogOpen(true)}
                    disabled={isSending}
                >
                    {sentAt ? 'Reenviar ↺' : 'Enviar'}
                </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirmar envío</DialogTitle>
                        <DialogDescription asChild>
                            <div className="space-y-2 pt-1">
                                <p className="text-sm text-gray-600"><span className="font-medium">Tipo:</span> {label}</p>
                                {sentAt && (
                                    <div className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                                        <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
                                        Ya enviado el {formatDate(sentAt)} — ¿reenviar?
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSending}>Cancelar</Button>
                        <Button
                            className="bg-[#8b7355] text-white hover:bg-[#7a6449]"
                            onClick={() => onSend(() => setDialogOpen(false))}
                            disabled={isSending}
                        >
                            {isSending ? 'Enviando…' : <><Mail className="mr-1.5 inline h-4 w-4" />Enviar</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

/* ── main ────────────────────────────────────────────────────── */

export default function ShowGroup({ group }) {
    const [sendingInvitation, setSendingInvitation] = useState(false);
    const [visitsExpanded, setVisitsExpanded] = useState(false);

    const attendingCount = group.guests.filter(g => g.attending === true).length;

    /* RSVP form */
    const { data, setData, patch, processing, isDirty } = useForm({
        transport:       group.transport ?? 'NO_CONFIRMADO',
        bus_onda_ida:    group.bus_onda_ida ?? false,
        bus_onda_vuelta: group.bus_onda_vuelta ?? false,
        bus_cs:          group.bus_cs ?? false,
        contact_email:   group.contact_email ?? '',
        contact_phone:   group.contact_phone ?? '',
        notes:           group.notes ?? '',
        guests: group.guests.map(g => ({
            id:        g.id,
            attending: g.attending,
            allergies: g.allergies ?? '',
        })),
    });

    const setGuest = (index, field, value) => {
        setData('guests', data.guests.map((g, i) => i === index ? { ...g, [field]: value } : g));
    };

    const submitRsvp = (e) => {
        e.preventDefault();
        patch(route('admin.groups.rsvp', group.id), { preserveScroll: true });
    };

    const handleSendInvitation = (onDone) => {
        setSendingInvitation(true);
        router.post(route('admin.groups.send-invitation', group.id), {}, {
            onFinish: () => { setSendingInvitation(false); onDone(); },
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Grupo: ${group.name}`} />

            <div className="mx-auto max-w-5xl space-y-4 p-3 sm:space-y-6 sm:p-6">

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{group.name}</h1>
                        <p className="mt-1 text-sm text-gray-500">Detalle y edición del grupo</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('admin.groups.index')}>
                            <Button variant="outline" className="w-full sm:w-auto">← Volver</Button>
                        </Link>
                        <Link href={route('admin.groups.edit', group.id)}>
                            <Button variant="outline" className="flex w-full items-center gap-1.5 sm:w-auto">
                                <Pencil className="h-4 w-4" /> Editar nombre/invitados
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Info del grupo (read-only) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Grupo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Código</p>
                                <code className="mt-1 block rounded bg-gray-100 px-3 py-1.5 font-mono text-lg font-bold text-[#8b7355]">
                                    {group.code}
                                </code>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Tipo</p>
                                <div className="mt-1">
                                    <Badge variant={group.type === 'FAMILIAR' ? 'default' : 'secondary'}>
                                        {group.type === 'FAMILIAR'
                                            ? <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Familiar</span>
                                            : <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Amigos</span>}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Estado</p>
                                <div className="mt-1">
                                    {!group.submitted_at
                                        ? <Badge variant="outline">Pendiente</Badge>
                                        : attendingCount > 0
                                            ? <Badge className="bg-green-100 text-green-700"><Check className="mr-1 h-3 w-3" />Confirmado</Badge>
                                            : <Badge className="bg-red-100 text-red-700"><X className="mr-1 h-3 w-3" />No viene</Badge>}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Idioma</p>
                                <p className="mt-1 text-sm text-gray-700">{langLabel[group.default_language] ?? '—'}</p>
                            </div>
                        </div>
                        {group.submitted_at && (
                            <div className="mt-3 rounded-lg bg-green-50 px-4 py-2">
                                <p className="text-sm text-green-700">
                                    Respondió el{' '}
                                    {new Date(group.submitted_at).toLocaleDateString('es-ES', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── PANEL RSVP EDITABLE ──────────────────────────── */}
                <form onSubmit={submitRsvp}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Gestión RSVP</CardTitle>
                                    <CardDescription>Edita la asistencia, transporte, contacto y notas</CardDescription>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing || !isDirty}
                                    className="bg-[#8b7355] text-white hover:bg-[#7a6449] disabled:opacity-50"
                                >
                                    <Save className="mr-1.5 h-4 w-4" />
                                    {processing ? 'Guardando…' : 'Guardar cambios'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Invitados */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Personas del grupo ({group.guests.length})
                                </h3>
                                <div className="space-y-3">
                                    {data.guests.map((guest, index) => {
                                        const original = group.guests[index];
                                        return (
                                            <div key={guest.id} className={`rounded-lg border p-4 transition-colors ${
                                                guest.attending === true  ? 'border-green-200 bg-green-50/50' :
                                                guest.attending === false ? 'border-red-200 bg-red-50/50'   :
                                                'border-gray-200 bg-gray-50/50'
                                            }`}>
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900">{original.name}</p>
                                                        {original.gender && (
                                                            <p className="text-xs text-gray-400">
                                                                {original.gender === 'HOMBRE' ? 'Hombre' : 'Mujer'}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <AttendingToggle
                                                        value={guest.attending}
                                                        onChange={(v) => setGuest(index, 'attending', v)}
                                                    />
                                                </div>

                                                {guest.attending !== false && (
                                                    <div className="mt-3">
                                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                                            Alergias / restricciones alimentarias
                                                        </label>
                                                        <Input
                                                            value={guest.allergies}
                                                            onChange={(e) => setGuest(index, 'allergies', e.target.value)}
                                                            placeholder="Ninguna"
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                {/* Transporte */}
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">Transporte</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-gray-500">Medio de transporte</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { v: 'AUTOBUS', label: 'Autobús', icon: Bus },
                                                { v: 'COCHE',   label: 'Coche propio', icon: Car },
                                                { v: 'NO_CONFIRMADO', label: 'Sin confirmar', icon: HelpCircle },
                                            ].map(({ v, label, icon: Icon }) => (
                                                <button
                                                    key={v}
                                                    type="button"
                                                    onClick={() => setData('transport', v)}
                                                    className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                                        data.transport === v
                                                            ? 'border-[#8b7355] bg-[#8b7355]/10 text-[#8b7355]'
                                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" /> {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {data.transport === 'AUTOBUS' && (
                                        <div className="rounded-lg bg-blue-50 p-4">
                                            <p className="mb-2 text-xs font-medium text-blue-700">Autobuses seleccionados</p>
                                            <div className="space-y-2">
                                                {[
                                                    { key: 'bus_onda_ida',    label: 'Bus desde Onda (ida)' },
                                                    { key: 'bus_onda_vuelta', label: 'Bus desde Onda (vuelta)' },
                                                    { key: 'bus_cs',          label: 'Bus desde Castellón' },
                                                ].map(({ key, label }) => (
                                                    <label key={key} className="flex cursor-pointer items-center gap-2.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={data[key]}
                                                            onChange={(e) => setData(key, e.target.checked)}
                                                            className="h-4 w-4 rounded border-gray-300 accent-[#8b7355]"
                                                        />
                                                        <span className="text-sm text-blue-800">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                {/* Contacto */}
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">Contacto</h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                            <Mail className="mr-1 inline h-3.5 w-3.5" />Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            placeholder="Sin email"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                            <Phone className="mr-1 inline h-3.5 w-3.5" />Teléfono
                                        </label>
                                        <Input
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            placeholder="Sin teléfono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                {/* Notas */}
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">Notas administrativas</h3>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Notas internas sobre este grupo (no las ven los invitados)…"
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                        </CardContent>
                    </Card>
                </form>

                {/* Comunicaciones por email */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" /> Comunicaciones por email
                        </CardTitle>
                        {data.contact_email ? (
                            <CardDescription>
                                Contacto: <span className="font-medium text-gray-700">{data.contact_email}</span>
                                {group.default_language && (
                                    <span className="ml-2 text-gray-400">· {langLabel[group.default_language] ?? group.default_language}</span>
                                )}
                            </CardDescription>
                        ) : (
                            <CardDescription className="flex items-center gap-1">
                                <Info className="h-3.5 w-3.5" /> Sin email — el invitado lo facilita al confirmar
                            </CardDescription>
                        )}
                    </CardHeader>

                    {data.contact_email && (
                        <CardContent className="pt-0">
                            <EmailRow
                                label="Código de invitación"
                                sentAt={group.invitation_sent_at}
                                onSend={handleSendInvitation}
                                isSending={sendingInvitation}
                            />
                            <div className="flex items-center justify-between border-b py-3 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Recordatorio RSVP</p>
                                    {group.reminder_sent_at ? (
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-green-600">
                                            <Check className="h-3 w-3" /> Enviado el {formatDate(group.reminder_sent_at)}
                                        </p>
                                    ) : (
                                        <p className="mt-0.5 text-xs text-gray-400">— Aún no enviado</p>
                                    )}
                                </div>
                                <Badge variant="outline" className="ml-3 text-xs text-gray-400">Envío masivo desde el índice</Badge>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Confirmación de asistencia</p>
                                    <p className="mt-0.5 text-xs text-gray-400">Automática al confirmar el RSVP</p>
                                </div>
                                <Badge className="ml-3 bg-green-100 text-green-700 text-xs">auto ✓</Badge>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Historial de accesos (colapsable) */}
                <Card>
                    <CardHeader
                        className="cursor-pointer select-none"
                        onClick={() => setVisitsExpanded(v => !v)}
                    >
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Activity className="h-4 w-4" /> Historial de accesos
                                <span className="text-sm font-normal text-gray-400">
                                    ({group.visits.length} {group.visits.length === 1 ? 'acceso' : 'accesos'})
                                </span>
                            </CardTitle>
                            {visitsExpanded
                                ? <ChevronUp className="h-4 w-4 text-gray-400" />
                                : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </div>
                        {!visitsExpanded && group.visits.length > 0 && (
                            <CardDescription>
                                Último acceso:{' '}
                                {new Date(group.visits[0]?.created_at).toLocaleDateString('es-ES', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                })}
                                {' · '}desde {group.visits[0]?.device === 'mobile' ? 'móvil' : 'escritorio'}
                            </CardDescription>
                        )}
                        {!visitsExpanded && group.visits.length === 0 && (
                            <CardDescription>Aún no han accedido a la web</CardDescription>
                        )}
                    </CardHeader>

                    {visitsExpanded && (
                        <CardContent>
                            {group.visits.length === 0 ? (
                                <p className="py-4 text-center text-sm text-gray-400">Sin accesos registrados</p>
                            ) : (
                                <div className="space-y-2">
                                    {group.visits.map((visit) => (
                                        <div key={visit.id} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-3 py-2.5">
                                            <div className="flex-shrink-0 text-gray-400">
                                                {visit.device === 'mobile'
                                                    ? <Smartphone className="h-4 w-4 text-violet-500" />
                                                    : <Monitor className="h-4 w-4 text-blue-500" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-800">{visit.browser} · {visit.os}</p>
                                                <p className="text-xs text-gray-500">{visit.device === 'mobile' ? 'Móvil' : 'Escritorio'}</p>
                                            </div>
                                            <p className="flex-shrink-0 text-xs text-gray-400">
                                                {new Date(visit.created_at).toLocaleDateString('es-ES', {
                                                    day: 'numeric', month: 'short',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>

            </div>
        </AdminSidebarLayout>
    );
}
