import { Head, Link, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Gift as GiftIcon, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (n) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n ?? 0);

const TYPE_BADGE = {
    cash: 'bg-emerald-100 text-emerald-700',
    transfer: 'bg-sky-100 text-sky-700',
    physical: 'bg-amber-100 text-amber-700',
    direct_payment: 'bg-purple-100 text-purple-700',
};

const STATUS_BADGE = {
    received: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-gray-100 text-gray-600',
};

const emptyForm = {
    id: null,
    guest_id: '',
    display_name: '',
    amount: '',
    type: 'cash',
    status: 'received',
    received_at: '',
    notes: '',
};

export default function GiftsIndex({ gifts, guests, totals, types, statuses }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [processing, setProcessing] = useState(false);

    const typeLabel = useMemo(
        () => Object.fromEntries(types.map((t) => [t.value, t.label])),
        [types],
    );
    const statusLabel = useMemo(
        () => Object.fromEntries(statuses.map((s) => [s.value, s.label])),
        [statuses],
    );

    const openCreate = () => {
        setForm({ ...emptyForm, received_at: new Date().toISOString().slice(0, 10) });
        setDialogOpen(true);
    };

    const openEdit = (gift) => {
        setForm({
            id: gift.id,
            guest_id: gift.guest_id ?? '',
            display_name: gift.display_name,
            amount: gift.amount ?? '',
            type: gift.type,
            status: gift.status,
            received_at: gift.received_at ? String(gift.received_at).slice(0, 10) : '',
            notes: gift.notes ?? '',
        });
        setDialogOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.display_name.trim()) return;

        const payload = {
            guest_id: form.guest_id || null,
            display_name: form.display_name.trim(),
            amount: form.amount === '' ? null : Number(form.amount),
            type: form.type,
            status: form.status,
            received_at: form.received_at || null,
            notes: form.notes?.trim() || null,
        };

        setProcessing(true);
        const opts = {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => setDialogOpen(false),
        };

        if (form.id) {
            router.patch(route('admin.gifts.update', form.id), payload, opts);
        } else {
            router.post(route('admin.gifts.store'), payload, opts);
        }
    };

    const remove = (gift) => {
        if (!confirm(`¿Eliminar el regalo de "${gift.display_name}"?`)) return;
        router.delete(route('admin.gifts.destroy', gift.id), { preserveScroll: true });
    };

    const onGuestChange = (value) => {
        const id = value === '__none__' ? '' : value;
        const guest = guests.find((g) => String(g.id) === String(id));
        setForm((p) => ({
            ...p,
            guest_id: id,
            display_name: guest && !p.display_name.trim() ? guest.name : p.display_name,
        }));
    };

    const overBudget = totals.budget_target > 0 && totals.received < totals.budget_spent;
    const coveragePct = totals.coverage_pct;

    return (
        <AdminSidebarLayout>
            <Head title="Regalos" />

            <div className="mx-auto max-w-7xl space-y-5 p-4 pb-24 sm:p-6 lg:pb-8">

                {/* Cabecera */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Regalos</h1>
                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                            Control de regalos recibidos de los invitados
                        </p>
                    </div>
                    <Button
                        onClick={openCreate}
                        style={{ backgroundColor: '#8b7355' }}
                        className="gap-1.5 text-white hover:opacity-90 sm:gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden xs:inline">Añadir regalo</span>
                        <span className="xs:hidden">Añadir</span>
                    </Button>
                </div>

                {/* Cards resumen */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Recibido</p>
                            <p className="mt-1 text-2xl font-bold leading-tight" style={{ color: '#8b7355' }}>
                                {fmt(totals.received)}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">{totals.count} regalos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Pendiente</p>
                            <p className="mt-1 text-2xl font-bold leading-tight text-gray-700">
                                {fmt(totals.pending)}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">prometido sin recibir</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Gastado</p>
                            <p className="mt-1 text-2xl font-bold leading-tight text-gray-700">
                                {fmt(totals.budget_spent)}
                            </p>
                            <Link
                                href={route('admin.budget.index')}
                                className="mt-0.5 text-xs text-[#8b7355] underline-offset-2 hover:underline"
                            >
                                Ver presupuesto →
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Neto</p>
                            <p
                                className="mt-1 text-2xl font-bold leading-tight"
                                style={{ color: overBudget ? '#dc2626' : '#15803d' }}
                            >
                                {fmt(totals.net)}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {overBudget ? 'gastado − recibido' : 'recibido − gastado'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Cobertura del presupuesto */}
                {totals.budget_target > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                                <span>
                                    Cubre <span className="font-semibold text-gray-800">{coveragePct}%</span>{' '}
                                    del objetivo de presupuesto ({fmt(totals.budget_target)})
                                </span>
                                <span className="font-medium text-gray-700">
                                    {fmt(totals.received)} / {fmt(totals.budget_target)}
                                </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${coveragePct}%`,
                                        backgroundColor: coveragePct >= 100 ? '#15803d' : '#8b7355',
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabla */}
                <Card>
                    <CardContent className="p-0">
                        {gifts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <GiftIcon className="mb-3 h-12 w-12 text-gray-200" />
                                <p className="font-medium text-gray-500">Sin regalos todavía</p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Pulsa «Añadir regalo» para empezar
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invitado / Origen</TableHead>
                                        <TableHead className="text-right">Importe</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Notas</TableHead>
                                        <TableHead className="w-24 text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gifts.map((gift) => (
                                        <TableRow key={gift.id}>
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{gift.display_name}</div>
                                                {gift.guest && gift.guest.name !== gift.display_name && (
                                                    <div className="text-xs text-gray-400">
                                                        ↳ {gift.guest.name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {gift.amount != null ? fmt(Number(gift.amount)) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                                                        TYPE_BADGE[gift.type] ?? 'bg-gray-100 text-gray-700',
                                                    )}
                                                >
                                                    {typeLabel[gift.type] ?? gift.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                                                        STATUS_BADGE[gift.status] ?? 'bg-gray-100 text-gray-700',
                                                    )}
                                                >
                                                    {statusLabel[gift.status] ?? gift.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500">
                                                {gift.received_at
                                                    ? new Date(gift.received_at).toLocaleDateString('es-ES')
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-xs text-gray-500">
                                                {gift.notes || ''}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEdit(gift)}
                                                        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#8b7355]"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => remove(gift)}
                                                        className="rounded p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog crear / editar */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{form.id ? 'Editar regalo' : 'Añadir regalo'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-3 pt-1">
                        <div>
                            <Label>Invitado (opcional)</Label>
                            <Select
                                value={form.guest_id ? String(form.guest_id) : '__none__'}
                                onValueChange={onGuestChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sin invitado" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    <SelectItem value="__none__">— Sin invitado —</SelectItem>
                                    {guests.map((g) => (
                                        <SelectItem key={g.id} value={String(g.id)}>
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Nombre / Origen</Label>
                            <Input
                                value={form.display_name}
                                onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))}
                                placeholder="Ej: Merche & Víctor"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Importe (€)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.amount}
                                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                                    placeholder="Vacío si no es monetario"
                                />
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <Input
                                    type="date"
                                    value={form.received_at}
                                    onChange={(e) => setForm((p) => ({ ...p, received_at: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>Tipo</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {types.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Notas</Label>
                            <Textarea
                                value={form.notes}
                                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                rows={2}
                                placeholder="Ej: Reponer 50, pago directo Rio Quente…"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !form.display_name.trim()}
                                style={{ backgroundColor: '#8b7355' }}
                                className="text-white hover:opacity-90"
                            >
                                {form.id ? 'Guardar cambios' : 'Añadir regalo'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}
