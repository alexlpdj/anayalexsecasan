import { Head } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
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

export default function QuestionsIndex({ questions }) {
    return (
        <AdminSidebarLayout>
            <Head title="Preguntas de Invitados" />

            <div className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-6 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Preguntas de Invitados
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Dudas y consultas enviadas por los invitados
                    </p>
                </div>

                <Card>
                    <CardHeader className="p-3 sm:p-6">
                        <CardTitle>Preguntas recibidas</CardTitle>
                        <CardDescription>
                            {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'} en total
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        {questions.length === 0 ? (
                            <p className="py-8 text-center text-gray-500">
                                No hay preguntas todavía
                            </p>
                        ) : (
                            <>
                                {/* Mobile: Cards */}
                                <div className="space-y-3 md:hidden">
                                    {questions.map((q) => (
                                        <div
                                            key={q.id}
                                            className="rounded-lg border bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="rounded bg-[#8b7355]/10 px-2 py-0.5 text-xs font-medium text-[#8b7355]">
                                                    {q.group_name}
                                                </span>
                                                <span className="flex-shrink-0 text-xs text-gray-400">
                                                    {q.created_at}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-700">
                                                {q.message}
                                            </p>
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
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q) => (
                                                <TableRow key={q.id}>
                                                    <TableCell className="font-medium">
                                                        {q.group_name}
                                                    </TableCell>
                                                    <TableCell>{q.message}</TableCell>
                                                    <TableCell className="text-right text-sm text-gray-500">
                                                        {q.created_at}
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
        </AdminSidebarLayout>
    );
}
