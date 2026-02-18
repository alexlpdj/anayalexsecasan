import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const errorMessages = {
    404: {
        title: "¿Te has perdido?",
        message: "Parece que esta página se ha ido de luna de miel antes que nosotros...",
        suggestion: "No te preocupes, vuelve atrás y solucionado.",
        emoji: "🗺️"
    },
    403: {
        title: "¡Alto ahí!",
        message: "Esta zona es solo para los novios.",
        suggestion: "Si eres invitado, vuelve a tu sitio!.",
        emoji: "🚫"
    },
    500: {
        title: "¡Ay, no!",
        message: "Algo se ha roto... pero tranquilo, no ha sido el vestido de la novia.",
        suggestion: "Nuestro técnico está cosiendo el código. Vuelve en un momento.",
        emoji: "💔"
    },
    419: {
        title: "Sesión expirada",
        message: "Tu sesión ha expirado más rápido que el champán en el brindis.",
        suggestion: "Inicia sesión de nuevo para seguir celebrando.",
        emoji: "🥂"
    },
    503: {
        title: "Mantenimiento",
        message: "Estamos en la prueba del menú, volvemos enseguida...",
        suggestion: "Dale refresh en unos minutos.",
        emoji: "🍽️"
    }
};

export default function Error({ status }) {
    const errorContent = errorMessages[status] || {
        title: "Algo falla",
        message: "Ups... esto no estaba en el plan de boda.",
        suggestion: "Volvamos a la pista de baile.",
        emoji: "😅"
    };

    const isAdmin = window.location.pathname.startsWith('/admin');

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede8e3]">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-0">
                {/* Top palm */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 0.08, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute right-0 top-0 h-64 w-64 bg-[url('/icons/palm.svg')] bg-contain bg-no-repeat opacity-5"
                />
                {/* Bottom palm */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.08, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute bottom-0 left-0 h-64 w-64 -scale-x-100 bg-[url('/icons/palm.svg')] bg-contain bg-no-repeat opacity-5"
                />
            </div>

            {/* Content */}
            <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
                {/* Monogram */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="font-serif text-6xl italic text-[#8b7355] sm:text-7xl">
                        A & A
                    </span>
                </motion.div>

                {/* Error card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-lg"
                >
                    <div className="rounded-2xl border border-[#e2dbd3]/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm sm:p-10">
                        {/* Status code */}
                        <div className="mb-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
                                className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7355] to-[#a89584] text-4xl shadow-lg"
                            >
                                {errorContent.emoji}
                            </motion.div>
                            <h1 className="mb-2 font-serif text-4xl italic text-[#8b7355]">
                                {errorContent.title}
                            </h1>
                            <p className="text-sm font-medium text-[#a89584]">
                                Error {status}
                            </p>
                        </div>

                        {/* Message */}
                        <div className="mb-8 space-y-3 text-center">
                            <p className="text-lg text-gray-700">
                                {errorContent.message}
                            </p>
                            <p className="text-sm italic text-[#b5a594]">
                                {errorContent.suggestion}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {isAdmin ? (
                                <>
                                    <Link
                                        href="/admin/dashboard"
                                        className="group flex-1 rounded-lg bg-gradient-to-r from-[#8b7355] to-[#a89584] px-6 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Panel Admin
                                        </span>
                                    </Link>
                                    <Link
                                        href="/invitacion/login"
                                        className="flex-1 rounded-lg border border-[#e2dbd3] bg-white px-6 py-3 text-center text-sm font-medium text-[#8b7355] transition-all hover:bg-[#faf8f5]"
                                    >
                                        Ver Invitación
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/invitacion/login"
                                        className="group flex-1 rounded-lg bg-gradient-to-r from-[#8b7355] to-[#a89584] px-6 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                            </svg>
                                            Volver a la Invitación
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex-1 rounded-lg border border-[#e2dbd3] bg-white px-6 py-3 text-center text-sm font-medium text-[#8b7355] transition-all hover:bg-[#faf8f5]"
                                    >
                                        Atrás
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Footer message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center text-xs italic text-[#b5a594]"
                >
                    Si este error persiste, nuestro wedding planner digital está de vacaciones...
                </motion.p>
            </div>
        </div>
    );
}
