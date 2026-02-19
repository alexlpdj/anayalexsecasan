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
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Pencil, Trash2, Plus, Search, Users, UserCheck, ChevronRight } from 'lucide-react';
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

export default function GroupsIndex({ groups, stats, chartData }) {
    const [search, setSearch] = useState('');
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [sendingReminders, setSendingReminders] = useState(false);

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.code.toLowerCase().includes(search.toLowerCase())
    );

    const deleteGroup = (group) => {
        if (
            confirm(
                `¿Eliminar el grupo "${group.name}" y todos sus invitados (${group.guests_count})?`
            )
        ) {
            router.delete(route('admin.groups.destroy', group.id));
        }
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
                className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-6 sm:p-6"
            >
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Gestión de Grupos
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Organiza a tus invitados por grupos o núcleos familiares
                        </p>
                    </div>
                    <div className="flex w-full gap-2 sm:w-auto">
                        {stats.pending_with_email > 0 && (
                            <Button
                                variant="outline"
                                className="flex-1 border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10 sm:flex-none"
                                onClick={() => setShowReminderModal(true)}
                            >
                                📨 Enviar recordatorio a pendientes
                            </Button>
                        )}
                        <Link href={route('admin.groups.create')} className="flex-1 sm:flex-none">
                            <Button className="w-full bg-gradient-to-r from-[#8b7355] to-[#a89584] transition-transform hover:scale-105 sm:w-auto">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Crear Grupo Nuevo
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 sm:gap-4">
                    {[
                        { label: 'Total Grupos', value: stats.total_groups, color: 'text-[#8b7355]' },
                        { label: 'Confirmados', value: stats.confirmed_groups, color: 'text-green-600' },
                        { label: 'Pendientes', value: stats.pending_groups, color: 'text-gray-600' },
                        { label: 'Total Personas', value: stats.total_guests, color: 'text-[#8b7355]' },
                        { label: 'Asistirán', value: stats.attending_guests, color: 'text-green-600' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                        >
                            <Card className="transition-all hover:scale-105 hover:shadow-lg">
                                <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-600 sm:text-sm">
                                        {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 + index * 0.05 }}
                                        className={`text-2xl font-bold sm:text-3xl ${stat.color}`}
                                    >
                                        {stat.value}
                                    </motion.div>
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
                            <CardHeader className="p-3 pb-0 sm:p-6 sm:pb-0">
                                <CardTitle className="text-sm font-medium text-gray-600">Asistencia</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6">
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
                            <CardHeader className="p-3 pb-0 sm:p-6 sm:pb-0">
                                <CardTitle className="text-sm font-medium text-gray-600">Transporte</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6">
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
                                            width={100}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <Tooltip formatter={(value) => [`${value} grupos`]} />
                                        <Bar dataKey="value" fill="#8b7355" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Donut: Tipos */}
                        <Card className="transition-shadow hover:shadow-lg">
                            <CardHeader className="p-3 pb-0 sm:p-6 sm:pb-0">
                                <CardTitle className="text-sm font-medium text-gray-600">Tipos de Grupo</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6">
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

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardContent className="p-3 sm:pt-6">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por nombre o código..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 transition-all focus:ring-2 focus:ring-[#8b7355]"
                                />
                            </div>
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
                    <CardHeader className="p-3 sm:p-6">
                        <CardTitle>Grupos de Invitación</CardTitle>
                        <CardDescription>
                            {filteredGroups.length} de {groups.length} grupos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        {filteredGroups.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">
                                {search
                                    ? 'No se encontraron grupos'
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
                                                    {group.has_submitted ? (
                                                        <Badge className="bg-green-100 text-green-700">
                                                            Confirmado
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Pendiente
                                                        </Badge>
                                                    )}
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-semibold">{group.guests_count}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <UserCheck className="h-3.5 w-3.5 text-green-500" />
                                                        <span className="font-semibold text-green-600">{group.attending_count}</span>
                                                    </span>
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
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            deleteGroup(group);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                                <TableHead>Nombre del Grupo</TableHead>
                                                <TableHead>Código</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead className="text-center">
                                                    Personas
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Asistirán
                                                </TableHead>
                                                <TableHead className="text-center">Estado</TableHead>
                                                <TableHead className="text-center">Email</TableHead>
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
                                                        {group.has_submitted ? (
                                                            <Badge className="bg-green-100 text-green-700">
                                                                ✓ Confirmado
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                Pendiente
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <TooltipProvider delayDuration={200}>
                                                            <UiTooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span className="cursor-default text-base leading-none">
                                                                        {group.invitation_sent_at
                                                                            ? '📧'
                                                                            : group.contact_email
                                                                                ? <span className="text-gray-400">📧</span>
                                                                                : <span className="text-gray-300">—</span>
                                                                        }
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {group.invitation_sent_at
                                                                        ? `Invitación enviada el ${new Date(group.invitation_sent_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                                                        : group.contact_email
                                                                            ? 'Tiene email, sin contactar'
                                                                            : 'Sin email'}
                                                                </TooltipContent>
                                                            </UiTooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <TooltipProvider delayDuration={200}>
                                                            <div className="flex justify-end gap-1">
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link href={route('admin.groups.show', group.id)}>
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                className="h-8 w-8 text-[#8b7355] hover:bg-[#8b7355]/10 hover:text-[#8b7355]"
                                                                            >
                                                                                <Eye className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Ver detalle</TooltipContent>
                                                                </UiTooltip>
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link href={route('admin.groups.edit', group.id)}>
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                className="h-8 w-8 text-[#a89584] hover:bg-[#8b7355]/10 hover:text-[#8b7355]"
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Editar</TooltipContent>
                                                                </UiTooltip>
                                                                <UiTooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
                                                                            onClick={() => deleteGroup(group)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Eliminar</TooltipContent>
                                                                </UiTooltip>
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
            {/* Reminder confirmation modal */}
            <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>📨 Enviar recordatorio</DialogTitle>
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
                            {sendingReminders ? 'Enviando…' : 'Enviar ✉️'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
