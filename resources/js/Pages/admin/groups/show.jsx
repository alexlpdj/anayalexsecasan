import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ShowGroup({ group }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Grupo: ${group.name}`} />

            <div className="mx-auto max-w-5xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {group.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Detalle completo del grupo
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('admin.groups.index')}>
                            <Button variant="outline">← Volver</Button>
                        </Link>
                        <Link href={route('admin.groups.edit', group.id)}>
                            <Button variant="outline">✏️ Editar</Button>
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
                                        {group.type === 'FAMILIAR' ? '👨‍👩‍👧‍👦 Familiar' : '👥 Amigos'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Estado
                                </label>
                                <div className="mt-1">
                                    {group.submitted_at ? (
                                        <Badge className="bg-green-100 text-green-700">
                                            ✓ Confirmado
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
                                                        {guest.gender === 'HOMBRE' ? '👨 Hombre' : '👩 Mujer'}
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
                                                <Badge className="bg-green-100 text-green-700">
                                                    ✓ Asistirá
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-700">
                                                    ✗ No asistirá
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {guest.attending && guest.allergies && (
                                        <div className="mt-3 rounded bg-orange-50 p-3">
                                            <p className="text-sm font-medium text-orange-700">
                                                ⚠️ Alergias/Restricciones:
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
                                    <Badge variant="outline" className="text-base">
                                        {group.transport === 'AUTOBUS' && '🚌 Autobús'}
                                        {group.transport === 'COCHE' && '🚗 Coche propio'}
                                        {group.transport === 'NO_CONFIRMADO' && '❓ No confirmado'}
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
                                                    ✓ Bus desde Onda (ida)
                                                </p>
                                            )}
                                            {group.bus_onda_vuelta && (
                                                <p className="text-sm text-blue-600">
                                                    ✓ Bus desde Onda (vuelta)
                                                </p>
                                            )}
                                            {group.bus_cs && (
                                                <p className="text-sm text-blue-600">
                                                    ✓ Bus desde Castellón
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
                                        <span className="font-medium text-gray-600">
                                            📧 Email:
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
                                        <span className="font-medium text-gray-600">
                                            📱 Teléfono:
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
        </AuthenticatedLayout>
    );
}
