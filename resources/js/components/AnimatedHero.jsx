import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';
import CountdownTimer from './CountdownTimer';
import { isMobile } from '@/utils/deviceDetection';

export default function AnimatedHero({ showLoading }) {
    const [showFirstName, setShowFirstName] = useState(false);
    const [showAmpersand, setShowAmpersand] = useState(false);
    const [showSecondName, setShowSecondName] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        setMobile(isMobile());
    }, []);

    // Velocidades ajustadas para móvil
    const typeSpeed = mobile ? 100 : 200; // Más rápido en móvil

    return (
        <motion.header
            className="pb-4 pt-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showLoading ? 0 : 1, y: showLoading ? -20 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onAnimationComplete={() => {
                if (!showLoading) {
                    setTimeout(() => setShowFirstName(true), 300);
                }
            }}
        >
            <motion.p
                className="mb-3 text-[10px] uppercase tracking-[0.4em] text-[#c4b5a4]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: showLoading ? 0 : 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                os invitamos a nuestra boda
            </motion.p>

            <h1 className="font-serif text-6xl italic leading-none text-[#8b7355]">
                {/* Primera A con efecto typewriter */}
                {showFirstName && (
                    <TypewriterText
                        text="A"
                        delay={0}
                        speed={typeSpeed}
                        showCursor={false}
                        onComplete={() => setTimeout(() => setShowAmpersand(true), mobile ? 100 : 200)}
                    />
                )}

                {/* Ampersand con animación de escala */}
                {showAmpersand && (
                    <motion.span
                        className="mx-1 inline-block text-5xl font-light"
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                            duration: 0.6,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                        onAnimationComplete={() => setTimeout(() => setShowSecondName(true), 100)}
                    >
                        &
                    </motion.span>
                )}

                {/* Segunda A con efecto typewriter */}
                {showSecondName && (
                    <TypewriterText
                        text=" A"
                        delay={0}
                        speed={typeSpeed}
                        showCursor={false}
                        onComplete={() => setTimeout(() => setShowDate(true), mobile ? 150 : 300)}
                    />
                )}
            </h1>

            {/* Línea decorativa y fecha */}
            {showDate && (
                <motion.div
                    className="mx-auto mt-4 flex items-center justify-center gap-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => setTimeout(() => setShowCountdown(true), 200)}
                >
                    <motion.span
                        className="h-px w-8 bg-[#d4c5b9]"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 0.6 }}
                    />
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#a89584]">
                        20 de junio de 2026
                    </p>
                    <motion.span
                        className="h-px w-8 bg-[#d4c5b9]"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.div>
            )}

            {/* Countdown Timer con fade-in */}
            {showCountdown && (
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <CountdownTimer targetDate="2026-06-20T00:00:00" />
                </motion.div>
            )}
        </motion.header>
    );
}
