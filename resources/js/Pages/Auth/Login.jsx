import InputError from '@/components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Iniciar sesión - Admin" />

            {/* Lado izquierdo - Decorativo */}
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-[#8b7355] via-[#a89584] to-[#8b7355] p-12 text-white relative overflow-hidden">
                {/* Fondo con ilustración de palmeras */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(/illustrations/palmeras_1.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Capa de color encima */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b7355]/85 via-[#a89584]/80 to-[#8b7355]/85" />
                </div>

                {/* Patrón decorativo de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-white/30" />
                    <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-white/20" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border border-white/20" />
                </div>

                {/* Contenido decorativo */}
                <div className="relative z-10">
                    <h1 className="font-serif text-7xl italic leading-tight">
                        A <span className="text-6xl">&</span> A
                    </h1>
                    <p className="mt-4 text-lg uppercase tracking-[0.3em] text-white/70">
                        20 • Junio • 2026
                    </p>
                </div>

                <div className="relative z-10">
                    <p className="font-serif text-2xl italic leading-relaxed text-white/90">
                        Panel de administración
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                        Gestión de invitaciones y confirmaciones
                    </p>
                </div>

                <div className="relative z-10">
                    <p className="font-serif italic text-white/50">
                        La Ópera, Benicàssim
                    </p>
                </div>

            </div>

            {/* Lado derecho - Formulario */}
            <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] relative">
                {/* Fondo sutil de palmeras en móvil */}
                <div
                    className="absolute inset-0 lg:hidden"
                    style={{
                        backgroundImage: 'url(/illustrations/palmeras_1.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5]/95 to-[#f5f1ed]/95" />
                </div>
                <div className="relative z-10 mx-auto w-full max-w-md">
                    {/* Logo para móvil */}
                    <div className="mb-8 text-center lg:hidden">
                        <h1 className="font-serif text-5xl italic text-[#8b7355]">
                            A <span className="text-4xl">&</span> A
                        </h1>
                        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#a89584]">
                            20 • Junio • 2026
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-serif text-3xl italic text-[#8b7355]">
                            Iniciar sesión
                        </h2>
                        <p className="mt-2 text-sm text-[#a89584]">
                            Accede al panel de administración de la boda
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium uppercase tracking-wide text-[#8b7355]"
                            >
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-2 block w-full rounded-lg border-2 border-[#d4c5b9] bg-white px-4 py-3 text-gray-800 transition focus:border-[#8b7355] focus:outline-none focus:ring-2 focus:ring-[#8b7355]/20"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium uppercase tracking-wide text-[#8b7355]"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full rounded-lg border-2 border-[#d4c5b9] bg-white px-4 py-3 text-gray-800 transition focus:border-[#8b7355] focus:outline-none focus:ring-2 focus:ring-[#8b7355]/20"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="rounded border-[#d4c5b9] text-[#8b7355] focus:ring-[#8b7355]/20"
                                />
                                <span className="ms-2 text-sm text-[#a89584]">
                                    Recordarme
                                </span>
                            </label>

                            {canResetPassword && (
                                <a
                                    href={route('password.request')}
                                    className="text-sm text-[#a89584] underline hover:text-[#8b7355] transition"
                                >
                                    ¿Has olvidado tu contraseña?
                                </a>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-gradient-to-r from-[#8b7355] to-[#a89584] px-6 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {processing ? 'Accediendo...' : 'Acceder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
