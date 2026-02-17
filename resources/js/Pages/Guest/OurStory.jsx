import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MusicPlayer from '@/components/MusicPlayer';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';

const storyMoments = [
    {
        date: 'Septiembre 2018',
        title: 'Nos conocimos',
        description: 'Todo empezó en una noche cualquiera que resultó no ser tan cualquiera. Cruzamos miradas y supimos que algo especial estaba comenzando.',
        icon: '💫',
    },
    {
        date: 'Diciembre 2018',
        title: 'Primera cita',
        description: 'Nervios, risas y la certeza de querer repetir. Aquella primera cita fue el inicio de miles de momentos juntos.',
        icon: '☕',
    },
    {
        date: 'Verano 2019',
        title: 'Primer viaje juntos',
        description: 'Descubrimos que viajar juntos era tan natural como respirar. Cada destino se convertía en nuestro lugar favorito.',
        icon: '✈️',
    },
    {
        date: '2020',
        title: 'Superamos todo juntos',
        description: 'El mundo se detuvo, pero nuestro amor se hizo más fuerte. Aprendimos que juntos podemos con cualquier cosa.',
        icon: '💪',
    },
    {
        date: '2022',
        title: 'Nuestro hogar',
        description: 'Construimos nuestro nido. Cuatro paredes que se llenaron de risas, cenas improvisadas y noches de película.',
        icon: '🏠',
    },
    {
        date: '2025',
        title: 'La pedida',
        description: '¡Dijo que sí! El momento más emocionante de nuestras vidas. Lágrimas de felicidad y la promesa de un para siempre.',
        icon: '💍',
    },
    {
        date: '20 de Junio, 2026',
        title: 'Nuestra boda',
        description: 'El día que celebraremos nuestro amor rodeados de las personas que más queremos. ¡Y tú eres una de ellas!',
        icon: '💒',
    },
];

export default function OurStory() {
    return (
        <>
            <Head title="Nuestra Historia" />
            <ScrollProgress />
            <ScrollToTop />
            <MusicPlayer
                playlist={['/audio/wedding-music.mp3', '/audio/wedding-music-2.mp3']}
            />

            <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#f5f1ed] to-[#faf8f5]">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="px-4 pb-4 pt-8 text-center sm:pb-8 sm:pt-16"
                >
                    <Link
                        href={route('guest.dashboard')}
                        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#d4c5b9]/50 bg-white/70 px-4 py-2 text-sm text-[#a89584] backdrop-blur-sm transition-colors hover:text-[#8b7355]"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Volver a la invitación
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="font-serif text-4xl italic text-[#8b7355] sm:text-5xl">
                            Nuestra Historia
                        </h1>
                        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
                            <span className="h-px w-12 bg-[#d4c5b9]" />
                            <span className="font-serif text-lg italic text-[#c4a571]">A & A</span>
                            <span className="h-px w-12 bg-[#d4c5b9]" />
                        </div>
                        <p className="mx-auto mt-4 max-w-md text-sm text-[#a89584] sm:text-base">
                            Cada gran historia de amor tiene sus capítulos. Esta es la nuestra.
                        </p>
                    </motion.div>
                </motion.header>

                {/* Timeline */}
                <div className="relative mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6">
                    {/* Vertical line */}
                    <div className="absolute left-[27px] top-8 hidden h-[calc(100%-6rem)] w-px bg-gradient-to-b from-[#d4c5b9] via-[#c4a571] to-[#d4c5b9] sm:left-1/2 sm:block sm:-translate-x-px" />

                    <div className="space-y-8 sm:space-y-12">
                        {storyMoments.map((moment, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex items-start gap-4 sm:gap-0 ${
                                    index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                                }`}
                            >
                                {/* Icon circle - mobile: left side, desktop: center */}
                                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#c4a571]/30 bg-white shadow-md sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                                    <span className="text-2xl">{moment.icon}</span>
                                </div>

                                {/* Content card */}
                                <div className={`flex-1 sm:w-[calc(50%-2.5rem)] ${
                                    index % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:pl-10 sm:text-left'
                                }`}>
                                    <div className="rounded-2xl border border-[#e2dbd3]/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
                                        <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-[#c4a571]">
                                            {moment.date}
                                        </span>
                                        <h3 className="mb-2 font-serif text-xl italic text-[#8b7355]">
                                            {moment.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-[#a89584]">
                                            {moment.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Spacer for desktop alternating layout */}
                                <div className="hidden sm:block sm:w-[calc(50%-2.5rem)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="pb-16 text-center"
                >
                    <p className="mb-4 font-serif text-lg italic text-[#8b7355]">
                        Y el próximo capítulo lo escribiremos juntos...
                    </p>
                    <Link
                        href={route('guest.dashboard')}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8b7355] to-[#a89584] px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    >
                        Confirmar Asistencia
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </>
    );
}
