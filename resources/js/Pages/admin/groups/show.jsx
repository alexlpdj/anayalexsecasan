import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Pencil, Check, X, Mail, Info, Bus, Car, HelpCircle, AlertTriangle, Phone, Home, Users, Monitor, Smartphone, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function EmailRow({ label, sentAt, onSend, isSending, emailType }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleConfirm = () => {
        onSend(() => setDialogOpen(false));
    };

    return (
        <>
            <div className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    {sentAt ? (
                        <p className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                            <Check className="h-3 w-3" /> Enviado el {formatDate(sentAt)}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-0.5">— Aún no enviado</p>
                    )}
                </div>
                <Button
                    size="sm"
                    variant={sentAt ? 'outline' : 'default'}
                    className={sentAt
                        ? 'text-[#8b7355] border-[#8b7355] hover:bg-[#8b7355]/10 ml-3'
                        : 'bg-[#8b7355] text-white hover:bg-[#7a6449] ml-3'
                    }
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
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Tipo:</span> {label}
                                </p>
                                {sentAt && (
                                    <div className="rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800">
                                        <AlertTriangle className="inline mr-1 h-3.5 w-3.5" /> Ya enviado el {formatDate(sentAt)} — ¿reenviar?
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isSending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#8b7355] text-white hover:bg-[#7a6449]"
                            onClick={handleConfirm}
                            disabled={isSending}
                        >
                            {isSending ? 'Enviando…' : <><Mail className="mr-1.5 h-4 w-4 inline" /> Enviar</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function ShowGroup({ group }) {
    const [sendingInvitation, setSendingInvitation] = useState(false);

    const handleSendInvitation = (onDone) => {
        setSendingInvitation(true);
        router.post(route('admin.groups.send-invitation', group.id), {}, {
            onFinish: () => {
                setSendingInvitation(false);
                onDone();
            },
        });
    };

    const langLabel = {
        'es': 'Español',
        'pt-BR': 'Portugués (BR)',
        'fr': 'Francés',
    };

    return (
        <AdminSidebarLayout>
            <Head title={`Grupo: ${group.name}`} />

            <div className="mx-auto max-w-5xl space-y-4 p-3 sm:space-y-6 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {group.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Detalle completo del grupo
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link href={route('admin.groups.index')} className="flex-1 sm:flex-none">
                            <Button variant="outline" className="w-full sm:w-auto">← Volver</Button>
                        </Link>
                        <Link href={route('admin.groups.edit', group.id)} className="flex-1 sm:flex-none">
                            <Button variant="outline" className="flex items-center gap-1.5 w-full sm:w-auto"><Pencil className="h-4 w-4" /> Editar</Button>
                        </Link>
                    </div>
                </div>

                {/* Información del Grupo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Grupo</CardTitle>
                        <CardDescription>
                            Datos generales y estado de confirmación
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Código de Invitación
                                </label>
                                <div className="mt-1">
                                    <code className="rounded bg-gray-100 px-3 py-2 font-mono text-xl font-bold text-[#8b7355]">
                                        {group.code}
                                    </code>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Tipo de Grupo
                                </label>
                                <div className="mt-1">
                                    <Badge
                                        variant={
                                            group.type === 'FAMILIAR'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="text-base"
                                    >
                                        {group.type === 'FAMILIAR'
                                            ? <span className="flex items-center gap-1.5"><Home className="h-4 w-4" /> Familiar</span>
                                            : <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Amigos</span>
                                        }
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Estado
                                </label>
                                <div className="mt-1">
                                    {group.submitted_at ? (
                                        <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
                                            <Check className="h-3 w-3" /> Confirmado
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Pendiente de confirmación
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {group.submitted_at && (
                            <div className="rounded-lg bg-green-50 p-4">
                                <p className="text-sm text-green-700">
                                    <strong>Confirmado el:</strong>{' '}
                                    {new Date(group.submitted_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Comunicaciones por email */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Comunicaciones por email</CardTitle>
                        {group.contact_email ? (
                            <CardDescription>
                                Contacto: <span className="font-medium text-gray-700">{group.contact_email}</span>
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

                    {group.contact_email && (
                        <CardContent className="pt-0">
                            <EmailRow
                                label="Código de invitación"
                                sentAt={group.invitation_sent_at}
                                onSend={handleSendInvitation}
                                isSending={sendingInvitation}
                                emailType="invitation"
                            />
                            <div className="flex items-center justify-between py-3 border-b last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Recordatorio RSVP</p>
                                    {group.reminder_sent_at ? (
                                        <p className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
                                            <Check className="h-3 w-3" /> Enviado el {formatDate(group.reminder_sent_at)}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400 mt-0.5">— Aún no enviado</p>
                                    )}
                                </div>
                                <Badge variant="outline" className="ml-3 text-xs text-gray-400">
                                    Envío masivo desde el índice
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Confirmación de asistencia</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Automática al confirmar el RSVP</p>
                                </div>
                                <Badge className="ml-3 bg-green-100 text-green-700 text-xs">auto ✓</Badge>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Lista de Invitados */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personas del Grupo ({group.guests.length})</CardTitle>
                        <CardDescription>
                            Detalles de asistencia y necesidades especiales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {group.guests.map((guest, index) => (
                                <div
                                    key={guest.id}
                                    className="rounded-lg border bg-white p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8b7355] text-white">
                                                <span className="font-bold">{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-[#8b7355]">
                                                    {guest.name}
                                                </h3>
                                                {guest.gender && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {guest.gender === 'HOMBRE' ? 'Hombre' : 'Mujer'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            {guest.attending === null ? (
                                                <Badge variant="outline">
                                                    Sin responder
                                                </Badge>
                                            ) : guest.attending ? (
                                                <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
                                                    <Check className="h-3 w-3" /> Asistirá
                                                </Badge>
                                            ) : (
                                                <Badge className="flex items-center gap-1 bg-red-100 text-red-700">
                                                    <X className="h-3 w-3" /> No asistirá
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {guest.attending && guest.allergies && (
                                        <div className="mt-3 rounded bg-orange-50 p-3">
                                            <p className="flex items-center gap-1 text-sm font-medium text-orange-700">
                                                <AlertTriangle className="h-4 w-4" /> Alergias/Restricciones:
                                            </p>
                                            <p className="mt-1 text-sm text-orange-600">
                                                {guest.allergies}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Transporte */}
                {group.submitted_at && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Transporte</CardTitle>
                            <CardDescription>
                                Opciones de transporte seleccionadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <span className="font-medium text-gray-700">
                                        Medio de Transporte
                                    </span>
                                    <Badge variant="outline" className="flex items-center gap-1.5 text-base">
                                        {group.transport === 'AUTOBUS' && <><Bus className="h-4 w-4" /> Autobús</>}
                                        {group.transport === 'COCHE' && <><Car className="h-4 w-4" /> Coche propio</>}
                                        {group.transport === 'NO_CONFIRMADO' && <><HelpCircle className="h-4 w-4" /> No confirmado</>}
                                    </Badge>
                                </div>

                                {group.transport === 'AUTOBUS' && (
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <p className="mb-2 text-sm font-medium text-blue-700">
                                            Autobuses seleccionados:
                                        </p>
                                        <div className="space-y-1">
                                            {group.bus_onda_ida && (
                                                <p className="text-sm text-blue-600">
                                                    <Check className="inline mr-1 h-3.5 w-3.5" /> Bus desde Onda (ida)
                                                </p>
                                            )}
                                            {group.bus_onda_vuelta && (
                                                <p className="text-sm text-blue-600">
                                                    <Check className="inline mr-1 h-3.5 w-3.5" /> Bus desde Onda (vuelta)
                                                </p>
                                            )}
                                            {group.bus_cs && (
                                                <p className="text-sm text-blue-600">
                                                    <Check className="inline mr-1 h-3.5 w-3.5" /> Bus desde Castellón
                                                </p>
                                            )}
                                            {!group.bus_onda_ida && !group.bus_onda_vuelta && !group.bus_cs && (
                                                <p className="text-sm text-gray-500">
                                                    No seleccionaron ningún autobús
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contacto */}
                {group.submitted_at && (group.contact_email || group.contact_phone) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {group.contact_email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="flex items-center gap-1 font-medium text-gray-600">
                                            <Mail className="h-4 w-4" /> Email:
                                        </span>
                                        <a
                                            href={`mailto:${group.contact_email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {group.contact_email}
                                        </a>
                                    </div>
                                )}
                                {group.contact_phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="flex items-center gap-1 font-medium text-gray-600">
                                            <Phone className="h-4 w-4" /> Teléfono:
                                        </span>
                                        <a
                                            href={`tel:${group.contact_phone}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {group.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Historial de Accesos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" /> Historial de Accesos
                        </CardTitle>
                        <CardDescription>
                            {group.visits.length > 0
                                ? `${group.visits.length} acceso${group.visits.length !== 1 ? 's' : ''} registrado${group.visits.length !== 1 ? 's' : ''}`
                                : 'Aún no han accedido a la web'}
                        </CardDescription>
                    </CardHeader>
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
                                            <p className="text-sm font-medium text-gray-800">
                                                {visit.browser} · {visit.os}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {visit.device === 'mobile' ? 'Móvil' : 'Escritorio'}
                                            </p>
                                        </div>
                                        <p className="flex-shrink-0 text-xs text-gray-400">
                                            {new Date(visit.created_at).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notas (si existen) */}
                {group.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notas Administrativas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700">{group.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminSidebarLayout>
    );
}
