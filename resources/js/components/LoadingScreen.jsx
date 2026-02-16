import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        // Cargar la animación Lottie
        //fetch('/animations/noviosoutlined.json')
        fetch('/animations/anillos.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(err => console.log('No se pudo cargar la animación Lottie:', err));
    }, []);
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#f5f1ed] via-[#faf8f5] to-[#f0ebe5]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            onAnimationComplete={onComplete}
        >
            <div className="relative text-center">
                {/* Iniciales con animación */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="font-serif text-8xl italic leading-none text-[#8b7355]">
                        A <span className="mx-2 text-7xl font-light">&</span> A
                    </h1>
                </motion.div>

                {/* Línea decorativa */}
                <motion.div
                    className="mx-auto mt-6 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                    <span className="text-xs text-[#d4c5b9]">&#10047;</span>
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                </motion.div>

                {/* Fecha */}
                <motion.p
                    className="mt-4 text-sm uppercase tracking-[0.25em] text-[#a89584]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                >
                    20 de junio de 2026
                </motion.p>

                {/* Animación Lottie de anillos */}
                <motion.div
                    className="mx-auto mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                >
                    {animationData ? (
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            style={{ width: 120, height: 120, margin: '0 auto' }}
                        />
                    ) : (
                        // Fallback: puntos mientras carga la animación
                        <div className="flex gap-1.5 justify-center">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-2 w-2 rounded-full bg-[#8b7355]"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
