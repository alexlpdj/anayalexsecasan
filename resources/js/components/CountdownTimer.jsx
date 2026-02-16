import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownTimer({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label, shouldAnimate = true }) => {
        const displayValue = String(value).padStart(2, '0');

        return (
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b7355] to-[#7a6448] shadow-lg sm:h-20 sm:w-20">
                        {/* Solo anima los segundos, el resto es estático */}
                        {shouldAnimate ? (
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={value}
                                    className="font-serif text-2xl font-bold text-white sm:text-3xl"
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {displayValue}
                                </motion.span>
                            </AnimatePresence>
                        ) : (
                            <span className="font-serif text-2xl font-bold text-white sm:text-3xl">
                                {displayValue}
                            </span>
                        )}
                    </div>
                    {/* Decoración */}
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#d4c5b9]/40 blur-sm" />
                </div>
                <span className="mt-2 text-xs uppercase tracking-wider text-[#a89584] sm:text-sm">
                    {label}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="text-center">
                <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-[#b5a594]">
                    Faltan
                </p>
                <div className="mx-auto flex max-w-md justify-center gap-3 sm:gap-4">
                    <TimeUnit value={timeLeft.days} label="Días" shouldAnimate={false} />
                    <TimeUnit value={timeLeft.hours} label="Horas" shouldAnimate={false} />
                    <TimeUnit value={timeLeft.minutes} label="Min" shouldAnimate={false} />
                    <TimeUnit value={timeLeft.seconds} label="Seg" shouldAnimate={true} />
                </div>
            </div>
        </div>
    );
}
