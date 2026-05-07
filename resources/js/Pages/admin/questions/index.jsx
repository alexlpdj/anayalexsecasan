import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const OPTS = { preserveScroll: true, preserveState: true, only: ['questions', 'flash'] };

export default function QuestionsIndex({ questions }) {
    const [confirmId, setConfirmId] = useState(null);

    const confirmDelete = (id) => setConfirmId(id);
    const doDelete = () => {
        router.delete(route('admin.questions.destroy', confirmId), OPTS);
        setConfirmId(null);
    };

    return (
        <AdminSidebarLayout>
            <Head title="Preguntas de Invitados" />

            <div className="mx-auto max-w-7xl space-y-5 p-4 pb-24 sm:p-6 lg:pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas de Invitados</h1>
                    <p className="mt-1 text-sm text-gray-600">Dudas y consultas enviadas por los invitados</p>
                </div>

                <Card>
                    <CardHeader className="px-5 pb-3 pt-5">
                        <CardTitle>Preguntas recibidas</CardTitle>
                        <CardDescription>
                            {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'} en total
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-0">
                        {questions.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">No hay preguntas todavía</p>
                        ) : (
                            <>
                                {/* Mobile: Cards */}
                                <div className="space-y-3 md:hidden">
                                    {questions.map((q) => (
                                        <div key={q.id} className="rounded-lg border bg-white p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="rounded bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                                    {q.group_name}
                                                </span>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="text-xs text-gray-400">{q.created_at}</span>
                                                    <button
                                                        onClick={() => confirmDelete(q.id)}
                                                        className="rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-700">{q.message}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: Table */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-48">Grupo</TableHead>
                                                <TableHead>Pregunta</TableHead>
                                                <TableHead className="w-40 text-right">Fecha</TableHead>
                                                <TableHead className="w-12" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q) => (
                                                <TableRow key={q.id}>
                                                    <TableCell className="font-medium">{q.group_name}</TableCell>
                                                    <TableCell>{q.message}</TableCell>
                                                    <TableCell className="text-right text-sm text-gray-500">{q.created_at}</TableCell>
                                                    <TableCell>
                                                        <button
                                                            onClick={() => confirmDelete(q.id)}
                                                            className="rounded p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
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
            </div>

            <Dialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Eliminar pregunta</DialogTitle>
                        <DialogDescription>¿Eliminar esta pregunta? No se puede deshacer.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setConfirmId(null)}>Cancelar</Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={doDelete}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
