import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function FaqsIndex({ faqs }) {
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Form for creating new FAQ
    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, reset: createReset, errors: createErrors } = useForm({
        question: '',
        answer: '',
        is_active: true,
    });

    // Form for editing FAQ
    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, reset: editReset, errors: editErrors } = useForm({
        question: '',
        answer: '',
        is_active: true,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createPost(route('admin.faqs.store'), {
            onSuccess: () => createReset(),
        });
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        setEditData({
            question: faq.question,
            answer: faq.answer,
            is_active: faq.is_active,
        });
    };

    const handleUpdate = (id) => {
        editPut(route('admin.faqs.update', id), {
            onSuccess: () => {
                setEditingId(null);
                editReset();
            },
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        editReset();
    };

    const handleToggle = (id) => {
        router.post(route('admin.faqs.toggle', id));
    };

    const confirmDelete = (id) => {
        router.delete(route('admin.faqs.destroy', id), {
            onSuccess: () => setDeleteId(null),
        });
    };

    const moveUp = (faq, index) => {
        if (index === 0) return;
        const prev = faqs[index - 1];
        updateOrder([
            { id: faq.id, order: prev.order },
            { id: prev.id, order: faq.order },
        ]);
    };

    const moveDown = (faq, index) => {
        if (index === faqs.length - 1) return;
        const next = faqs[index + 1];
        updateOrder([
            { id: faq.id, order: next.order },
            { id: next.id, order: faq.order },
        ]);
    };

    const updateOrder = (items) => {
        router.post(route('admin.faqs.update-order'), {
            faqs: items,
        });
    };

    const activeFaqs = faqs.filter((f) => f.is_active).length;

    return (
        <AdminSidebarLayout>
            <Head title="Gestión de FAQs" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-6 sm:p-6"
            >
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas Frecuentes</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Gestiona las FAQs que verán tus invitados
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                        { label: 'Total FAQs', value: faqs.length, color: 'text-gray-900' },
                        { label: 'FAQs Activas', value: activeFaqs, color: 'text-green-600' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
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
                                        transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
                                        className={`text-3xl font-bold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Create Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Añadir Nueva FAQ</CardTitle>
                            <CardDescription>Crea una nueva pregunta frecuente</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="create-question">Pregunta</Label>
                                    <Input
                                        id="create-question"
                                        value={createData.question}
                                        onChange={(e) => setCreateData('question', e.target.value)}
                                        placeholder="¿Cuál es el código de vestimenta?"
                                        required
                                    />
                                    {createErrors.question && (
                                        <p className="text-sm text-red-600">{createErrors.question}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Estado Inicial</Label>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={createData.is_active}
                                                onCheckedChange={(checked) =>
                                                    setCreateData('is_active', checked)
                                                }
                                            />
                                            <span className="text-sm">
                                                {createData.is_active ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-answer">Respuesta</Label>
                                <Textarea
                                    id="create-answer"
                                    value={createData.answer}
                                    onChange={(e) => setCreateData('answer', e.target.value)}
                                    placeholder="Etiqueta formal..."
                                    rows={3}
                                    required
                                />
                                {createErrors.answer && (
                                    <p className="text-sm text-red-600">{createErrors.answer}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="bg-gradient-to-r from-[#8b7355] to-[#a89584] transition-all hover:scale-105 hover:opacity-90"
                            >
                                {createProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            ⏳
                                        </motion.span>
                                        Añadiendo...
                                    </span>
                                ) : (
                                    '➕ Añadir FAQ'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                </motion.div>

                {/* FAQs List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Lista de FAQs</CardTitle>
                            <CardDescription>
                                {faqs.length} preguntas · Click para editar
                            </CardDescription>
                        </CardHeader>
                    <CardContent>
                        {faqs.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-500">
                                No hay FAQs. Añade la primera arriba.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Pregunta</TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Respuesta
                                            </TableHead>
                                            <TableHead className="w-24">Estado</TableHead>
                                            <TableHead className="w-40 text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faqs.map((faq, index) => (
                                            <TableRow key={faq.id}>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveUp(faq, index)}
                                                            disabled={index === 0}
                                                            className="h-6 px-2"
                                                        >
                                                            ↑
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => moveDown(faq, index)}
                                                            disabled={index === faqs.length - 1}
                                                            className="h-6 px-2"
                                                        >
                                                            ↓
                                                        </Button>
                                                    </div>
                                                </TableCell>

                                                {editingId === faq.id ? (
                                                    <>
                                                        <TableCell colSpan={2}>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    value={editData.question}
                                                                    onChange={(e) =>
                                                                        setEditData('question', e.target.value)
                                                                    }
                                                                />
                                                                <Textarea
                                                                    value={editData.answer}
                                                                    onChange={(e) =>
                                                                        setEditData('answer', e.target.value)
                                                                    }
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={editData.is_active}
                                                                onCheckedChange={(checked) =>
                                                                    setEditData('is_active', checked)
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdate(faq.id)}
                                                                    disabled={editProcessing}
                                                                    className="transition-transform hover:scale-110"
                                                                >
                                                                    {editProcessing ? (
                                                                        <motion.span
                                                                            animate={{ rotate: 360 }}
                                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                        >
                                                                            ⏳
                                                                        </motion.span>
                                                                    ) : (
                                                                        '💾'
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={cancelEdit}
                                                                >
                                                                    ✖️
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell className="font-medium">
                                                            {faq.question}
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <div className="max-w-md truncate text-sm text-gray-600">
                                                                {faq.answer}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    faq.is_active ? 'default' : 'secondary'
                                                                }
                                                                className={
                                                                    faq.is_active
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }
                                                            >
                                                                {faq.is_active ? 'Activa' : 'Inactiva'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => handleToggle(faq.id)}
                                                                    title="Activar/Desactivar"
                                                                >
                                                                    {faq.is_active ? '👁️' : '👁️‍🗨️'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => startEdit(faq)}
                                                                >
                                                                    ✏️
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => setDeleteId(faq.id)}
                                                                >
                                                                    🗑️
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                </motion.div>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La FAQ se eliminará permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmDelete(deleteId)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminSidebarLayout>
    );
}
