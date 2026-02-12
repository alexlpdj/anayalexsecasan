import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar correo electrónico" />

            <div className="mb-4 text-sm text-gray-600">
                ¡Gracias por registrarte! Antes de empezar, ¿podrías verificar
                tu correo electrónico haciendo clic en el enlace que te acabamos
                de enviar? Si no has recibido el correo, te enviaremos otro con
                mucho gusto.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a la dirección
                    de correo que proporcionaste durante el registro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="submit"
                        className="rounded-md bg-[#8b7355] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a6449] transition"
                        disabled={processing}
                    >
                        Reenviar correo de verificación
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Cerrar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
