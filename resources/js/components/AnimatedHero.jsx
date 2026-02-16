import { motion } from 'framer-motion';

export default function AnimatedHero() {
    return (
        <motion.header
            className="pb-4 pt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Texto superior */}
            <motion.p
                className="mb-3 text-[10px] uppercase tracking-[0.4em] text-[#c4b5a4]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                os invitamos a nuestra boda
            </motion.p>

            {/* Nombres con animación suave */}
            <motion.h1
                className="font-serif text-6xl italic leading-none text-[#8b7355]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    A
                </motion.span>
                <motion.span
                    className="mx-1 inline-block text-5xl font-light"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                >
                    &
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                >
                    A
                </motion.span>
            </motion.h1>

            {/* Línea decorativa y fecha */}
            <motion.div
                className="mx-auto mt-4 flex items-center justify-center gap-3"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
            >
                <span className="h-px w-8 bg-[#d4c5b9]" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#a89584]">
                    20 de junio de 2026
                </p>
                <span className="h-px w-8 bg-[#d4c5b9]" />
            </motion.div>
        </motion.header>
    );
}
