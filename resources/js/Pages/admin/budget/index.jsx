import { Head, router } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Plus, Trash2, Building2, UtensilsCrossed, Music2, Camera, Flower2,
    Sparkles, Mail, Plane, MoreHorizontal, Pencil, Check, X,
    ChevronDown, ChevronUp, Calculator, Bus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Configuración ────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'venue',       label: 'Lugar y ceremonia',       color: '#8b7355', icon: Building2 },
    { id: 'catering',    label: 'Catering y banquete',     color: '#c4793a', icon: UtensilsCrossed },
    { id: 'music',       label: 'Música',                  color: '#5a8a5a', icon: Music2 },
    { id: 'photo',       label: 'Fotografía y vídeo',      color: '#4a6fa8', icon: Camera },
    { id: 'flowers',     label: 'Flores y decoración',     color: '#8a5a8a', icon: Flower2 },
    { id: 'attire',      label: 'Vestimenta y arreglos',   color: '#a07848', icon: Sparkles },
    { id: 'invitations', label: 'Invitaciones',            color: '#4a8a8a', icon: Mail },
    { id: 'transport',   label: 'Autobuses y desplazam.',  color: '#3a7a8a', icon: Bus },
    { id: 'honeymoon',   label: 'Luna de miel',            color: '#8a4a5a', icon: Plane },
    { id: 'other',       label: 'Otros gastos',            color: '#7a7a7a', icon: MoreHorizontal },
];

