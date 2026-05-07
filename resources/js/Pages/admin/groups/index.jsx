import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Pencil, Trash2, Plus, Search, Users, UserCheck, ChevronRight, MoreHorizontal, Send, Mail, Bell, Printer, Download, Monitor, Smartphone, Activity, ArrowUp, ArrowDown, ArrowUpDown, Filter, X, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Label,
} from 'recharts';

function CenterLabel({ viewBox, total, label }) {
    const { cx, cy } = viewBox;
    return (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
            <tspan x={cx} dy="-0.5em" fontSize="22" fontWeight="bold" fill="#111827">{total}</tspan>
            <tspan x={cx} dy="1.5em" fontSize="11" fill="#6b7280">{label}</tspan>
        </text>
    );
}

const INERTIA_TOGGLE_OPTS = {
    preserveScroll: true,
    preserveState: true,
    only: ['groups', 'stats', 'chartData', 'flash'],
};

const STATUS_OPTIONS = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmados' },
    { value: 'declined', label: 'No vienen' },
];

const TYPE_OPTIONS = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'FAMILIAR', label: 'Familiar' },
    { value: 'AMIGO', label: 'Amigo' },
];

const TRISTATE_OPTIONS = (yesLabel, noLabel) => [
    { value: 'all', label: 'Todos' },
    { value: 'yes', label: yesLabel },
    { value: 'no', label: noLabel },
];

function groupStatus(group) {
    if (!group.has_submitted) return 'pending';
    return group.attending_count > 0 ? 'confirmed' : 'declined';
}

function SortHeader({ label, column, sortBy, sortDir, onSort, className = '' }) {
    const active = sortBy === column;
    const Icon = !active ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown;
    return (
        <button
            type="button"
            onClick={() => onSort(column)}
            className={`inline-flex items-center gap-1 transition-colors hover:text-[#8b7355] ${active ? 'text-[#8b7355]' : 'text-gray-600'} ${className}`}
        >
            {label}
            <Icon className="h-3 w-3" />
        </button>
    );
}

