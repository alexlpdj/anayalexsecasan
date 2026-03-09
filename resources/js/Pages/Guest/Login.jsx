import { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

function WelcomeOverlay({ onEnter }) {
    const { t } = useTranslation();
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/animations/anillos.json')
            .then(r => r.json())
            .then(data => setAnimationData(data))
            .catch(() => {});
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#f5f1ed] via-[#faf8f5] to-[#f0ebe5]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
        >
            <div className="text-center px-6">
                <motion.h1
                    className="font-serif text-8xl italic leading-none text-[#8b7355]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A <span className="mx-2 text-7xl font-light">&</span> A
                </motion.h1>

                <motion.div
                    className="mx-auto mt-6 flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                    <span className="text-xs text-[#d4c5b9]">&#10047;</span>
                    <span className="h-px w-12 bg-[#d4c5b9]" />
                </motion.div>

                <motion.p
                    className="mt-4 text-sm uppercase tracking-[0.25em] text-[#a89584]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                >
                    {t('login.welcome_date')}
                </motion.p>

                <motion.div
                    className="mx-auto mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                >
                    {animationData ? (
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            style={{ width: 120, height: 120, margin: '0 auto' }}
                        />
                    ) : (
                        <div className="flex gap-1.5 justify-center" style={{ height: 120 }}>
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="h-2 w-2 rounded-full bg-[#8b7355] self-center"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.button
                    onClick={onEnter}
                    className="mt-6 rounded-full border-2 border-[#8b7355] bg-transparent px-10 py-3 font-serif text-lg italic text-[#8b7355] transition-all hover:bg-[#8b7355] hover:text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {t('login.welcome_button')}
                </motion.button>
            </div>
        </motion.div>
    );
}

export default function GuestLogin() {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [showWelcome, setShowWelcome] = useState(true);
    const [showFlash, setShowFlash] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });
    const inputRef = useRef(null);
    const flashTimerRef = useRef(null);

    useEffect(() => {
        return router.on('success', (event) => {
            const { flash: newFlash } = event.detail.page.props;
            if (newFlash?.success) {
                if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
                setShowFlash(true);
                flashTimerRef.current = setTimeout(() => setShowFlash(false), 4000);
            }
        });
    }, []);

    const handleInputFocus = () => {
        // Esperar a que el teclado móvil termine de aparecer antes de hacer scroll
        setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
    };

    const handleEnter = () => {
        document.dispatchEvent(new Event('startMusic'));
        setShowWelcome(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('guest.login.post'));
    };

    return (
        <>
            {/* Overlay de bienvenida — requiere interacción para arrancar la música */}
            <AnimatePresence>
                {showWelcome && <WelcomeOverlay onEnter={handleEnter} />}
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
                <Head title={t('login.page_title')} />

                {/* Flash toast */}
                <div
                    className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 ${
                        showFlash && flash?.success
                            ? 'translate-y-4 opacity-100'
                            : '-translate-y-full opacity-0'
                    }`}
                >
                    <div className="rounded-full bg-[#8b7355] px-6 py-2.5 text-sm font-medium text-white shadow-lg">
                        {flash?.success}
                    </div>
                </div>

                {/* Header decorativo */}
                <motion.header
                    className="relative py-8 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: showWelcome ? 0 : 1, y: showWelcome ? -20 : 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                <div className="mx-auto max-w-5xl px-4">
                    <h1 className="mb-2 font-serif text-5xl italic text-[#8b7355]">
                        A <span className="text-4xl">&</span> A
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#a89584]">
                        {t('login.date_header')}
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
                className="mx-auto max-w-md px-4 pb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showWelcome ? 0 : 1, y: showWelcome ? 20 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Card className="border-[#d4c5b9]/30 bg-white/70 shadow-2xl backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="font-serif text-3xl italic text-[#8b7355]">
                            {t('login.title')}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed text-[#a89584]">
                            {t('login.subtitle')}
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
                                    {t('login.code_label')}
                                </Label>

                                <Input
                                    ref={inputRef}
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value.toUpperCase())
                                    }
                                    onFocus={handleInputFocus}
                                    className="mt-2 border-2 border-[#d4c5b9] text-center font-mono text-2xl uppercase tracking-widest focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20"
                                    placeholder=""
                                    maxLength={4}
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
                                        {t('login.submit_verifying')}
                                    </span>
                                ) : (
                                    t('login.submit')
                                )}
                            </Button>
                        </form>

                        {/* Ayuda */}
                        <div className="mt-3 border-t border-[#d4c5b9]/30 pt-3">
                            <div className="rounded-lg bg-[#faf8f5] p-4 text-center">
                                <p className="text-sm text-[#a89584]">
                                    {t('login.help_text')}
                                </p>
                            </div>
                        </div>

                        {/* Selector de idioma */}
                        <div className="mt-4 flex justify-center">
                            <LanguageSelector />
                        </div>
                    </CardContent>
                </Card>
            </motion.main>

            {/* Footer */}
            <motion.footer
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: showWelcome ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <p className="font-serif italic text-[#a89584]">
                    {t('login.footer')}
                </p>
            </motion.footer>
        </div>
        </>
    );
}