const PRESETS = [
    { name: 'Ceremonia',       category: 'venue',       defaultVal: 500,   max: 3000 },
    { name: 'Catering (banquete)',       category: 'catering',    defaultVal: 15000, max: 60000 },
    { name: 'Tarta',            category: 'catering',    defaultVal: 500,   max: 3000 },
    { name: 'Cóctel y aperitivo',       category: 'catering',    defaultVal: 2000,  max: 8000 },
    { name: 'DJ y iluminación',                        category: 'music',       defaultVal: 1500,  max: 6000 },
    { name: 'Fotógrafo',                 category: 'photo',       defaultVal: 2500,  max: 8000 },
    { name: 'Flores y decoración',       category: 'flowers',     defaultVal: 2000,  max: 10000 },
    { name: 'Vestido de novia',          category: 'attire',      defaultVal: 1500,  max: 8000 },
    { name: 'Traje de novio',            category: 'attire',      defaultVal: 600,   max: 3000 },
    { name: 'Peluquería y maquillaje',   category: 'attire',      defaultVal: 400,   max: 2000 },
    { name: 'Alianzas',                  category: 'attire',      defaultVal: 1000,  max: 5000 },
    { name: 'Invitaciones y papelería',  category: 'invitations', defaultVal: 500,   max: 3000 },
    { name: 'Autobús desde Onda',        category: 'transport',   defaultVal: 800,   max: 4000 },
    { name: 'Autobús desde Castellón',   category: 'transport',   defaultVal: 800,   max: 4000 },
    { name: 'Alquiler de coches',        category: 'transport',   defaultVal: 400,   max: 2000 },
    { name: 'Vuelos luna de miel',        category: 'honeymoon',   defaultVal: 1200,  max: 8000 },
    { name: 'Hotel / alojamiento',       category: 'honeymoon',   defaultVal: 1500,  max: 10000 },
    { name: 'Actividades y excursiones', category: 'honeymoon',   defaultVal: 500,   max: 3000 },
    { name: 'Restaurantes y cenas',      category: 'honeymoon',   defaultVal: 400,   max: 2000 },
    { name: 'Traslados y transporte',    category: 'honeymoon',   defaultVal: 200,   max: 1000 },
    { name: 'Seguro de viaje',           category: 'honeymoon',   defaultVal: 150,   max: 500 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const getCat = (id) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

// ─── Componente principal ────────────────────────────────────────────────────

export default function BudgetIndex({ items, target: serverTarget }) {
    // ── UI optimista: valores de items ───────────────────────────────────────
    // Guarda overrides locales { [id]: number }.
    // getValue() usa el override si existe, si no el valor del servidor.
    // Al confirmar (onValueCommit / edición manual):
    //   1. Aplica override optimista inmediatamente
    //   2. Envía PATCH al servidor
    //   3. onSuccess → limpia override (los props de Inertia toman el relevo)
    //   4. onError   → revierte override al valor original del servidor
    const [optimistic, setOptimistic] = useState({});

    const getValue = (item) => optimistic[item.id] ?? item.value;

    const applyOptimistic = (id, value) =>
        setOptimistic((prev) => ({ ...prev, [id]: value }));

    const clearOptimistic = (id) =>
        setOptimistic((prev) => { const n = { ...prev }; delete n[id]; return n; });

    const revertOptimistic = (id, original) =>
        setOptimistic((prev) => ({ ...prev, [id]: original }));

    // ── UI optimista: presupuesto objetivo ───────────────────────────────────
    const [localTarget, setLocalTarget] = useState(serverTarget);

    // ── Estado de UI ─────────────────────────────────────────────────────────
    const [addOpen, setAddOpen]             = useState(false);
    const [filterCat, setFilterCat]         = useState(null);
    const [showCustom, setShowCustom]       = useState(false);
    const [customForm, setCustomForm]       = useState({ name: '', category: 'venue', defaultVal: 1000, max: 10000 });
    const [collapsedCats, setCollapsedCats] = useState({});
    const [editingBudget, setEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput]     = useState('');

    // ── Totales ──────────────────────────────────────────────────────────────
    const total      = items.reduce((s, i) => s + getValue(i), 0);
    const remaining  = localTarget - total;
    const overBudget = remaining < 0;
    const pct        = localTarget > 0 ? Math.min(100, Math.round((total / localTarget) * 100)) : 0;

    const itemsByCategory = CATEGORIES
        .map((cat) => ({ ...cat, items: items.filter((i) => i.category === cat.id) }))
        .filter((cat) => cat.items.length > 0);

    const pieData = itemsByCategory
        .map((cat) => ({
            name:  cat.label,
            value: cat.items.reduce((s, i) => s + getValue(i), 0),
            color: cat.color,
        }))
        .filter((d) => d.value > 0);

    // ── Acciones de items ────────────────────────────────────────────────────

    const addPreset = (preset) => {
        router.post(route('admin.budget.items.store'), {
            name: preset.name, category: preset.category,
            value: preset.defaultVal, max: preset.max,
        }, { preserveScroll: true });
        setAddOpen(false);
    };

    const addCustom = () => {
        if (!customForm.name.trim()) return;
        router.post(route('admin.budget.items.store'), {
            name: customForm.name.trim(), category: customForm.category,
            value: customForm.defaultVal, max: customForm.max,
        }, { preserveScroll: true });
        setCustomForm({ name: '', category: 'venue', defaultVal: 1000, max: 10000 });
        setShowCustom(false);
        setAddOpen(false);
    };

    const removeItem = (id) =>
        router.delete(route('admin.budget.items.destroy', id), { preserveScroll: true });

    // Mientras arrastra → solo override local (sin petición al servidor)
    const onSliderChange = (id, value) => applyOptimistic(id, value);

    // Al soltar → commit optimista + petición; revertir si falla
    const onSliderCommit = (id, value) => {
        const original = items.find((i) => i.id === id)?.value ?? value;
        applyOptimistic(id, value);
        router.patch(route('admin.budget.items.update', id), { value }, {
            preserveScroll: true,
            onSuccess: () => clearOptimistic(id),
            onError:   () => revertOptimistic(id, original),
        });
    };

    // ── Presupuesto objetivo ─────────────────────────────────────────────────

    const saveTarget = (value) => {
        const original = localTarget;
        setLocalTarget(value);   // optimista
        router.patch(route('admin.budget.target.update'), { target: value }, {
            preserveScroll: true,
            onError: () => setLocalTarget(original),   // revertir
        });
    };

    // ── Misc ─────────────────────────────────────────────────────────────────

    const toggleCat = (catId) =>
        setCollapsedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));

    const addedNames      = new Set(items.map((i) => i.name));
    const filteredPresets = PRESETS.filter(
        (p) => !addedNames.has(p.name) && (!filterCat || p.category === filterCat),
    );

    // ── Render ────────────────────────────────────────────────────────────────

    // Componente reutilizable del editor de objetivo
    const TargetEditor = ({ compact = false }) => editingBudget ? (
        <div className="flex items-center gap-1">
            <Input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className={cn('text-right', compact ? 'h-6 w-24 text-xs' : 'h-7 w-28 text-sm')}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter')  { saveTarget(Number(budgetInput)); setEditingBudget(false); }
                    if (e.key === 'Escape') { setEditingBudget(false); }
                }}
            />
            <button onClick={() => { saveTarget(Number(budgetInput)); setEditingBudget(false); }} className="text-green-600 hover:text-green-800">
                <Check className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </button>
            <button onClick={() => setEditingBudget(false)} className="text-gray-400 hover:text-gray-600">
                <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </button>
        </div>
    ) : (
        <button
            onClick={() => { setBudgetInput(String(localTarget)); setEditingBudget(true); }}
            className={cn(
                'group flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900',
                compact ? 'text-sm' : 'text-xl',
            )}
        >
            {fmt(localTarget)}
            <Pencil className={cn('text-gray-400 opacity-0 transition-opacity group-hover:opacity-100', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
        </button>
    );

    // Barra de progreso reutilizable
    const ProgressBar = () => (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                <span>{pct}% del presupuesto</span>
                <span className={cn('font-medium', overBudget && 'font-bold text-red-600')}>
                    {overBudget
                        ? `+${fmt(Math.abs(remaining))} sobre presupuesto`
                        : `${fmt(remaining)} disponibles`}
                </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${pct}%`,
                        backgroundColor: overBudget ? '#dc2626' : pct > 85 ? '#f59e0b' : '#8b7355',
                    }}
                />
            </div>
        </div>
    );

    return (
        <AdminSidebarLayout>
            <Head title="Presupuesto" />

            <div className="mx-auto max-w-7xl space-y-3 p-3 sm:space-y-5 sm:p-6">

                {/* ── Cabecera ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Presupuesto</h1>
                        <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">Calculadora de costes de la boda</p>
                    </div>
                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button style={{ backgroundColor: '#8b7355' }} className="gap-1.5 text-white hover:opacity-90 sm:gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="hidden xs:inline">Agregar gasto</span>
                                <span className="xs:hidden">Agregar</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Agregar gasto</DialogTitle>
                            </DialogHeader>

                            {/* Chips de categoría */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                <CategoryChip active={!filterCat} color="#8b7355" onClick={() => setFilterCat(null)}>
                                    Todos
                                </CategoryChip>
                                {CATEGORIES.map((cat) => (
                                    <CategoryChip
                                        key={cat.id}
                                        active={filterCat === cat.id}
                                        color={cat.color}
                                        onClick={() => setFilterCat(cat.id === filterCat ? null : cat.id)}
                                    >
                                        {cat.label}
                                    </CategoryChip>
                                ))}
                            </div>

                            {/* Grid de presets */}
                            {filteredPresets.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {filteredPresets.map((preset) => {
                                        const cat  = getCat(preset.category);
                                        const Icon = cat.icon;
                                        return (
                                            <button
                                                key={preset.name}
                                                onClick={() => addPreset(preset)}
                                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm transition-all hover:border-[#8b7355] hover:shadow-sm active:scale-95"
                                            >
                                                <span
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: cat.color + '22', color: cat.color }}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-gray-900">{preset.name}</p>
                                                    <p className="text-xs text-gray-400">{fmt(preset.defaultVal)}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="py-6 text-center text-sm text-gray-400">
                                    Ya has agregado todos los gastos de esta categoría
                                </p>
                            )}

                            {/* Gasto personalizado */}
                            <div className="border-t pt-3">
                                <button
                                    onClick={() => setShowCustom(!showCustom)}
                                    className="flex w-full items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    <Plus className="h-4 w-4" />
                                    Gasto personalizado
                                    {showCustom
                                        ? <ChevronUp className="ml-auto h-4 w-4" />
                                        : <ChevronDown className="ml-auto h-4 w-4" />}
                                </button>

                                {showCustom && (
                                    <div className="mt-3 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <Label>Nombre</Label>
                                                <Input
                                                    value={customForm.name}
                                                    onChange={(e) => setCustomForm((p) => ({ ...p, name: e.target.value }))}
                                                    placeholder="Ej: Cohetes y fuegos artificiales"
                                                />
                                            </div>
                                            <div>
                                                <Label>Categoría</Label>
                                                <Select
                                                    value={customForm.category}
                                                    onValueChange={(v) => setCustomForm((p) => ({ ...p, category: v }))}
                                                >
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Máximo (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={customForm.max}
                                                    onChange={(e) => setCustomForm((p) => ({ ...p, max: Number(e.target.value) }))}
                                                    min={100}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label>Valor inicial: <span className="font-semibold">{fmt(customForm.defaultVal)}</span></Label>
                                                <Slider
                                                    value={[customForm.defaultVal]}
                                                    onValueChange={([v]) => setCustomForm((p) => ({ ...p, defaultVal: v }))}
                                                    min={0}
                                                    max={customForm.max}
                                                    step={100}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            onClick={addCustom}
                                            disabled={!customForm.name.trim()}
                                            style={{ backgroundColor: '#8b7355' }}
                                            className="w-full text-white hover:opacity-90"
                                        >
                                            Agregar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ── Resumen MOBILE: stats + donut full-width + barra (oculto en lg) ─ */}
                <Card className="lg:hidden">
                    <CardContent className="p-4">
                        {/* Stats en fila */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Total</p>
                                <p className="text-2xl font-bold leading-tight" style={{ color: overBudget ? '#dc2626' : '#8b7355' }}>
                                    {fmt(total)}
                                </p>
                                <p className={cn('mt-0.5 text-xs', overBudget ? 'font-semibold text-red-600' : 'text-gray-500')}>
                                    {overBudget
                                        ? `+${fmt(Math.abs(remaining))} sobre el objetivo`
                                        : `${fmt(remaining)} disponibles`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Objetivo</p>
                                <div className="mt-0.5">
                                    <TargetEditor compact />
                                </div>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="mt-3">
                            <ProgressBar />
                        </div>

                        {/* Donut full-width */}
                        {pieData.length > 0 ? (
                            <div className="mt-3 border-t pt-3">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={54}
                                            outerRadius={88}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(val) => [fmt(val), '']}
                                            contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Leyenda 2 columnas */}
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    {pieData.map((entry) => {
                                        const catPct = Math.round((entry.value / total) * 100);
                                        return (
                                            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="flex-1 truncate text-gray-600">{entry.name}</span>
                                                <span className="shrink-0 tabular-nums text-gray-400">{catPct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 flex items-center justify-center border-t pt-6 pb-2">
                                <Calculator className="h-10 w-10 text-gray-200" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Resumen DESKTOP: fila total + barra + objetivo (oculto en mobile) ── */}
                <Card className="hidden lg:block">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-8">
                            <div className="min-w-[120px]">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total</p>
                                <p className="text-3xl font-bold" style={{ color: overBudget ? '#dc2626' : '#8b7355' }}>
                                    {fmt(total)}
                                </p>
                            </div>
                            <div className="flex-1">
                                <ProgressBar />
                                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                                    <span>0 €</span>
                                    <span>{fmt(localTarget / 2)}</span>
                                    <span>{fmt(localTarget)}</span>
                                </div>
                            </div>
                            <div className="min-w-[140px] text-right">
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Objetivo</p>
                                <div className="mt-1 flex justify-end">
                                    <TargetEditor />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Contenido principal ───────────────────────────────── */}
                <div className="grid gap-3 lg:grid-cols-5 lg:gap-6">

                    {/* Items por categoría */}
                    <div className="space-y-2 lg:col-span-3 lg:space-y-3">
                        {items.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <Calculator className="mb-3 h-12 w-12 text-gray-200" />
                                    <p className="font-medium text-gray-500">Sin gastos todavía</p>
                                    <p className="mt-1 text-sm text-gray-400">Pulsa «Agregar gasto» para empezar</p>
                                </CardContent>
                            </Card>
                        ) : (
                            itemsByCategory.map((cat) => {
                                const catTotal  = cat.items.reduce((s, i) => s + getValue(i), 0);
                                const Icon      = cat.icon;
                                const collapsed = collapsedCats[cat.id];

                                return (
                                    <Card key={cat.id} className="overflow-hidden">
                                        <button
                                            onClick={() => toggleCat(cat.id)}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                                        >
                                            <span
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                                style={{ backgroundColor: cat.color + '22', color: cat.color }}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="flex-1 text-sm font-semibold text-gray-800 sm:text-base">{cat.label}</span>
                                            <span className="font-mono text-sm font-semibold" style={{ color: cat.color }}>
                                                {fmt(catTotal)}
                                            </span>
                                            {collapsed
                                                ? <ChevronDown className="h-4 w-4 text-gray-400" />
                                                : <ChevronUp className="h-4 w-4 text-gray-400" />}
                                        </button>

                                        {!collapsed && (
                                            <div className="divide-y border-t bg-gray-50/30">
                                                {cat.items.map((item) => (
                                                    <div key={item.id} className="px-4 py-3">
                                                        {/* Nombre + valor + borrar */}
                                                        <div className="mb-2 flex items-center justify-between gap-2">
                                                            <span className="text-sm font-medium text-gray-700 leading-snug">{item.name}</span>
                                                            <div className="flex shrink-0 items-center gap-2">
                                                                <EditableValue
                                                                    value={getValue(item)}
                                                                    max={item.max}
                                                                    onChange={(v) => onSliderCommit(item.id, v)}
                                                                    color={cat.color}
                                                                />
                                                                <button
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="text-gray-300 transition-colors hover:text-red-400"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {/* Slider con zona de toque amplia en mobile */}
                                                        <div className="py-1">
                                                            <Slider
                                                                value={[getValue(item)]}
                                                                onValueChange={([v]) => onSliderChange(item.id, v)}
                                                                onValueCommit={([v]) => onSliderCommit(item.id, v)}
                                                                min={0}
                                                                max={item.max}
                                                                step={50}
                                                            />
                                                        </div>
                                                        <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
                                                            <span>0 €</span>
                                                            <span>{fmt(item.max)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Gráfico + desglose — solo visible en desktop */}
                    <div className="hidden lg:block lg:col-span-2 lg:space-y-4">
                        {pieData.length > 0 ? (
                            <Card>
                                <CardHeader className="pb-2 pt-4">
                                    <CardTitle className="text-base">Desglose por categoría</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={56}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(val) => [fmt(val), '']}
                                                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="mt-1 space-y-2">
                                        {pieData.map((entry) => {
                                            const catPct = Math.round((entry.value / total) * 100);
                                            return (
                                                <div key={entry.name} className="flex items-center gap-2 text-sm">
                                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span className="flex-1 truncate text-gray-600">{entry.name}</span>
                                                    <span className="text-xs text-gray-400 tabular-nums">{catPct}%</span>
                                                    <span className="font-mono text-xs font-semibold text-gray-800 tabular-nums">
                                                        {fmt(entry.value)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <div className="flex items-center gap-2 border-t pt-2 text-sm font-bold">
                                            <span className="flex-1 text-gray-900">Total</span>
                                            <span className="font-mono tabular-nums" style={{ color: '#8b7355' }}>{fmt(total)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-gray-400">El gráfico aparecerá cuando<br />añadas gastos</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminSidebarLayout>
    );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function CategoryChip({ active, color, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                active ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
            style={active ? { backgroundColor: color } : {}}
        >
            {children}
        </button>
    );
}

function EditableValue({ value, max, onChange, color }) {
    const [editing, setEditing] = useState(false);
    const [input, setInput]     = useState('');

    const commit = () => {
        onChange(Math.max(0, Math.min(Number(input), max)));
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="flex items-center gap-1">
                <Input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-6 w-20 px-1 text-right text-xs"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter')  commit();
                        if (e.key === 'Escape') setEditing(false);
                    }}
                    onBlur={commit}
                />
                <span className="text-xs text-gray-400">€</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => { setInput(String(value)); setEditing(true); }}
            className="group flex items-center gap-1 font-mono text-sm font-semibold hover:underline"
            style={{ color }}
            title="Haz clic para editar"
        >
            {fmt(value)}
            <Pencil className="h-3 w-3 text-current opacity-0 transition-opacity group-hover:opacity-60" />
        </button>
    );
}
