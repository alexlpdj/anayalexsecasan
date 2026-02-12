import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
            {/* ── Flash toast ── */}
            <div
                className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 ${
                    showFlash ? 'translate-y-4 opacity-100' : '-translate-y-full opacity-0'
                }`}
            >
                <div className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-lg ${
                    flash?.error ? 'bg-red-500' : 'bg-[#8b7355]'
                }`}>
                    {flash?.success || flash?.error}
                </div>
            </div>

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
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                                        active
                                            ? 'bg-[#8b7355]/10 font-medium text-[#8b7355]'
                                            : 'text-[#a89584] hover:bg-[#f5f1ed] hover:text-[#8b7355]'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.badge && adminNav?.[item.badge] > 0 && (
                                        <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b7355] px-1.5 text-[10px] font-bold text-white">
                                            {adminNav[item.badge]}
                                        </span>
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
                {mobileOpen && (
                    <div className="border-t border-[#e2dbd3]/40 px-4 pb-3 pt-2 sm:hidden">
                        {navItems.map((item) => {
                            const active = isActive(item.match);
                            if (item.external) {
                                return (
                                    <a
                                        key={item.href}
                                        href={route(item.href)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#a89584]"
                                        onClick={() => setMobileOpen(false)}
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
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                                        active ? 'font-medium text-[#8b7355]' : 'text-[#a89584]'
                                    }`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.badge && adminNav?.[item.badge] > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b7355] px-1.5 text-[10px] font-bold text-white">
                                            {adminNav[item.badge]}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* ── Content ── */}
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
        </div>
    );
}
