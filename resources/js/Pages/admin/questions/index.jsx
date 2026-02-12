import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout>
            <Head title="Preguntas de Invitados" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Preguntas de Invitados
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Dudas y consultas enviadas por los invitados
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Preguntas recibidas</CardTitle>
                        <CardDescription>
                            {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'} en total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-48">Grupo</TableHead>
                                    <TableHead>Pregunta</TableHead>
                                    <TableHead className="w-40 text-right">Fecha</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center text-gray-500"
                                        >
                                            No hay preguntas todavía
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    questions.map((q) => (
                                        <TableRow key={q.id}>
                                            <TableCell className="font-medium">
                                                {q.group_name}
                                            </TableCell>
                                            <TableCell>{q.message}</TableCell>
                                            <TableCell className="text-right text-sm text-gray-500">
                                                {q.created_at}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
