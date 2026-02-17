import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminSidebarLayout>
            <Head title="Panel" />

            <div className="p-6">
                <p className="text-gray-900">¡Has iniciado sesión!</p>
            </div>
        </AdminSidebarLayout>
    );
}
