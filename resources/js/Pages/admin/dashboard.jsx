import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import WeddingLayout from '@/Layouts/wedding-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, AlertTriangle, Bus, Car, Mail, Phone } from 'lucide-react';

export default function AdminDashboard({
    stats,
    guests,
    allergies,
    transport,
}) {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGuests = guests.filter((guest) => {
        // Filtro por estado
        if (filter === 'confirmed' && !guest.confirmed) return false;
        if (filter === 'pending' && guest.confirmed !== null) return false;

        // Búsqueda
        if (searchTerm && !guest.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        return true;
    });

    const exportData = () => {
        window.location.href = route('admin.export');
    };

    const printCodes = () => {
        window.open(route('admin.codes'), '_blank');
    };

    const logout = () => {
        router.post(route('logout'));
    };

    const getStatusBadge = (guest) => {
        if (guest.confirmed === null) {
            return <Badge variant="secondary">Pendiente</Badge>;
        }
        if (guest.confirmed) {
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Confirmado
                </Badge>
            );
        }
        return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                No asiste
            </Badge>
        );
    };

    return (
        <WeddingLayout>
            <Head title="Panel de Administración" />

            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className="mb-2 font-serif text-4xl italic text-[#8b7355]">
                    Panel de Administración
                </h2>
                <p className="text-[#a89584]">Gestión de invitados y confirmaciones</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg border border-[#d4c5b9]/30 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-[#8b7355]">{stats.total}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        Total
                    </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-green-600">
                        {stats.confirmed}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        Confirmados
                    </div>
                </div>
                <div className="rounded-lg border border-red-200 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-red-600">{stats.declined}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        No asisten
                    </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-gray-600">{stats.pending}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        Pendientes
                    </div>
                </div>
                <div className="rounded-lg border border-orange-200 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-orange-600">
                        {stats.with_allergies}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        Con alergias
                    </div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-white/70 p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl font-bold text-blue-600">
                        {stats.need_bus}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-[#a89584]">
                        Necesitan bus
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mb-8 rounded-lg border border-[#d4c5b9]/30 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={exportData}
                        className="bg-gradient-to-r from-[#8b7355] to-[#a89584] hover:shadow-md"
                    >
                        <Download className="mr-1.5 h-4 w-4" /> Exportar CSV
                    </Button>
                    <Button
                        onClick={printCodes}
                        variant="outline"
                        className="border-2 border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white"
                    >
                        <Printer className="mr-1.5 h-4 w-4" /> Imprimir Códigos
                    </Button>
                    <Button
                        onClick={logout}
                        variant="secondary"
                        className="ml-auto"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

            {/* Transport Summary */}
            <div className="mb-8 rounded-lg border border-[#d4c5b9]/30 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 font-serif text-xl italic text-[#8b7355]">
                    Resumen de Transporte
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded bg-gradient-to-br from-[#faf8f5] to-white p-3 text-center">
                        <div className="text-2xl font-bold text-[#8b7355]">
                            {transport.bus_onda_ida}
                        </div>
                        <div className="mt-1 text-xs text-[#a89584]">Bus Onda (Ida)</div>
                    </div>
                    <div className="rounded bg-gradient-to-br from-[#faf8f5] to-white p-3 text-center">
                        <div className="text-2xl font-bold text-[#8b7355]">
                            {transport.bus_onda_vuelta}
                        </div>
                        <div className="mt-1 text-xs text-[#a89584]">
                            Bus Onda (Vuelta)
                        </div>
                    </div>
                    <div className="rounded bg-gradient-to-br from-[#faf8f5] to-white p-3 text-center">
                        <div className="text-2xl font-bold text-[#8b7355]">
                            {transport.bus_cs}
                        </div>
                        <div className="mt-1 text-xs text-[#a89584]">Bus Castellón</div>
                    </div>
                    <div className="rounded bg-gradient-to-br from-[#faf8f5] to-white p-3 text-center">
                        <div className="text-2xl font-bold text-[#8b7355]">
                            {transport.own_car}
                        </div>
                        <div className="mt-1 text-xs text-[#a89584]">Coche Propio</div>
                    </div>
                </div>
            </div>

            {/* Allergies List */}
            {allergies.length > 0 && (
                <div className="mb-8 rounded-lg border border-orange-200 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-serif text-xl italic text-[#8b7355]">
                        <AlertTriangle className="h-5 w-5" /> Alergias y Restricciones
                    </h3>
                    <div className="space-y-2">
                        {allergies.map((guest, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded bg-orange-50 p-3"
                            >
                                <span className="font-medium text-[#8b7355]">
                                    {guest.name}
                                </span>
                                <span className="text-sm text-orange-700">
                                    {guest.allergies}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Guests List */}
            <div className="rounded-lg border border-[#d4c5b9]/30 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 font-serif text-xl italic text-[#8b7355]">
                    Lista de Invitados
                </h3>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow border-2 border-[#d4c5b9] focus:border-[#8b7355]"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setFilter('all')}
                            variant={filter === 'all' ? 'default' : 'outline'}
                            className={
                                filter === 'all'
                                    ? 'bg-[#8b7355]'
                                    : 'border-2 border-[#d4c5b9]'
                            }
                        >
                            Todos
                        </Button>
                        <Button
                            onClick={() => setFilter('confirmed')}
                            variant={filter === 'confirmed' ? 'default' : 'outline'}
                            className={
                                filter === 'confirmed'
                                    ? 'bg-green-600'
                                    : 'border-2 border-[#d4c5b9]'
                            }
                        >
                            Confirmados
                        </Button>
                        <Button
                            onClick={() => setFilter('pending')}
                            variant={filter === 'pending' ? 'default' : 'outline'}
                            className={
                                filter === 'pending'
                                    ? 'bg-gray-600'
                                    : 'border-2 border-[#d4c5b9]'
                            }
                        >
                            Pendientes
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-[#d4c5b9]">
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Tipo
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Transporte
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Código
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-[#8b7355]">
                                    Contacto
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuests.map((guest) => (
                                <tr
                                    key={guest.id}
                                    className="border-b border-[#d4c5b9]/30 transition hover:bg-[#faf8f5]"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className="font-medium text-[#8b7355]">
                                                {guest.name}
                                            </div>
                                            {guest.allergies && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
                                                    <AlertTriangle className="h-3 w-3 shrink-0" /> {guest.allergies}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#a89584]">
                                        {guest.type}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(guest)}</td>
                                    <td className="px-4 py-3 text-sm text-[#a89584]">
                                        {guest.transport === 'AUTOBUS' && (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1"><Bus className="h-3.5 w-3.5" /> Autobús</div>
                                                {guest.bus_onda_ida && (
                                                    <div className="text-xs">• Onda (ida)</div>
                                                )}
                                                {guest.bus_onda_vuelta && (
                                                    <div className="text-xs">
                                                        • Onda (vuelta)
                                                    </div>
                                                )}
                                                {guest.bus_cs && (
                                                    <div className="text-xs">• Castellón</div>
                                                )}
                                            </div>
                                        )}
                                        {guest.transport === 'COCHE' && <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" /> Coche</span>}
                                        {guest.transport === 'NO_CONFIRMADO' && '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                                            {guest.code}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[#a89584]">
                                        {guest.email && <div className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {guest.email}</div>}
                                        {guest.phone && <div className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {guest.phone}</div>}
                                        {!guest.email && !guest.phone && '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-sm text-[#a89584]">
                    Mostrando {filteredGuests.length} de {guests.length} invitados
                </div>
            </div>
        </WeddingLayout>
    );
}
