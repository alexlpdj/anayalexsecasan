import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
    Download,
    Search,
    Users,
    UserCheck,
    UserX,
    ChevronDown,
    ChevronRight,
    Bus,
    Car,
    AlertCircle,
    Eye,
} from 'lucide-react';

const TRANSPORT_LABEL = {
    AUTOBUS:       'Autobús',
    COCHE:         'Coche propio',
    NO_CONFIRMADO: 'Sin confirmar',
};

function TransportBadge({ group }) {
    const hasBus = group.bus_onda_ida || group.bus_onda_vuelta || group.bus_cs;
    const isCar  = group.transport === 'COCHE';

    if (!group.transport || group.transport === 'NO_CONFIRMADO') return null;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            hasBus ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
            {hasBus ? <Bus className="h-3 w-3" /> : <Car className="h-3 w-3" />}
            {isCar ? 'Coche' : [
                group.bus_onda_ida    && 'Onda ida',
                group.bus_onda_vuelta && 'Onda vuelta',
                group.bus_cs          && 'CS',
            ].filter(Boolean).join(' + ')}
        </span>
    );
}

function GuestRow({ guest }) {
    return (
        <div className={`flex items-center gap-3 rounded-md px-3 py-2 ${
            guest.attending === true  ? 'bg-green-50' :
            guest.attending === false ? 'bg-red-50'   : 'bg-gray-50'
        }`}>
            <span className="flex-1 text-sm font-medium text-gray-800">{guest.name}</span>
            {guest.attending === true  && <Badge className="bg-green-100 text-green-700 text-xs">Asiste</Badge>}
            {guest.attending === false && <Badge className="bg-red-100 text-red-700 text-xs">No asiste</Badge>}
            {guest.attending === null  && <Badge variant="outline" className="text-xs">Sin responder</Badge>}
            {guest.allergies && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    <AlertCircle className="h-3 w-3" />
                    {guest.allergies}
                </span>
            )}
        </div>
    );
}

