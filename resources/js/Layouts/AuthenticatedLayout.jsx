import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    {
        label: 'Grupos',
        href: 'admin.groups.index',
        match: 'admin.groups.*',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
    {
        label: 'Preguntas',
        href: 'admin.questions',
        match: 'admin.questions',
        badge: 'questionsCount',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
        ),
    },
    {
        label: 'Ajustes Boda',
        href: 'admin.settings.wedding.edit',
        match: 'admin.settings.*',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'FAQs',
        href: 'admin.faqs.index',
        match: 'admin.faqs.*',
        icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        ),
    },
];

export default function AuthenticatedLayout({ children }) {
    const { auth, flash, adminNav } = usePage().props;
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    const isActive = (match) => route().current(match);

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* ── Flash toast mejorado ── */}
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
                            flash?.error
                                ? 'border-red-500'
                                : 'border-[#8b7355]'
                        }`}>
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    flash?.error
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-[#8b7355]/10 text-[#8b7355]'
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

                            {/* Message */}
                            <p className="flex-1 text-sm font-medium text-gray-800">
                                {flash?.success || flash?.error}
                            </p>

                            {/* Close button */}
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

            {/* ── Top nav ── */}
            <nav className="border-b border-[#e2dbd3]/60 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    {/* Logo */}
                    <Link
                        href={route('admin.groups.index')}
                        className="flex items-center gap-2.5"
                    >
                        <span className="font-serif text-xl italic text-[#8b7355]">A & A</span>
                        <span className="hidden text-xs text-[#b5a594] sm:inline">Panel admin</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 sm:flex">
                        {navItems.map((item) => {
                            const active = isActive(item.match);
                            if (item.external) {
                                return (
                                    <a
                                        key={item.href}
                                        href={route(item.href)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[#a89584] transition-colors hover:bg-[#f5f1ed] hover:text-[#8b7355]"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${
                                        active
                                            ? 'font-medium text-[#8b7355]'
                                            : 'text-[#a89584] hover:bg-[#f5f1ed] hover:text-[#8b7355]'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.badge && adminNav?.[item.badge] > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b7355] px-1.5 text-[10px] font-bold text-white"
                                        >
                                            {adminNav[item.badge]}
                                        </motion.span>
                                    )}
                                    {/* Active indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#8b7355]"
                                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User + mobile toggle */}
                    <div className="flex items-center gap-2">
                        <span className="hidden text-xs text-[#a89584] sm:inline">{user?.name}</span>
                        <button
                            onClick={() => router.post(route('logout'))}
                            className="rounded-lg px-2.5 py-1.5 text-xs text-[#a89584] transition-colors hover:bg-[#f5f1ed] hover:text-[#8b7355]"
                        >
                            Salir
                        </button>
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="rounded-lg p-2 text-[#a89584] hover:bg-[#f5f1ed] sm:hidden"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-[#e2dbd3]/40 sm:hidden"
                        >
                            <div className="px-4 pb-3 pt-2">
                                {navItems.map((item, index) => {
                                    const active = isActive(item.match);
                                    if (item.external) {
                                        return (
                                            <motion.a
                                                key={item.href}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                href={route(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#a89584] transition-colors hover:bg-[#f5f1ed]"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.icon}
                                                {item.label}
                                            </motion.a>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={item.href}
                                            href={route(item.href)}
                                            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                                active
                                                    ? 'bg-[#8b7355]/10 font-medium text-[#8b7355]'
                                                    : 'text-[#a89584] hover:bg-[#f5f1ed]'
                                            }`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.icon}
                                            {item.label}
                                            {item.badge && adminNav?.[item.badge] > 0 && (
                                                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b7355] px-1.5 text-[10px] font-bold text-white">
                                                    {adminNav[item.badge]}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── Content ── */}
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
        </div>
    );
}
