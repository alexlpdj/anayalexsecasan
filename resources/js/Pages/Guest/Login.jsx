import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Lottie from 'lottie-react';

export default function GuestLogin() {
    const [showLoading, setShowLoading] = useState(true);
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });



    const submit = (e) => {
        e.preventDefault();
        post(route('guest.login.post'));
    };

    return (
        <>
            {/* Loading Screen */}
            <AnimatePresence>
                {showLoading && (
                    <LoadingScreen onComplete={() => setTimeout(() => setShowLoading(false), 2000)} />
                )}
            </AnimatePresence>

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
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1ed]/95 via-[#faf8f5]/92 to-[#ede8e3]/95" />
            </div>

            <div className="min-h-screen">
                <Head title="Acceso invitados" />

                {/* Header decorativo */}
                <motion.header
                    className="relative py-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: showLoading ? 0 : 1, y: showLoading ? -20 : 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                <div className="mx-auto max-w-6xl px-4">
                    <h1 className="mb-2 font-serif text-6xl italic text-[#8b7355]">
                        A <span className="text-5xl">&</span> A
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#a89584]">
                        20 • Junio • 2026
                    </p>
                </div>

                {/* Palmeras decorativas */}
                <div className="pointer-events-none absolute left-4 top-0 h-32 w-24 opacity-20">
                    <svg viewBox="0 0 100 200" className="h-full w-full">
                        <path
                            d="M50 180 Q45 140 40 100 Q35 60 30 20 M50 180 Q50 140 50 100 Q50 60 50 20 M50 180 Q55 140 60 100 Q65 60 70 20"
                            stroke="#6b8e5a"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.3"
                        />
                        <ellipse cx="30" cy="15" rx="15" ry="8" fill="#6b8e5a" opacity="0.2" />
                        <ellipse cx="50" cy="10" rx="18" ry="8" fill="#6b8e5a" opacity="0.2" />
                        <ellipse cx="70" cy="15" rx="15" ry="8" fill="#6b8e5a" opacity="0.2" />
                    </svg>
                </div>
                <div className="pointer-events-none absolute right-4 top-0 h-32 w-24 scale-x-[-1] opacity-20">
                    <svg viewBox="0 0 100 200" className="h-full w-full">
                        <path
                            d="M50 180 Q45 140 40 100 Q35 60 30 20 M50 180 Q50 140 50 100 Q50 60 50 20 M50 180 Q55 140 60 100 Q65 60 70 20"
                            stroke="#6b8e5a"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.3"
                        />
                        <ellipse cx="30" cy="15" rx="15" ry="8" fill="#6b8e5a" opacity="0.2" />
                        <ellipse cx="50" cy="10" rx="18" ry="8" fill="#6b8e5a" opacity="0.2" />
                        <ellipse cx="70" cy="15" rx="15" ry="8" fill="#6b8e5a" opacity="0.2" />
                    </svg>
                </div>
            </motion.header>

            {/* Main Content */}
            <motion.main
                className="mx-auto max-w-md px-4 pb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showLoading ? 0 : 1, y: showLoading ? 20 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Card className="border-[#d4c5b9]/30 bg-white/70 shadow-2xl backdrop-blur-sm">


                    <CardHeader className="text-center">
                        <CardTitle className="font-serif text-3xl italic text-[#8b7355]">
                            ¡Bienvenido/s!
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed text-[#a89584]">
                            Nos hace mucha ilusión compartir este día contigo.
                            <br />
                            Por favor, introduce tu código de invitación.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Campo de código */}
                            <div>
                                <Label
                                    htmlFor="code"
                                    className="text-base uppercase tracking-wide text-[#8b7355]"
                                >
                                    Código de Invitación
                                </Label>

                                <Input
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value.toUpperCase())
                                    }
                                    className="mt-2 border-2 border-[#d4c5b9] text-center font-mono text-2xl uppercase tracking-widest focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20"
                                    placeholder=""
                                    maxLength={6}
                                    autoComplete="off"
                                    autoFocus
                                />

                                {errors.code && (
                                    <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        {errors.code}
                                    </div>
                                )}
                            </div>

                            {/* Botón de envío */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#8b7355] to-[#a89584] py-6 text-base font-medium uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Verificando...
                                    </span>
                                ) : (
                                    'Acceder'
                                )}
                            </Button>
                        </form>

                        {/* Ayuda */}
                        <div className="mt-6 border-t border-[#d4c5b9]/30 pt-6">
                            <div className="rounded-lg bg-[#faf8f5] p-4 text-center">
                                <p className="text-sm text-[#a89584]">
                                    💌 El código está escrito a mano en tu invitación.
                                    <br />
                                    <span className="mt-2 block text-xs">
                                        Si tienes problemas para acceder, contáctanos.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info adicional */}
            </motion.main>



            {/* Footer */}
            <motion.footer
                className="py-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: showLoading ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <p className="font-serif italic text-[#a89584]">
                    Con todo nuestro amor, Alex & Ana 🌴💝
                </p>
            </motion.footer>
        </div>
        </>
    );
}
