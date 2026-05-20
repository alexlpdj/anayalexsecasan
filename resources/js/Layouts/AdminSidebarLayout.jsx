import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    SidebarRail,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
    Users, MessageCircle, Settings, HelpCircle, LogOut,
    ChevronsUpDown, UserCircle, Music, Calculator,
    UserCheck, LayoutDashboard, ListMusic, Gift,
} from 'lucide-react';

function WeddingRingsIcon({ className }) {
    return (
        <svg className={className} width="20" height="13" viewBox="0 0 20 13" fill="none">
            <circle cx="7" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="13" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

const navItems = [
    { label: 'Inicio',      pageTitle: 'Panel de inicio',        href: 'admin.dashboard',              match: 'admin.dashboard',  icon: LayoutDashboard },
    { label: 'Grupos',      pageTitle: 'Grupos de invitados',    href: 'admin.groups.index',           match: 'admin.groups.*',   icon: Users },
    { label: 'Confirmados', pageTitle: 'Invitados confirmados',  href: 'admin.confirmed',              match: 'admin.confirmed',  badge: 'attendingCount', icon: UserCheck },
    { label: 'Preguntas',   pageTitle: 'Preguntas recibidas',    href: 'admin.questions',              match: 'admin.questions',  badge: 'questionsCount', icon: MessageCircle },
    { label: 'Sugerencias', pageTitle: 'Sugerencias de invitados', href: 'admin.songs.index',           match: 'admin.songs.*',    badge: 'songsCount',     icon: Music },
    { label: 'Música',      pageTitle: 'Música de la boda',      href: 'admin.music.index',            match: ['admin.music.*', 'admin.playlists.*'],      icon: ListMusic },
    { label: 'FAQs',        pageTitle: 'Preguntas frecuentes',   href: 'admin.faqs.index',             match: 'admin.faqs.*',     icon: HelpCircle },
    { label: 'Presupuesto', pageTitle: 'Presupuesto de boda',    href: 'admin.budget.index',           match: 'admin.budget.*',   icon: Calculator },
    { label: 'Regalos',     pageTitle: 'Regalos de boda',        href: 'admin.gifts.index',            match: 'admin.gifts.*',    icon: Gift },
    { label: 'Ajustes',     pageTitle: 'Configuración de boda',  href: 'admin.settings.wedding.edit',  match: 'admin.settings.*', icon: Settings },
];

export default function AdminSidebarLayout({ children, breadcrumbs = [], topbarSubtitle, actions }) {
    const { auth, flash, adminNav } = usePage().props;
    const user = auth.user;
    const [showFlash, setShowFlash] = useState(false);
    const [errorOverride, setErrorOverride] = useState(null);
    const timerRef = useRef(null);

    const triggerToast = (duration = 4500) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShowFlash(true);
        timerRef.current = setTimeout(() => {
            setShowFlash(false);
            setErrorOverride(null);
        }, duration);
    };

    useEffect(() => {
        const offSuccess = router.on('success', (event) => {
            const { flash: newFlash } = event.detail.page.props;
            if (newFlash?.success || newFlash?.error) {
                triggerToast();
            }
        });

        const offError = router.on('error', () => {
            setErrorOverride('No se pudo guardar el cambio. Inténtalo de nuevo.');
            triggerToast();
        });

        return () => { offSuccess(); offError(); };
    }, []);

    const isActive = (match) =>
        Array.isArray(match)
            ? match.some((m) => route().current(m))
            : route().current(match);

    const activeItem = navItems.find(item => isActive(item.match));
    const DerivedIcon = activeItem?.icon;

    return (
        <SidebarProvider>
            {/* ── Flash toast ───────────────────────────────── */}
            <AnimatePresence>
                {showFlash && (errorOverride || flash?.success || flash?.error) && (() => {
                    const isError = !!(errorOverride || flash?.error);
                    const message = errorOverride || flash?.success || flash?.error;
                    return (
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="fixed right-4 top-4 z-50 max-w-md"
                        >
                            <div className={`flex items-center gap-3 rounded-xl border-l-4 bg-white p-4 shadow-xl ${
                                isError ? 'border-red-500' : 'border-[#8b7355]'
                            }`}>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        isError ? 'bg-red-50 text-red-500' : 'bg-[#8b7355]/10 text-[#8b7355]'
                                    }`}
                                >
                                    {isError ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </motion.div>
                                <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
                                <button
                                    onClick={() => { setShowFlash(false); setErrorOverride(null); }}
                                    className="group rounded-lg p-1 transition-colors hover:bg-gray-100"
                                >
                                    <svg className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            <Sidebar>
                {/* ── Brand ─────────────────────────────────── */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link
                                href={route('admin.dashboard')}
                                className="flex items-center gap-2.5 px-2 py-1.5"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8b7355]/10">
                                    <WeddingRingsIcon className="text-[#8b7355]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif text-base italic text-[#8b7355]">Boda Ana & Alex</span>
                                    <span className="text-[10px] text-[#b5a594]">Panel de administración</span>
                                </div>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* ── Navigation ────────────────────────────── */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => {
                                    const active = isActive(item.match);
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                                                <Link href={route(item.href)}>
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {item.badge && adminNav?.[item.badge] > 0 && (
                                                <SidebarMenuBadge>
                                                    {adminNav[item.badge]}
                                                </SidebarMenuBadge>
                                            )}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* ── User footer ───────────────────────────── */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b7355]/10">
                                            <UserCircle className="h-5 w-5 text-[#8b7355]" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto h-4 w-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="top"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/profile" className="cursor-pointer">
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => router.post(route('logout'))}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <SidebarInset className="min-w-0 overflow-x-hidden">
                {/* ── Top header con título de página ──────── */}
                <header className="sticky top-0 z-20 hidden h-14 shrink-0 items-center gap-3 border-b border-[#e2dbd3]/50 bg-white/90 px-4 backdrop-blur-sm lg:flex">
                    <SidebarTrigger className="-ml-1 text-[#a89584]" />
                    <Separator orientation="vertical" className="mx-1 h-4 bg-[#e2dbd3]" />

                    {/* Título derivado del route activo */}
                    <div className="flex flex-1 items-center gap-2 overflow-hidden">
                        {DerivedIcon && (
                            <DerivedIcon className="h-4 w-4 shrink-0 text-[#8b7355]" />
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-700">
                                {activeItem?.pageTitle ?? ''}
                            </p>
                            {topbarSubtitle && (
                                <p className="truncate text-xs text-gray-400">{topbarSubtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Acciones de página */}
                    {actions && (
                        <div className="flex shrink-0 items-center gap-2">
                            {actions}
                        </div>
                    )}
                </header>

                {/* ── Contenido principal ───────────────────── */}
                <main className="flex-1 bg-[#faf8f5] pb-16 lg:pb-0">
                    {children}
                </main>

                {/* ── Bottom nav mobile ─────────────────────── */}
                <nav
                    className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e2dbd3]/60 bg-white/95 backdrop-blur-sm lg:hidden"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    <div className="flex items-stretch">
                        {[
                            { label: 'Inicio',      href: 'admin.dashboard',    match: 'admin.dashboard', icon: LayoutDashboard, badge: null },
                            { label: 'Grupos',      href: 'admin.groups.index', match: 'admin.groups.*',  icon: Users,           badge: null },
                            { label: 'Confirmados', href: 'admin.confirmed',    match: 'admin.confirmed', icon: UserCheck,       badge: 'attendingCount' },
                            { label: 'Preguntas',   href: 'admin.questions',    match: 'admin.questions', icon: MessageCircle,   badge: 'questionsCount' },
                            { label: 'Sugerencias', href: 'admin.songs.index',  match: 'admin.songs.*',   icon: Music,           badge: 'songsCount' },
                        ].map((item) => {
                            const active = isActive(item.match);
                            const Icon = item.icon;
                            const count = item.badge ? (adminNav?.[item.badge] ?? 0) : 0;
                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                                        active ? 'text-[#8b7355]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {active && (
                                        <span className="absolute inset-x-3 top-0 h-0.5 rounded-b-full bg-[#8b7355]" />
                                    )}
                                    <div className="relative">
                                        <Icon className="h-5 w-5" />
                                        {count > 0 && (
                                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8b7355] text-[9px] font-bold text-white">
                                                {count > 9 ? '9+' : count}
                                            </span>
                                        )}
                                    </div>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </SidebarInset>
        </SidebarProvider>
    );
}
