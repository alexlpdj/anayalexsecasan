import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RippleButton({ children, onClick, className = '', disabled = false, type = 'button', variant = 'primary' }) {
    const [ripples, setRipples] = useState([]);

    const addRipple = (e) => {
        if (disabled) return;

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples([...ripples, newRipple]);

        // Remover el ripple después de la animación
        setTimeout(() => {
            setRipples((prevRipples) => prevRipples.filter((r) => r.id !== newRipple.id));
        }, 600);

        // Ejecutar el onClick original
        if (onClick) onClick(e);
    };

    const baseClasses = "relative overflow-hidden transition-all duration-200";
    const variantClasses = {
        primary: "bg-[#8b7355] text-white hover:bg-[#7a6448] active:scale-[0.98]",
        secondary: "border-2 border-[#d4c5b9] bg-white text-[#a89584] hover:border-[#a89584] hover:shadow-md active:scale-[0.98]",
        outline: "border-2 border-[#8b7355] bg-transparent text-[#8b7355] hover:bg-[#8b7355] hover:text-white active:scale-[0.98]",
    };

    return (
        <motion.button
            type={type}
            onClick={addRipple}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
            {children}

            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            ))}
        </motion.button>
    );
}
