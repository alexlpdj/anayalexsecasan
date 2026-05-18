import { Link } from '@inertiajs/react';
import { CalendarClock, ListMusic } from 'lucide-react';

const tabs = [
    { label: 'Momentos musicales', href: 'admin.music.index', match: 'admin.music.*', icon: CalendarClock },
    { label: 'Playlists', href: 'admin.playlists.index', match: 'admin.playlists.*', icon: ListMusic },
];

export default function MusicTabs() {
    return (
        <div className="mb-5 flex gap-1 rounded-xl border border-[#e2dbd3] bg-[#faf8f5] p-1">
            {tabs.map((tab) => {
                const active = route().current(tab.match);
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={route(tab.href)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                            active
                                ? 'bg-white text-[#8b7355] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
