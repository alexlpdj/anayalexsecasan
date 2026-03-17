import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, CheckCircle, Music, MessageCircle } from 'lucide-react';

const SECTIONS = [
    { id: 'sec-evento',    Icon: CalendarDays,   key: 'nav.evento' },
    { id: 'sec-programa',  Icon: Clock,          key: 'nav.programa' },
    { id: 'sec-rsvp',      Icon: CheckCircle,    key: 'nav.rsvp' },
    { id: 'sec-canciones', Icon: Music,          key: 'nav.canciones' },
    { id: 'sec-dudas',     Icon: MessageCircle,  key: 'nav.dudas' },
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
        <div className="sticky top-0 z-30 w-full border-b border-[#c9bfb3]/30 bg-[#faf8f5]/80 shadow-[0_1px_12px_rgba(139,115,85,0.08)] backdrop-blur-md">
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
                {SECTIONS.map(({ id, Icon, key }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                            activeId === id
                                ? 'bg-[#8b7355] text-white shadow-sm'
                                : 'bg-[#f0ebe5] text-[#8b7355] hover:bg-[#e4dbd1]'
                        }`}
                    >
                        <Icon size={13} strokeWidth={2} />
                        {t(key)}
                    </button>
                ))}
            </div>
        </div>
    );
}
