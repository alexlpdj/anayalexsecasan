import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            {/* Fondo con ilustración de palmeras */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: 'url(/illustrations/palmeras_1.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Capa dorada semitransparente */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5]/95 via-white/92 to-[#f5f1ed]/95" />
            </div>

            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </AppContent>
            </AppShell>
        </>
    );
}
