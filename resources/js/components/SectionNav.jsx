import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SECTIONS = [
    { id: 'sec-evento',    icon: '📅', key: 'nav.evento' },
    { id: 'sec-programa',  icon: '🗓', key: 'nav.programa' },
    { id: 'sec-rsvp',      icon: '✓',  key: 'nav.rsvp' },
    { id: 'sec-canciones', icon: '🎵', key: 'nav.canciones' },
    { id: 'sec-dudas',     icon: '❓', key: 'nav.dudas' },
];

export const NAV_HEIGHT = 48; // px

export default function SectionNav() {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const observers = SECTIONS.map(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveId(id);
                },
                { threshold: 0, rootMargin: `-${NAV_HEIGHT}px 0px -45% 0px` }
            );
            obs.observe(el);
            return obs;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    return (
        <div className="sticky top-0 z-30 w-full border-b border-[#e2dbd3]/60 bg-white/90 shadow-sm backdrop-blur-md">
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
                {SECTIONS.map(({ id, icon, key }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                            activeId === id
                                ? 'bg-[#8b7355] text-white shadow-sm'
                                : 'bg-[#f0ebe5] text-[#8b7355] hover:bg-[#e4dbd1]'
                        }`}
                    >
                        {icon} {t(key)}
                    </button>
                ))}
            </div>
        </div>
    );
}
