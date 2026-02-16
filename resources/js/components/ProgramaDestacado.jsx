import { motion } from 'framer-motion';

// Mapeo de iconos personalizados
const getEventIcon = (eventName) => {
    const name = eventName.toLowerCase();

    if (name.includes('ceremonia') || name.includes('boda')) {
        return '/icons/boda.png';
    }

    if (name.includes('cóctel') || name.includes('coctel') || name.includes('cocktail') || name.includes('aperitivo') || name.includes('buffet')) {
        return '/icons/banquete.png';
    }

    if (name.includes('comida') || name.includes('banquete') || name.includes('cena')) {
        return '/icons/banquete.png';
    }

    if (name.includes('baile') || name.includes('fiesta') || name.includes('dj') || name.includes('música')) {
        return '/icons/musica.png';
    }

    // Default: boda
    return '/icons/boda.png';
};

export default function ProgramaDestacado({ schedule }) {
    return (
        <div className="relative mx-auto max-w-3xl">
            {/* Línea vertical decorativa */}
            <div className="absolute left-8 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#e2dbd3] to-transparent" />

            <div className="space-y-8">
                {schedule.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative flex items-start gap-6 pl-0"
                    >
                        {/* Icono en la línea */}
                        <div className="relative z-10 flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f5f1ed] to-white p-3 shadow-md ring-4 ring-white transition-transform group-hover:scale-110">
                                <img
                                    src={getEventIcon(item.event)}
                                    alt={item.event}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 pb-2 pt-1">
                            {/* Hora */}
                            <div className="mb-2 inline-block rounded-full bg-[#8b7355]/10 px-4 py-1 text-sm font-bold text-[#8b7355]">
                                {item.time}h
                            </div>

                            {/* Título del evento */}
                            <h3 className="mb-2 font-serif text-2xl italic text-[#8b7355] transition-colors group-hover:text-[#7a6448]">
                                {item.event}
                            </h3>

                            {/* Descripción */}
                            {item.description && (
                                <p className="mb-3 text-base leading-relaxed text-[#a89584]">
                                    {item.description}
                                </p>
                            )}

                            {/* Detalles adicionales (si existen) */}
                            {item.details && (
                                <div className="space-y-2 rounded-lg bg-[#faf8f5]/50 p-4">
                                    {item.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <svg
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#c4a571]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2.5"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-sm text-[#8b7355]">
                                                {detail}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
