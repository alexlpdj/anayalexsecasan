import { motion } from 'framer-motion';

// Iconos según el tipo de evento
const getEventIcon = (eventName) => {
    const name = eventName.toLowerCase();

    // Ceremonia
    if (name.includes('ceremonia') || name.includes('boda')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C10.9 2 10 2.9 10 4C10 4.6 10.2 5.1 10.6 5.5L9.3 9H7C6.4 9 6 9.4 6 10V20C6 20.6 6.4 21 7 21H17C17.6 21 18 20.6 18 20V10C18 9.4 17.6 9 17 9H14.7L13.4 5.5C13.8 5.1 14 4.6 14 4C14 2.9 13.1 2 12 2M12 4.5C12.3 4.5 12.5 4.7 12.5 5C12.5 5.3 12.3 5.5 12 5.5C11.7 5.5 11.5 5.3 11.5 5C11.5 4.7 11.7 4.5 12 4.5Z"/>
            </svg>
        );
    }

    // Cóctel / Aperitivo
    if (name.includes('cóctel') || name.includes('coctel') || name.includes('aperitivo')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 7L5.5 5H18.5L16.5 7M11 13V19H6V21H18V19H13V13L21 5V3H3V5L11 13Z"/>
            </svg>
        );
    }

    // Comida / Banquete
    if (name.includes('comida') || name.includes('banquete') || name.includes('cena')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C14.58,11.24 14.58,10.76 14.88,10.47L18.53,6.81L21.66,9.94L18.03,13.56C17.74,13.85 17.26,13.85 16.97,13.56L14.88,11.47V11.53M20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L13.29,6.96C13.11,7.14 13,7.4 13,7.66C13,7.92 13.11,8.18 13.29,8.36L15.71,10.78L10.5,16L13,18.5L20.71,10.78C21.1,10.4 21.1,9.75 20.71,9.36L18.37,7.02L21.66,3.73C22.05,3.34 22.05,2.69 21.66,2.3L20.71,1.34L17.41,4.64L20.71,5.63M2.5,21L9,14.5L11.5,17L5,23.5L2.5,21Z"/>
            </svg>
        );
    }

    // Baile / Fiesta
    if (name.includes('baile') || name.includes('fiesta') || name.includes('dj') || name.includes('música')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.9,7L15,2.5L12.1,7L6.8,7.9L10.9,11.9L9.9,17.2L15,14.7L20.1,17.2L19.1,11.9L23.2,7.9L17.9,7M12.5,2C13,2 13.5,2.2 13.9,2.6L21.8,10.5C22.6,11.3 22.6,12.6 21.8,13.4L13.4,21.8C12.6,22.6 11.3,22.6 10.5,21.8L2.6,13.9C1.8,13.1 1.8,11.8 2.6,11L11,2.6C11.4,2.2 11.9,2 12.5,2Z"/>
            </svg>
        );
    }

    // Tarta / Postre
    if (name.includes('tarta') || name.includes('pastel') || name.includes('postre')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z"/>
            </svg>
        );
    }

    // Barra libre / Copas
    if (name.includes('barra') || name.includes('copa') || name.includes('brindis')) {
        return (
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M6,10C6,12.97 7.16,15.62 9.08,17.5L9.5,17.91V19.5H7V21.5H17V19.5H14.5V17.91L14.92,17.5C16.84,15.62 18,12.97 18,10H6M13,14.25L15.59,11.66L16.67,12.74L13,16.41L10.59,14L11.67,12.91L13,14.25Z"/>
            </svg>
        );
    }

    // Default - reloj
    return (
        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
        </svg>
    );
};

export default function AnimatedTimeline({ items }) {
    return (
        <div className="relative">
            <h4 className="mb-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#b5a594]">
                Programa del día
            </h4>

            <div className="relative space-y-0">
                {/* Línea vertical estática */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#e2dbd3] via-[#d4c5b9] to-[#e2dbd3]" />

                {items.map((item, index) => (
                    <div key={index} className="flex items-stretch gap-4">
                        {/* Icono en la línea */}
                        <div className="flex w-12 flex-shrink-0 flex-col items-center">
                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7355] to-[#7a6448] shadow-lg ring-4 ring-white">
                                {getEventIcon(item.event)}
                            </div>
                            {/* Línea conectora */}
                            {index < items.length - 1 && (
                                <div className="w-px flex-1 bg-transparent" />
                            )}
                        </div>

                        {/* Contenido del evento */}
                        <div className="pb-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#8b7355]">
                                {item.time}h
                            </p>
                            <p className="text-base font-medium text-[#8b7355]">
                                {item.event}
                            </p>
                            {item.description && (
                                <p className="mt-0.5 text-sm text-[#a89584]">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
