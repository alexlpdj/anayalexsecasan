/**
 * Utilidades para detectar dispositivo y ajustar animaciones
 */

export const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

export const isTablet = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
};

export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Obtiene la duración de animación ajustada según el dispositivo
 */
export const getAnimationDuration = (baseDuration) => {
    if (prefersReducedMotion()) return 0;
    if (isMobile()) return baseDuration * 0.7; // 30% más rápido en móvil
    return baseDuration;
};

/**
 * Obtiene configuración de animación optimizada
 */
export const getOptimizedAnimation = (animation) => {
    const mobile = isMobile();
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
        return {
            initial: animation.initial,
            animate: animation.initial, // Sin animación
            exit: animation.initial,
        };
    }

    if (mobile) {
        return {
            ...animation,
            transition: {
                ...animation.transition,
                duration: (animation.transition?.duration || 0.5) * 0.7,
            },
        };
    }

    return animation;
};
