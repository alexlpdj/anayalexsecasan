import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <div className="mb-4 text-sm text-gray-600">
                Esta es una zona segura de la aplicación. Por favor, confirma tu
                contraseña antes de continuar.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8b7355] focus:ring-[#8b7355]"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-[#8b7355] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a6449] transition"
                        disabled={processing}
                    >
                        Confirmar
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
