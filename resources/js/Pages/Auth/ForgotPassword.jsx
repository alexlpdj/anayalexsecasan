import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />

            <div className="mb-4 text-sm text-gray-600">
                ¿Has olvidado tu contraseña? No te preocupes. Indícanos tu
                correo electrónico y te enviaremos un enlace para que puedas
                establecer una nueva.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8b7355] focus:ring-[#8b7355]"
                    autoFocus
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-[#8b7355] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a6449] transition"
                        disabled={processing}
                    >
                        Enviar enlace de recuperación
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
