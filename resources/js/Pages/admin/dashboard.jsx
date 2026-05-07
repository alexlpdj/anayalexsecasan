import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users, UserCheck, UserX, Clock, Heart, MapPin, CalendarDays,
    AlertCircle, Send, Bus, Music, MessageCircle, ChevronRight,
    TrendingUp, CheckCircle2, XCircle, Utensils, BarChart3,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────── */

function pad(n) { return String(n).padStart(2, '0'); }

function useCountdown(targetDate) {
    const calc = () => {
        if (!targetDate) return null;
        const diff = new Date(targetDate + 'T12:00:00') - new Date();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
        return {
            days:    Math.floor(diff / 86400000),
            hours:   Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000)  / 60000),
            seconds: Math.floor((diff % 60000)    / 1000),
            past: false,
        };
    };
    const [t, setT] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return t;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr);
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'ahora mismo';
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `hace ${d}d`;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

/* ─── sub-components ──────────────────────────────────────── */

function StatCard({ icon: Icon, label, value, sub, unit, colorText, colorBg, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
        >
            <Card className="relative overflow-hidden border-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 sm:text-sm">{label}</p>
                            <p className={`mt-1 text-3xl font-bold sm:text-4xl ${colorText}`}>{value}</p>
                            {unit && <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">{unit}</p>}
                            {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
                        </div>
                        <div className={`rounded-xl p-2.5 ${colorBg}`}>
                            <Icon className={`h-5 w-5 ${colorText}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function AlertItem({ icon: Icon, iconClass, label, value, unit = 'grupos', linkHref, linkLabel, onAction, actionLabel }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{value} {unit}</p>
            </div>
            {linkHref && (
                <Link href={linkHref}>
                    <Button size="sm" variant="ghost" className="h-8 shrink-0 rounded-lg text-xs text-[#8b7355] hover:bg-[#8b7355]/10">
                        {linkLabel || 'Ver'} <ChevronRight className="ml-0.5 h-3 w-3" />
                    </Button>
                </Link>
            )}
            {onAction && (
                <Button size="sm" variant="ghost" className="h-8 shrink-0 rounded-lg text-xs text-[#8b7355] hover:bg-[#8b7355]/10" onClick={onAction}>
                    {actionLabel} <ChevronRight className="ml-0.5 h-3 w-3" />
                </Button>
            )}
        </div>
    );
}

function ActivityItem({ item }) {
    return (
        <div className="flex items-center gap-3 py-2.5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                item.is_confirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
                {item.is_confirmed
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <XCircle className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">
                    {item.is_confirmed
                        ? `${item.attending_count} de ${item.total_count} asistirán`
                        : 'Han declinado la invitación'}
                </p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{timeAgo(item.submitted_at)}</span>
        </div>
    );
}

function QuestionItem({ q }) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-600">{q.group_name}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-gray-700">{q.message}</p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{timeAgo(q.created_at)}</span>
        </div>
    );
}

/* ─── main ────────────────────────────────────────────────── */

export default function Dashboard({ wedding, stats, alerts, transport, recent_activity, recent_questions }) {
    const countdown = useCountdown(wedding?.wedding_date);

    const guestRate    = stats.total_guests > 0 ? Math.round((stats.attending_guests / stats.total_guests) * 100) : 0;
    const responseRate = stats.response_rate;

    const sendReminders = () => {
        if (confirm(`¿Enviar recordatorio a ${alerts.pending_with_email} grupos pendientes con email?`)) {
            router.post(route('admin.groups.send-reminders'), {}, { preserveScroll: true });
        }
    };

    const s = (i) => 0.08 + i * 0.055;

    return (
        <AdminSidebarLayout>
            <Head title="Inicio" />

            <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 sm:space-y-5 sm:p-6 sm:pb-8 lg:pb-6">

                {/* ── HERO ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5c4433] via-[#8b7355] to-[#a89070] p-5 text-white shadow-xl sm:p-8"
                >
                    {/* decorative circles */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full border border-white/5" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* names + date + venue */}
                        <div>
                            <div className="flex items-center gap-2 text-white/60">
                                <Heart className="h-3.5 w-3.5 fill-white/40" />
                                <span className="text-xs font-medium tracking-widest uppercase">Panel de boda</span>
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                {wedding?.bride ?? 'Ana'} <span className="text-white/50">&</span> {wedding?.groom ?? 'Alex'}
                            </h1>
                            <div className="mt-2 space-y-1">
                                {wedding?.venue_name && (
                                    <div className="flex items-center gap-1.5 text-white/70">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-sm">{wedding.venue_name}</span>
                                    </div>
                                )}
                                {wedding?.wedding_date && (
                                    <div className="flex items-center gap-1.5 text-white/70">
                                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-sm capitalize">
                                            {new Date(wedding.wedding_date + 'T12:00:00').toLocaleDateString('es-ES', {
                                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* countdown */}
                        {countdown && !countdown.past ? (
                            <div className="flex shrink-0 gap-2 sm:gap-3">
                                {[
                                    { v: countdown.days,    l: 'días' },
                                    { v: countdown.hours,   l: 'horas' },
                                    { v: countdown.minutes, l: 'min' },
                                    { v: countdown.seconds, l: 'seg' },
                                ].map(({ v, l }) => (
                                    <div key={l} className="flex min-w-[52px] flex-col items-center rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur-sm sm:min-w-[64px] sm:py-3">
                                        <span className="text-2xl font-bold tabular-nums leading-none sm:text-3xl">{pad(v)}</span>
                                        <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/60 sm:text-[10px]">{l}</span>
                                    </div>
                                ))}
                            </div>
                        ) : countdown?.past ? (
                            <div className="rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur-sm">
                                <p className="text-xl font-bold">¡El gran día ya llegó! 🎉</p>
                            </div>
                        ) : null}
                    </div>

                    {/* RSVP progress */}
                    <div className="relative mt-6">
                        <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
                            <span className="font-medium">Respuestas RSVP</span>
                            <span className="font-bold text-white">{responseRate}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${responseRate}%` }}
                                transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                                className="h-full rounded-full bg-white shadow-sm"
                            />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/55">
                            <span>{stats.submitted_groups} de {stats.total_groups} grupos han respondido</span>
                            <span>{stats.pending_groups} pendientes</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── STATS ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <StatCard icon={Users}     label="Total invitados" value={stats.total_guests}          unit="personas" colorText="text-[#8b7355]" colorBg="bg-[#8b7355]/10" delay={s(0)} />
                    <StatCard icon={UserCheck} label="Asistirán"       value={stats.attending_guests}      unit="personas" colorText="text-green-600" colorBg="bg-green-100"    delay={s(1)} sub={`${guestRate}% del total`} />
                    <StatCard icon={UserX}     label="No asisten"      value={stats.not_attending_guests}  unit="personas" colorText="text-red-500"   colorBg="bg-red-100"      delay={s(2)} />
                    <StatCard icon={Clock}     label="Sin responder"   value={stats.pending_guests}        unit="personas" colorText="text-amber-600" colorBg="bg-amber-100"    delay={s(3)} />
                </div>

                {/* ── GROUPS MINI ───────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                        { label: 'Grupos confirmados', value: stats.confirmed_groups, text: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-100' },
                        { label: 'Grupos rechazados',  value: stats.declined_groups,  text: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-100'   },
                        { label: 'Grupos pendientes',  value: stats.pending_groups,   text: 'text-amber-600', bg: 'bg-amber-50',  border: 'border-amber-100' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: s(4 + i) }}
                        >
                            <div className={`rounded-xl border ${item.border} ${item.bg} p-3 text-center sm:p-4`}>
                                <p className={`text-2xl font-bold sm:text-3xl ${item.text}`}>{item.value}</p>
                                <p className="mt-0.5 text-xs font-medium text-gray-500">{item.label}</p>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">grupos</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── MAIN GRID ─────────────────────────────────────── */}
                <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">

                    {/* LEFT col */}
                    <div className="space-y-4 lg:col-span-2">

                        {/* Alertas */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: s(7) }}>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="px-4 pb-2 pt-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                        Requieren atención
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 px-4 pb-4">
                                    {alerts.pending_with_email > 0 && (
                                        <AlertItem
                                            icon={Send} iconClass="bg-blue-100 text-blue-600"
                                            label="Pendientes con email"
                                            value={alerts.pending_with_email}
                                            onAction={sendReminders} actionLabel="Recordatorio"
                                        />
                                    )}
                                    {alerts.without_transport > 0 && (
                                        <AlertItem
                                            icon={Bus} iconClass="bg-orange-100 text-orange-600"
                                            label="Sin transporte confirmado"
                                            value={alerts.without_transport}
                                            linkHref={route('admin.confirmed')} linkLabel="Ver"
                                        />
                                    )}
                                    {alerts.with_allergies > 0 && (
                                        <AlertItem
                                            icon={Utensils} iconClass="bg-amber-100 text-amber-600"
                                            label="Con alergias alimentarias"
                                            value={alerts.with_allergies} unit="personas"
                                            linkHref={route('admin.confirmed')} linkLabel="Ver"
                                        />
                                    )}
                                    {!alerts.pending_with_email && !alerts.without_transport && !alerts.with_allergies && (
                                        <div className="py-5 text-center">
                                            <CheckCircle2 className="mx-auto h-9 w-9 text-green-400" />
                                            <p className="mt-2 text-sm font-medium text-gray-500">Todo en orden 🎉</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Transporte */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: s(8) }}>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="px-4 pb-2 pt-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Bus className="h-4 w-4 text-blue-500" />
                                        Transporte (personas confirmadas)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 px-4 pb-4">
                                    {transport.map((t) => {
                                        const defined = transport.filter(x => x.name !== 'Sin definir');
                                        const max = Math.max(...defined.map(x => x.value), 1);
                                        const pct = Math.round((t.value / max) * 100);
                                        const isSinDefinir = t.name === 'Sin definir';
                                        return (
                                            <div key={t.name}>
                                                <div className="mb-1 flex items-center justify-between text-xs">
                                                    <span className={isSinDefinir ? 'font-medium text-orange-600' : 'text-gray-600'}>
                                                        {t.name}
                                                        {isSinDefinir && ' ⚠'}
                                                    </span>
                                                    <span className={`font-semibold ${isSinDefinir ? 'text-orange-600' : 'text-gray-800'}`}>
                                                        {t.value} personas
                                                    </span>
                                                </div>
                                                {!isSinDefinir && (
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
                                                            className="h-full rounded-full bg-blue-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Accesos rápidos */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: s(9) }}>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="px-4 pb-2 pt-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <BarChart3 className="h-4 w-4 text-[#8b7355]" />
                                        Ir a sección
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2 px-4 pb-4">
                                    {[
                                        { label: 'Grupos',      href: route('admin.groups.index'),      icon: Users,         value: stats.total_groups,      hov: 'hover:border-[#8b7355]/30 hover:bg-[#8b7355]/5' },
                                        { label: 'Confirmados', href: route('admin.confirmed'),         icon: UserCheck,     value: stats.confirmed_groups,  hov: 'hover:border-green-200 hover:bg-green-50' },
                                        { label: 'Preguntas',   href: route('admin.questions'),         icon: MessageCircle, value: alerts.questions_count,  hov: 'hover:border-violet-200 hover:bg-violet-50' },
                                        { label: 'Canciones',   href: route('admin.songs.index'),       icon: Music,         value: alerts.songs_count,      hov: 'hover:border-pink-200 hover:bg-pink-50' },
                                    ].map(({ label, href, icon: Icon, value, hov }) => (
                                        <Link key={label} href={href}>
                                            <div className={`flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-100 p-3 transition-all ${hov}`}>
                                                <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-gray-500">{label}</p>
                                                    <p className="text-xl font-bold leading-tight text-gray-900">{value}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* RIGHT col */}
                    <div className="space-y-4 lg:col-span-3">

                        {/* Actividad reciente */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: s(7) }}>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between px-4 pb-2 pt-4">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <TrendingUp className="h-4 w-4 text-[#8b7355]" />
                                        Últimas respuestas RSVP
                                    </CardTitle>
                                    <Link href={route('admin.groups.index')}>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#8b7355] hover:bg-[#8b7355]/10">
                                            Ver todos <ChevronRight className="ml-0.5 h-3 w-3" />
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent className="divide-y divide-gray-50 px-4 pb-2">
                                    {recent_activity.length === 0 ? (
                                        <p className="py-8 text-center text-sm text-gray-400">Ningún grupo ha respondido todavía</p>
                                    ) : (
                                        recent_activity.map((item) => <ActivityItem key={item.id} item={item} />)
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Preguntas recientes */}
                        {recent_questions.length > 0 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: s(8) }}>
                                <Card className="border-0 shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between px-4 pb-2 pt-4">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <MessageCircle className="h-4 w-4 text-violet-500" />
                                            Últimas preguntas
                                            {alerts.questions_count > 0 && (
                                                <Badge className="bg-violet-100 text-[10px] text-violet-700">{alerts.questions_count}</Badge>
                                            )}
                                        </CardTitle>
                                        <Link href={route('admin.questions')}>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-violet-600 hover:bg-violet-50">
                                                Ver todas <ChevronRight className="ml-0.5 h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="divide-y divide-gray-50 px-4 pb-2">
                                        {recent_questions.map((q) => <QuestionItem key={q.id} q={q} />)}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </AdminSidebarLayout>
    );
}