function GroupRow({ group }) {
    const [expanded, setExpanded] = useState(false);
    const hasAllergies = group.guests.some(g => g.attending && g.allergies);

    return (
        <>
            {/* Desktop row */}
            <TableRow
                className="cursor-pointer hover:bg-[#8b7355]/5"
                onClick={() => setExpanded(p => !p)}
            >
                <TableCell className="w-6 pr-0">
                    {expanded
                        ? <ChevronDown className="h-4 w-4 text-gray-400" />
                        : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </TableCell>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>
                    <Badge variant={group.type === 'FAMILIAR' ? 'default' : 'secondary'} className="text-xs">
                        {group.type === 'FAMILIAR' ? 'Familiar' : 'Amigo'}
                    </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                    {new Date(group.submitted_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    })}
                </TableCell>
                <TableCell className="text-center">
                    <span className="font-semibold text-green-600">{group.attending_count}</span>
                    <span className="text-gray-400">/{group.total_count}</span>
                </TableCell>
                <TableCell>
                    <TransportBadge group={group} />
                </TableCell>
                <TableCell className="text-center">
                    {hasAllergies ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                            <AlertCircle className="h-3 w-3" />
                            Sí
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">—</span>
                    )}
                </TableCell>
                <TableCell className="text-right">
                    <Link
                        href={route('admin.groups.show', group.id)}
                        onClick={e => e.stopPropagation()}
                    >
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b7355] hover:bg-[#8b7355]/10">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                </TableCell>
            </TableRow>

            {/* Expanded guests */}
            <AnimatePresence>
                {expanded && (
                    <TableRow>
                        <TableCell colSpan={8} className="bg-gray-50/50 p-0">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-1.5 p-3 pl-10">
                                    {group.guests.map(guest => (
                                        <GuestRow key={guest.id} guest={guest} />
                                    ))}
                                    {group.contact_email && (
                                        <p className="pt-1 text-xs text-gray-400">
                                            Email: {group.contact_email}
                                            {group.contact_phone && ` · Tel: ${group.contact_phone}`}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </TableCell>
                    </TableRow>
                )}
            </AnimatePresence>
        </>
    );
}

function MobileGroupCard({ group }) {
    const [expanded, setExpanded] = useState(false);
    const hasAllergies = group.guests.some(g => g.attending && g.allergies);

    return (
        <div className="rounded-lg border bg-white shadow-sm">
            <button
                className="w-full p-4 text-left"
                onClick={() => setExpanded(p => !p)}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-gray-900">{group.name}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge variant={group.type === 'FAMILIAR' ? 'default' : 'secondary'} className="text-[10px]">
                                {group.type === 'FAMILIAR' ? 'Familiar' : 'Amigo'}
                            </Badge>
                            <TransportBadge group={group} />
                            {hasAllergies && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                                    <AlertCircle className="h-3 w-3" /> Alergias
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-600">{group.attending_count}</span>
                        <span className="text-xs text-gray-400">/{group.total_count}</span>
                        {expanded
                            ? <ChevronDown className="h-4 w-4 text-gray-400" />
                            : <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </div>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                    Confirmado el {new Date(group.submitted_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                </p>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t"
                    >
                        <div className="space-y-1.5 p-3">
                            {group.guests.map(guest => (
                                <GuestRow key={guest.id} guest={guest} />
                            ))}
                            {group.contact_email && (
                                <p className="pt-1 text-xs text-gray-400">
                                    {group.contact_email}
                                    {group.contact_phone && ` · ${group.contact_phone}`}
                                </p>
                            )}
                        </div>
                        <div className="border-t p-3">
                            <Link href={route('admin.groups.show', group.id)}>
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Ver detalle completo
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Confirmed({ groups, stats }) {
    const [search, setSearch]         = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [onlyAllergies, setOnlyAllergies] = useState(false);

    const filtered = groups.filter(group => {
        const matchSearch = search === '' ||
            group.name.toLowerCase().includes(search.toLowerCase()) ||
            group.guests.some(g => g.name.toLowerCase().includes(search.toLowerCase()));
        const matchType = typeFilter === 'all' || group.type === typeFilter;
        const matchAllergies = !onlyAllergies || group.guests.some(g => g.attending && g.allergies);
        return matchSearch && matchType && matchAllergies;
    });

    const statCards = [
        { label: 'Grupos confirmados', value: stats.total_confirmed_groups, color: 'text-[#8b7355]', icon: UserCheck },
        { label: 'Asistirán',          value: stats.total_attending,         color: 'text-green-600', icon: Users },
        { label: 'No asistirán',       value: stats.total_not_attending,     color: 'text-red-500',   icon: UserX },
        { label: 'Con alergias',       value: stats.with_allergies,          color: 'text-amber-600', icon: AlertCircle },
        { label: 'Bus Onda ida',       value: stats.bus_onda_ida,            color: 'text-blue-600',  icon: Bus },
        { label: 'Bus Onda vuelta',    value: stats.bus_onda_vuelta,         color: 'text-blue-600',  icon: Bus },
        { label: 'Bus Castellón',      value: stats.bus_cs,                  color: 'text-blue-600',  icon: Bus },
    ];

    return (
        <AdminSidebarLayout>
            <Head title="Personas Confirmadas" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-6 sm:p-6"
            >
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Personas Confirmadas
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Grupos que han respondido al RSVP, con el detalle de cada invitado
                        </p>
                    </div>
                    <a href={route('admin.export.confirmed')}>
                        <Button variant="outline">
                            <Download className="mr-1.5 h-4 w-4" />
                            Exportar CSV
                        </Button>
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7 sm:gap-4">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 + index * 0.04 }}
                            >
                                <Card className="transition-all hover:scale-105 hover:shadow-lg">
                                    <CardHeader className="p-3 pb-1">
                                        <CardTitle className="text-[11px] font-medium leading-tight text-gray-600">
                                            {stat.label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0">
                                        <div className={`text-2xl font-bold ${stat.color}`}>
                                            {stat.value}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Buscar grupo o invitado..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {['all', 'FAMILIAR', 'AMIGO'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setTypeFilter(type)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                            typeFilter === type
                                                ? 'bg-[#8b7355] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type === 'all' ? 'Todos' : type === 'FAMILIAR' ? 'Familiar' : 'Amigo'}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setOnlyAllergies(p => !p)}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                        onlyAllergies
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    Solo alergias
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="p-3 sm:p-6">
                            <CardTitle>Grupos confirmados</CardTitle>
                            <CardDescription>
                                {filtered.length} de {groups.length} grupos · Clic en una fila para ver los invitados
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                            {filtered.length === 0 ? (
                                <p className="py-12 text-center text-gray-500">
                                    {groups.length === 0
                                        ? 'Todavía no hay ningún grupo confirmado.'
                                        : 'No hay grupos que coincidan con los filtros.'}
                                </p>
                            ) : (
                                <>
                                    {/* Mobile: cards */}
                                    <div className="space-y-3 md:hidden">
                                        {filtered.map(group => (
                                            <MobileGroupCard key={group.id} group={group} />
                                        ))}
                                    </div>

                                    {/* Desktop: table */}
                                    <div className="hidden md:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-6" />
                                                    <TableHead>Grupo</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead>Confirmado el</TableHead>
                                                    <TableHead className="text-center">Asisten / Total</TableHead>
                                                    <TableHead>Transporte</TableHead>
                                                    <TableHead className="text-center">Alergias</TableHead>
                                                    <TableHead className="text-right">Ver</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filtered.map(group => (
                                                    <GroupRow key={group.id} group={group} />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AdminSidebarLayout>
    );
}
