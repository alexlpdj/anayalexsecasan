import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

export default function GroupsIndex({ groups, stats }) {
    const [search, setSearch] = useState('');

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

    return (
        <AuthenticatedLayout>
            <Head title="Gestión de Grupos" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-7xl space-y-6 p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestión de Grupos
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Organiza a tus invitados por grupos o núcleos familiares
                        </p>
                    </div>
                    <Link href={route('admin.groups.create')}>
                        <Button className="bg-gradient-to-r from-[#8b7355] to-[#a89584] transition-transform hover:scale-105">
                            ✨ Crear Grupo Nuevo
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 + index * 0.05 }}
                                        className={`text-3xl font-bold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardContent className="pt-6">
                            <Input
                                type="text"
                                placeholder="🔍 Buscar por nombre o código..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-md transition-all focus:ring-2 focus:ring-[#8b7355]"
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Groups Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Grupos de Invitación</CardTitle>
                        <CardDescription>
                            {filteredGroups.length} de {groups.length} grupos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGroups.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-gray-500"
                                        >
                                            {search
                                                ? 'No se encontraron grupos'
                                                : 'No hay grupos creados. ¡Crea el primero!'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGroups.map((group) => (
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
                                                {group.has_confirmed ? (
                                                    <Badge className="bg-green-100 text-green-700">
                                                        ✓ Confirmado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Pendiente
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.groups.show',
                                                            group.id
                                                        )}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            👁️ Ver
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            'admin.groups.edit',
                                                            group.id
                                                        )}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            ✏️ Editar
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteGroup(group)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
