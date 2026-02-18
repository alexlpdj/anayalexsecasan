import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Users, MessageCircle, Settings, HelpCircle, LogOut, ChevronsUpDown, UserCircle, FileDown, Printer } from 'lucide-react';

const navItems = [
    {
        label: 'Grupos',
        href: 'admin.groups.index',
        match: 'admin.groups.*',
        icon: Users,
    },
    {
        label: 'Preguntas',
        href: 'admin.questions',
        match: 'admin.questions',
        badge: 'questionsCount',
        icon: MessageCircle,
    },
    {
        label: 'FAQs',
        href: 'admin.faqs.index',
        match: 'admin.faqs.*',
        icon: HelpCircle,
    },
    {
        label: 'Ajustes',
        href: 'admin.settings.wedding.edit',
        match: 'admin.settings.*',
        icon: Settings,
    },
];


export default function AdminSidebarLayout({ children, breadcrumbs = [] }) {
    const { auth, flash, adminNav } = usePage().props;
    const user = auth.user;
    const [showFlash, setShowFlash] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        return router.on('success', (event) => {
            const { flash: newFlash } = event.detail.page.props;
            if (newFlash?.success || newFlash?.error) {
                if (timerRef.current) clearTimeout(timerRef.current);
                setShowFlash(true);
                timerRef.current = setTimeout(() => setShowFlash(false), 4000);
            }
        });
    }, []);

    const isActive = (match) => route().current(match);

    return (
        <SidebarProvider>
            {/* Flash toast */}
            <AnimatePresence>
                {showFlash && (flash?.success || flash?.error) && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed right-4 top-4 z-50 max-w-md"
                    >
                        <div className={`flex items-center gap-3 rounded-lg border-l-4 bg-white p-4 shadow-xl ${
                            flash?.error ? 'border-red-500' : 'border-[#8b7355]'
                        }`}>
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    flash?.error ? 'bg-red-50 text-red-500' : 'bg-[#8b7355]/10 text-[#8b7355]'
                                }`}
                            >
                                {flash?.error ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </motion.div>
                            <p className="flex-1 text-sm font-medium text-gray-800">
                                {flash?.success || flash?.error}
                            </p>
                            <button
                                onClick={() => setShowFlash(false)}
                                className="group rounded-lg p-1 transition-colors hover:bg-gray-100"
                            >
                                <svg className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar>
                {/* Sidebar Header: Logo */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link
                                href={route('admin.groups.index')}
                                className="flex items-center gap-2.5 px-2 py-1.5"
                            >

                                <div className="flex flex-col">
                                    <span className="font-serif text-base italic text-[#8b7355]">Boda Ana & Alex</span>
                                    <span className="text-[10px] text-[#b5a594]">Panel de administración</span>
                                </div>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Navigation */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => {
                                    const active = isActive(item.match);
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={item.label}
                                            >
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

                {/* Footer: User */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent"
                                    >
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

            <SidebarInset>
                {/* Top header bar */}
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#e2dbd3]/40 px-4">
                    <SidebarTrigger className="-ml-1 text-[#a89584]" />
                    {breadcrumbs.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((crumb, index) => (
                                        <BreadcrumbItem key={index}>
                                            {index > 0 && <BreadcrumbSeparator />}
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={crumb.href}>{crumb.label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </>
                    )}
                </header>

                {/* Main content */}
                <main className="flex-1 bg-[#faf8f5]">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
