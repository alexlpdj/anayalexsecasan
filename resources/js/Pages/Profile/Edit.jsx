import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminSidebarLayout breadcrumbs={[{ label: 'Mi Perfil' }]}>
            <Head title="Mi Perfil" />

            <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="mt-1 text-sm text-gray-600">Gestiona tu información de cuenta</p>
                </div>

                <div className="bg-white p-4 shadow-sm rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-4 shadow-sm rounded-lg sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/*<div className="bg-white p-4 shadow-sm rounded-lg sm:p-8">*/}
                {/*    <DeleteUserForm className="max-w-xl" />*/}
                {/*</div>*/}
            </div>
        </AdminSidebarLayout>
    );
}