export default function GroupsIndex({ groups, stats, chartData }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [printedFilter, setPrintedFilter] = useState('all');
    const [deliveredFilter, setDeliveredFilter] = useState('all');
    const [sentFilter, setSentFilter] = useState('all');
    const [accessedFilter, setAccessedFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [pendingKeys, setPendingKeys] = useState(new Set());

    const [showReminderModal, setShowReminderModal] = useState(false);
    const [sendingReminders, setSendingReminders] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [customSubject, setCustomSubject] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [sendingCustom, setSendingCustom] = useState(false);

    const [showPushModal, setShowPushModal] = useState(false);
    const [pushSelectedIds, setPushSelectedIds] = useState(new Set());
    const [pushTitle, setPushTitle] = useState('');
    const [pushBody, setPushBody] = useState('');
    const [sendingPush, setSendingPush] = useState(false);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortDir('asc');
        }
    };

    const matchesTristate = (filter, hasFlag) => {
        if (filter === 'all') return true;
        if (filter === 'yes') return hasFlag;
        return !hasFlag;
    };

    const filteredGroups = groups
        .filter((group) => {
            const q = search.trim().toLowerCase();
            const matchSearch = !q ||
                group.name.toLowerCase().includes(q) ||
                group.code.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'all' || groupStatus(group) === statusFilter;
            const matchType = typeFilter === 'all' || group.type === typeFilter;
            const matchPrinted = matchesTristate(printedFilter, !!group.printed_at);
            const matchDelivered = matchesTristate(deliveredFilter, !!group.delivered_at);
            const matchSent = matchesTristate(sentFilter, !!group.invitation_sent_at);
            const matchAccessed = matchesTristate(accessedFilter, group.visits_count > 0);
            return matchSearch && matchStatus && matchType && matchPrinted && matchDelivered && matchSent && matchAccessed;
        })
        .sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            const get = (g) => {
                switch (sortBy) {
                    case 'name': return g.name?.toLowerCase() ?? '';
                    case 'code': return g.code?.toLowerCase() ?? '';
                    case 'type': return g.type ?? '';
                    case 'guests': return g.guests_count ?? 0;
                    case 'attending': return g.attending_count ?? 0;
                    case 'status': return groupStatus(g);
                    case 'printed': return g.printed_at ? new Date(g.printed_at).getTime() : 0;
                    case 'delivered': return g.delivered_at ? new Date(g.delivered_at).getTime() : 0;
                    case 'sent': return g.invitation_sent_at ? new Date(g.invitation_sent_at).getTime() : 0;
                    case 'accessed': return g.visits_count ?? 0;
                    default: return 0;
                }
            };
            const va = get(a);
            const vb = get(b);
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return 0;
        });

    const activeFilterCount = [statusFilter, typeFilter, printedFilter, deliveredFilter, sentFilter, accessedFilter]
        .filter((v) => v !== 'all').length;

    const clearFilters = () => {
        setStatusFilter('all');
        setTypeFilter('all');
        setPrintedFilter('all');
        setDeliveredFilter('all');
        setSentFilter('all');
        setAccessedFilter('all');
    };

    const openConfirm = (title, description, onConfirm, variant = 'default') => {
        setConfirmDialog({ title, description, onConfirm, variant });
    };

    const withPending = (key, callback) => {
        setPendingKeys(prev => new Set([...prev, key]));
        callback({
            ...INERTIA_TOGGLE_OPTS,
            onFinish: () => setPendingKeys(prev => { const next = new Set(prev); next.delete(key); return next; }),
        });
    };

    const isPending = (key) => pendingKeys.has(key);

    const togglePrinted = (group) => withPending(`printed-${group.id}`, (opts) =>
        router.post(route('admin.groups.toggle-printed', group.id), {}, opts));
    const toggleDelivered = (group) => withPending(`delivered-${group.id}`, (opts) =>
        router.post(route('admin.groups.toggle-delivered', group.id), {}, opts));
    const toggleInvitationSent = (group) => withPending(`sent-${group.id}`, (opts) =>
        router.post(route('admin.groups.toggle-invitation-sent', group.id), {}, opts));

    const adminConfirm = (group) => openConfirm(
        'Confirmar asistencia',
        `¿Marcar "${group.name}" como confirmado? Todos los invitados quedarán marcados como asistentes.`,
        () => router.post(route('admin.groups.admin-confirm', group.id), {}, INERTIA_TOGGLE_OPTS),
        'success'
    );
    const adminDecline = (group) => openConfirm(
        'Marcar como rechazado',
        `¿Marcar "${group.name}" como rechazado? Ningún invitado asistirá y se borrarán alergias y transporte.`,
        () => router.post(route('admin.groups.admin-decline', group.id), {}, INERTIA_TOGGLE_OPTS),
        'danger'
    );
    const adminResetRsvp = (group) => openConfirm(
        'Restablecer a pendiente',
        `¿Restablecer "${group.name}" a pendiente? Se borrará su respuesta de RSVP.`,
        () => router.post(route('admin.groups.admin-reset-rsvp', group.id), {}, INERTIA_TOGGLE_OPTS),
        'danger'
    );
    const deleteGroup = (group) => openConfirm(
        'Eliminar grupo',
        `¿Eliminar el grupo "${group.name}" y todos sus invitados (${group.guests_count} personas)? Esta acción no se puede deshacer.`,
        () => router.delete(route('admin.groups.destroy', group.id)),
        'danger'
    );

    const closeCustomModal = () => {
        setShowCustomModal(false);
        setSelectedIds(new Set());
        setCustomSubject('');
        setCustomMessage('');
    };

    const closePushModal = () => {
        setShowPushModal(false);
        setPushSelectedIds(new Set());
        setPushTitle('');
        setPushBody('');
    };

    const handleSendPush = () => {
        setSendingPush(true);
        router.post(route('admin.groups.send-push'), {
            group_ids: [...pushSelectedIds],
            title: pushTitle,
            body: pushBody,
        }, {
            onFinish: () => {
                setSendingPush(false);
                closePushModal();
            },
        });
    };

    const handleSendCustom = () => {
        setSendingCustom(true);
        router.post(route('admin.groups.send-custom-message'), {
            group_ids: [...selectedIds],
            subject: customSubject,
            message: customMessage,
        }, {
            onFinish: () => {
                setSendingCustom(false);
                closeCustomModal();
            },
        });
    };

    const handleSendReminders = () => {
        setSendingReminders(true);
        router.post(route('admin.groups.send-reminders'), {}, {
            onFinish: () => {
                setSendingReminders(false);
                setShowReminderModal(false);
            },
        });
    };

    return (
        <AdminSidebarLayout>
            <Head title="Gestión de Grupos" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-7xl space-y-5 p-4 pb-24 sm:p-6 lg:pb-8"
            >
                {/* Header actions */}
                <div className="flex w-full items-center gap-2 sm:w-auto sm:ml-auto">
                        {/* Mobile: dropdown with secondary actions */}
                        <div className="sm:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    {stats.pending_with_email > 0 && (
                                        <>
                                            <DropdownMenuItem onClick={() => setShowReminderModal(true)}>
                                                <Send className="mr-2 h-4 w-4" /> Recordatorio pendientes
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={() => setShowCustomModal(true)}>
                                        <Mail className="mr-2 h-4 w-4" /> Mensaje personalizado
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowPushModal(true)}>
                                        <Bell className="mr-2 h-4 w-4" /> Notificación push
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <a href={route('admin.print.codes')} target="_blank">
                                            <Printer className="mr-2 h-4 w-4" /> Imprimir códigos
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href={route('admin.export.codes')}>
                                            <Download className="mr-2 h-4 w-4" /> Exportar CSV
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Desktop: all buttons visible */}
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
                            {stats.pending_with_email > 0 && (
                                <Button
                                    variant="outline"
                                    className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10"
                                    onClick={() => setShowReminderModal(true)}
                                >
                                    <Send className="mr-1.5 h-4 w-4" /> Enviar recordatorio a pendientes
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setShowCustomModal(true)}>
                                <Mail className="mr-1.5 h-4 w-4" /> Mensaje personalizado
                            </Button>
                            <Button variant="outline" onClick={() => setShowPushModal(true)}>
                                <Bell className="mr-1.5 h-4 w-4" /> Notificación push
                            </Button>
                            <a href={route('admin.print.codes')} target="_blank">
                                <Button variant="outline"><Printer className="mr-1.5 h-4 w-4" /> Imprimir códigos</Button>
                            </a>
                            <a href={route('admin.export.codes')}>
                                <Button variant="outline"><Download className="mr-1.5 h-4 w-4" /> Exportar CSV</Button>
                            </a>
                        </div>

                        <Link href={route('admin.groups.create')}>
                            <Button className="bg-gradient-to-r from-[#8b7355] to-[#a89584] transition-transform hover:scale-105">
                                <Plus className="mr-1.5 h-4 w-4" />
                                <span className="hidden sm:inline">Crear Grupo Nuevo</span>
                                <span className="sm:hidden">Nuevo</span>
                            </Button>
                        </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 sm:gap-4">
                    {[
                        { label: 'Total Grupos',    value: stats.total_groups,     color: 'text-[#8b7355]', unit: 'grupos'   },
                        { label: 'Confirmados',     value: stats.confirmed_groups, color: 'text-green-600', unit: 'grupos'   },
                        { label: 'Pendientes',      value: stats.pending_groups,   color: 'text-gray-600',  unit: 'grupos'   },
                        { label: 'Han accedido',    value: stats.accessed_groups,  color: 'text-blue-600',  unit: 'grupos'   },
                        { label: 'Total Personas',  value: stats.total_guests,     color: 'text-[#8b7355]', unit: 'personas' },
                        { label: 'Asistirán',       value: stats.attending_guests, color: 'text-green-600', unit: 'personas' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                        >
                            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
                                <CardHeader className="px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
                                    <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
                                        {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 + index * 0.05 }}
                                        className={`text-2xl font-bold sm:text-3xl ${stat.color}`}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">{stat.unit}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                {chartData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
                    >
                        {/* Donut: Asistencia */}
                        <Card className="transition-shadow hover:shadow-lg">
                            <CardHeader className="px-5 pb-0 pt-5">
                                <CardTitle className="text-sm font-medium text-gray-600">Asistencia</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.attendance}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {chartData.attendance.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                            <Label
                                                content={<CenterLabel total={stats.total_guests} label="personas" />}
                                                position="center"
                                            />
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} personas`]} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Barras: Transporte */}
                        <Card className="transition-shadow hover:shadow-lg">
                            <CardHeader className="px-5 pb-0 pt-5">
                                <CardTitle className="text-sm font-medium text-gray-600">Transporte</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart
                                        data={chartData.transport}
                                        layout="vertical"
                                        margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                                    >
                                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={120}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <Tooltip formatter={(value) => [`${value} personas`]} />
                                        <Bar dataKey="value" fill="#8b7355" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Donut: Tipos */}
                        <Card className="transition-shadow hover:shadow-lg">
                            <CardHeader className="px-5 pb-0 pt-5">
                                <CardTitle className="text-sm font-medium text-gray-600">Tipos de Grupo</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={chartData.group_types}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {chartData.group_types.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                            <Label
                                                content={<CenterLabel total={stats.total_groups} label="grupos" />}
                                                position="center"
                                            />
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} grupos`]} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Search + Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardContent className="space-y-3 px-5 py-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar por nombre o código..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-9 transition-all focus:ring-2 focus:ring-[#8b7355]"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters((v) => !v)}
                                    className={activeFilterCount > 0 ? 'border-[#8b7355] text-[#8b7355]' : ''}
                                >
                                    <Filter className="mr-1.5 h-4 w-4" />
                                    Filtros
                                    {activeFilterCount > 0 && (
                                        <Badge className="ml-1.5 bg-[#8b7355] text-white">{activeFilterCount}</Badge>
                                    )}
                                </Button>
                                {activeFilterCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500">
                                        <X className="mr-1 h-3.5 w-3.5" /> Limpiar
                                    </Button>
                                )}
                            </div>

                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-2 gap-3 border-t pt-3 md:grid-cols-3 lg:grid-cols-6"
                                >
                                    {[
                                        { label: 'Estado', value: statusFilter, set: setStatusFilter, opts: STATUS_OPTIONS },
                                        { label: 'Tipo', value: typeFilter, set: setTypeFilter, opts: TYPE_OPTIONS },
                                        { label: 'Preparada', value: printedFilter, set: setPrintedFilter, opts: TRISTATE_OPTIONS('Preparadas', 'Sin preparar') },
                                        { label: 'Entregada', value: deliveredFilter, set: setDeliveredFilter, opts: TRISTATE_OPTIONS('Entregadas', 'Sin entregar') },
                                        { label: 'Email', value: sentFilter, set: setSentFilter, opts: TRISTATE_OPTIONS('Enviado', 'Sin enviar') },
                                        { label: 'Acceso', value: accessedFilter, set: setAccessedFilter, opts: TRISTATE_OPTIONS('Han accedido', 'Sin accesos') },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                                                {f.label}
                                            </label>
                                            <select
                                                value={f.value}
                                                onChange={(e) => f.set(e.target.value)}
                                                className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-[#8b7355] focus:outline-none focus:ring-1 focus:ring-[#8b7355]"
                                            >
                                                {f.opts.map((o) => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Groups */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader className="px-5 pb-3 pt-5">
                        <CardTitle>Grupos de Invitación</CardTitle>
                        <CardDescription>
                            {filteredGroups.length} de {groups.length} grupos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                        {filteredGroups.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">
                                {search || activeFilterCount > 0
                                    ? 'No hay grupos que coincidan con los filtros'
                                    : 'No hay grupos creados. ¡Crea el primero!'}
                            </p>
                        ) : (
                            <>
                                {/* Mobile: Cards */}
                                <div className="space-y-3 md:hidden">
                                    {filteredGroups.map((group) => (
                                        <Link
                                            key={group.id}
                                            href={route('admin.groups.show', group.id)}
                                            className="block rounded-lg border bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:border-[#8b7355]/30 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-medium text-gray-900">
                                                        {group.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold">
                                                            {group.code}
                                                        </code>
                                                        <Badge
                                                            variant={group.type === 'FAMILIAR' ? 'default' : 'secondary'}
                                                            className="text-[10px]"
                                                        >
                                                            {group.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="ml-2 flex items-center gap-2">
                                                    {!group.has_submitted ? (
                                                        <Badge variant="outline">Pendiente</Badge>
                                                    ) : group.attending_count > 0 ? (
                                                        <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-700">No viene</Badge>
                                                    )}
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-semibold">{group.guests_count}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <UserCheck className="h-3.5 w-3.5 text-green-500" />
                                                        <span className="font-semibold text-green-600">{group.attending_count}</span>
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); toggleInvitationSent(group); }}
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                                                            group.invitation_sent_at
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                    >
                                                        {group.invitation_sent_at ? '✓ Inv.' : '— Inv.'}
                                                    </button>
                                                    {group.visits_count > 0 ? (
                                                        <span className="flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                                                            {group.last_device === 'mobile'
                                                                ? <Smartphone className="h-3 w-3" />
                                                                : <Monitor className="h-3 w-3" />}
                                                            {group.visits_count}
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                                                            Sin acceso
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-[#8b7355] hover:bg-[#8b7355]/10 hover:text-[#8b7355]"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('admin.groups.edit', group.id));
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem
                                                                onClick={() => adminConfirm(group)}
                                                                className="text-green-700 focus:bg-green-50 focus:text-green-700"
                                                            >
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Confirmar asistencia
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => adminDecline(group)}
                                                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Marcar como rechazado
                                                            </DropdownMenuItem>
                                                            {group.has_submitted && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => adminResetRsvp(group)}
                                                                        className="text-gray-600 focus:bg-gray-50"
                                                                    >
                                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                                        Restablecer a pendiente
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => deleteGroup(group)}
                                                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar grupo
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Desktop: Table */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead><SortHeader label="Nombre del Grupo" column="name" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead><SortHeader label="Código" column="code" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead><SortHeader label="Tipo" column="type" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Personas" column="guests" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Asistirán" column="attending" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Estado" column="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Preparada" column="printed" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Entregada" column="delivered" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Email" column="sent" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-center"><SortHeader label="Accedido" column="accessed" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} /></TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredGroups.map((group) => (
                                                <TableRow key={group.id}>
                                                    <TableCell className="font-medium">
                                                        {group.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-bold">
                                                            {group.code}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                group.type === 'FAMILIAR'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {group.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="font-semibold">
                                                            {group.guests_count}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="font-semibold text-green-600">
                                                            {group.attending_count}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {!group.has_submitted ? (
                                                            <Badge variant="outline">Pendiente</Badge>
                                                        ) : group.attending_count > 0 ? (
                                                            <Badge className="bg-green-100 text-green-700">✓ Confirmado</Badge>
                                                        ) : (
                                                            <Badge className="bg-red-100 text-red-700">✗ No viene</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <TooltipProvider delayDuration={200}>
                                                            <UiTooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => togglePrinted(group)}
                                                                        disabled={isPending(`printed-${group.id}`)}
                                                                        className={`rounded-full px-2 py-1 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${
                                                                            group.printed_at
                                                                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        {isPending(`printed-${group.id}`) ? '…' : group.printed_at
                                                                            ? `✓ ${new Date(group.printed_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
                                                                            : '—'}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {group.printed_at
                                                                        ? `Preparada el ${new Date(group.printed_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} · Clic para desmarcar`
                                                                        : 'Clic para marcar como preparada'}
                                                                </TooltipContent>
                                                            </UiTooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <TooltipProvider delayDuration={200}>
                                                            <UiTooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => toggleDelivered(group)}
                                                                        disabled={isPending(`delivered-${group.id}`)}
                                                                        className={`rounded-full px-2 py-1 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${
                                                                            group.delivered_at
                                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        {isPending(`delivered-${group.id}`) ? '…' : group.delivered_at
                                                                            ? `✓ ${new Date(group.delivered_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
                                                                            : '—'}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {group.delivered_at
                                                                        ? `Entregada el ${new Date(group.delivered_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} · Clic para desmarcar`
                                                                        : 'Clic para marcar como entregada'}
                                                                </TooltipContent>
                                                            </UiTooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <TooltipProvider delayDuration={200}>
                                                            <UiTooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => toggleInvitationSent(group)}
                                                                        disabled={isPending(`sent-${group.id}`)}
                                                                        className={`rounded-full px-2 py-1 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${
                                                                            group.invitation_sent_at
                                                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                                                        }`}
                                                                    >
                                                                        {isPending(`sent-${group.id}`) ? '…' : group.invitation_sent_at ? '✓ Enviada' : '— Pendiente'}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {group.invitation_sent_at
                                                                        ? `Enviada el ${new Date(group.invitation_sent_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} · Clic para desmarcar`
                                                                        : 'Clic para marcar como enviada'}
                                                                </TooltipContent>
                                                            </UiTooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {group.visits_count > 0 ? (
                                                            <TooltipProvider delayDuration={200}>
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="inline-flex cursor-default items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
                                                                            {group.last_device === 'mobile'
                                                                                ? <Smartphone className="h-3 w-3" />
                                                                                : <Monitor className="h-3 w-3" />}
                                                                            {group.visits_count}x
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Primer acceso: {group.first_visited_at ? new Date(group.first_visited_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                                                                        <p>Último acceso: {group.last_visited_at ? new Date(group.last_visited_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                                                                        <p>Dispositivo: {group.last_device}</p>
                                                                    </TooltipContent>
                                                                </UiTooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <TooltipProvider delayDuration={200}>
                                                            <div className="flex justify-end gap-1">
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link href={route('admin.groups.show', group.id)}>
                                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#8b7355] hover:bg-[#8b7355]/10">
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Ver detalle</TooltipContent>
                                                                </UiTooltip>
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link href={route('admin.groups.edit', group.id)}>
                                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#a89584] hover:bg-[#8b7355]/10 hover:text-[#8b7355]">
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Editar</TooltipContent>
                                                                </UiTooltip>
                                                                <DropdownMenu>
                                                                    <UiTooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:bg-gray-100">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Más acciones</TooltipContent>
                                                                    </UiTooltip>
                                                                    <DropdownMenuContent align="end" className="w-48">
                                                                        <DropdownMenuItem
                                                                            onClick={() => adminConfirm(group)}
                                                                            className="text-green-700 focus:bg-green-50 focus:text-green-700"
                                                                        >
                                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                            Confirmar asistencia
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => adminDecline(group)}
                                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                        >
                                                                            <XCircle className="mr-2 h-4 w-4" />
                                                                            Marcar como rechazado
                                                                        </DropdownMenuItem>
                                                                        {group.has_submitted && (
                                                                            <>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem
                                                                                    onClick={() => adminResetRsvp(group)}
                                                                                    className="text-gray-600 focus:bg-gray-50"
                                                                                >
                                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                                    Restablecer a pendiente
                                                                                </DropdownMenuItem>
                                                                            </>
                                                                        )}
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => deleteGroup(group)}
                                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Eliminar grupo
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TooltipProvider>
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
                </motion.div>
            </motion.div>
            {/* Custom message modal */}
            <Dialog open={showCustomModal} onOpenChange={(open) => { if (!open) closeCustomModal(); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Mail className="h-4 w-4" /> Mensaje personalizado</DialogTitle>
                        <DialogDescription>
                            Selecciona los destinatarios y escribe el mensaje.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Quick filters */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">Filtros rápidos</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setSelectedIds(new Set(groups.filter(g => g.contact_email).map(g => g.id)))}
                                >
                                    Todos con email
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setSelectedIds(new Set(groups.filter(g => !g.has_submitted && g.contact_email).map(g => g.id)))}
                                >
                                    Pendientes con email
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setSelectedIds(new Set(groups.filter(g => g.has_submitted && g.contact_email).map(g => g.id)))}
                                >
                                    Confirmados con email
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                                    onClick={() => setSelectedIds(new Set())}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        {/* Group list */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Destinatarios{' '}
                                <span className="text-gray-400">({selectedIds.size} grupo{selectedIds.size !== 1 ? 's' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''})</span>
                            </p>
                            <div className="max-h-44 overflow-y-auto rounded-md border border-gray-200">
                                {groups.map((group) => (
                                    <label
                                        key={group.id}
                                        className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-50 ${!group.contact_email ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            disabled={!group.contact_email}
                                            checked={selectedIds.has(group.id)}
                                            onChange={() => {
                                                setSelectedIds(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(group.id)) {
                                                        next.delete(group.id);
                                                    } else {
                                                        next.add(group.id);
                                                    }
                                                    return next;
                                                });
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 accent-[#8b7355]"
                                        />
                                        <span className="flex-1 text-sm font-medium text-gray-800">{group.name}</span>
                                        {!group.has_submitted ? (
                                            <Badge variant="outline" className="text-xs">Pendiente</Badge>
                                        ) : group.attending_count > 0 ? (
                                            <Badge className="bg-green-100 text-green-700 text-xs">Confirmado</Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 text-xs">No viene</Badge>
                                        )}
                                        {!group.contact_email && (
                                            <span className="text-xs text-gray-400">sin email</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Message form */}
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Asunto</label>
                                <Input
                                    type="text"
                                    placeholder="Asunto del mensaje..."
                                    value={customSubject}
                                    onChange={(e) => setCustomSubject(e.target.value)}
                                    maxLength={200}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mensaje</label>
                                <Textarea
                                    placeholder="Escribe el mensaje aquí..."
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    rows={5}
                                    maxLength={5000}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={closeCustomModal}
                            disabled={sendingCustom}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#8b7355] text-white hover:bg-[#7a6449]"
                            onClick={handleSendCustom}
                            disabled={selectedIds.size === 0 || !customSubject.trim() || !customMessage.trim() || sendingCustom}
                        >
                            {sendingCustom ? 'Enviando…' : <><Mail className="mr-1.5 h-4 w-4 inline" /> Enviar a {selectedIds.size} grupo{selectedIds.size !== 1 ? 's' : ''}</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Push notification modal */}
            <Dialog open={showPushModal} onOpenChange={(open) => { if (!open) closePushModal(); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notificación push</DialogTitle>
                        <DialogDescription>
                            Selecciona los grupos y escribe el mensaje de notificación.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Quick filters */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">Filtros rápidos</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setPushSelectedIds(new Set(groups.map(g => g.id)))}
                                >
                                    Todos los grupos
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setPushSelectedIds(new Set(groups.filter(g => !g.has_submitted).map(g => g.id)))}
                                >
                                    Pendientes
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                                    onClick={() => setPushSelectedIds(new Set(groups.filter(g => g.has_submitted).map(g => g.id)))}
                                >
                                    Confirmados
                                </button>
                                <button
                                    type="button"
                                    className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                                    onClick={() => setPushSelectedIds(new Set())}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        {/* Group list */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Destinatarios{' '}
                                <span className="text-gray-400">({pushSelectedIds.size} grupo{pushSelectedIds.size !== 1 ? 's' : ''} seleccionado{pushSelectedIds.size !== 1 ? 's' : ''})</span>
                            </p>
                            <div className="max-h-44 overflow-y-auto rounded-md border border-gray-200">
                                {groups.map((group) => (
                                    <label
                                        key={group.id}
                                        className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={pushSelectedIds.has(group.id)}
                                            onChange={() => {
                                                setPushSelectedIds(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(group.id)) {
                                                        next.delete(group.id);
                                                    } else {
                                                        next.add(group.id);
                                                    }
                                                    return next;
                                                });
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 accent-[#8b7355]"
                                        />
                                        <span className="flex-1 text-sm font-medium text-gray-800">{group.name}</span>
                                        {!group.has_submitted ? (
                                            <Badge variant="outline" className="text-xs">Pendiente</Badge>
                                        ) : group.attending_count > 0 ? (
                                            <Badge className="bg-green-100 text-green-700 text-xs">Confirmado</Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 text-xs">No viene</Badge>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Push form */}
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                                <Input
                                    type="text"
                                    placeholder="Título de la notificación..."
                                    value={pushTitle}
                                    onChange={(e) => setPushTitle(e.target.value)}
                                    maxLength={100}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mensaje</label>
                                <Textarea
                                    placeholder="Escribe el mensaje aquí..."
                                    value={pushBody}
                                    onChange={(e) => setPushBody(e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={closePushModal}
                            disabled={sendingPush}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#8b7355] text-white hover:bg-[#7a6449]"
                            onClick={handleSendPush}
                            disabled={pushSelectedIds.size === 0 || !pushTitle.trim() || !pushBody.trim() || sendingPush}
                        >
                            {sendingPush ? 'Enviando…' : <><Bell className="mr-1.5 h-4 w-4 inline" /> Enviar push a {pushSelectedIds.size} grupo{pushSelectedIds.size !== 1 ? 's' : ''}</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Generic confirm dialog */}
            <Dialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{confirmDialog?.title}</DialogTitle>
                        <DialogDescription>{confirmDialog?.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancelar</Button>
                        <Button
                            className={confirmDialog?.variant === 'danger'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : confirmDialog?.variant === 'success'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-[#8b7355] text-white hover:bg-[#7a6449]'}
                            onClick={() => { confirmDialog?.onConfirm(); setConfirmDialog(null); }}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reminder confirmation modal */}
            <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Send className="h-4 w-4" /> Enviar recordatorio</DialogTitle>
                        <DialogDescription asChild>
                            <div className="space-y-2 pt-1">
                                <p className="text-sm text-gray-600">
                                    Se enviará un email de recordatorio a{' '}
                                    <strong className="text-[#8b7355]">
                                        {stats.pending_with_email} grupo{stats.pending_with_email !== 1 ? 's' : ''}
                                    </strong>{' '}
                                    pendientes que tienen email de contacto.
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowReminderModal(false)}
                            disabled={sendingReminders}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-[#8b7355] text-white hover:bg-[#7a6449]"
                            onClick={handleSendReminders}
                            disabled={sendingReminders}
                        >
                            {sendingReminders ? 'Enviando…' : <><Mail className="mr-1.5 h-4 w-4 inline" /> Enviar</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
