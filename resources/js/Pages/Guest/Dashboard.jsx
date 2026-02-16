import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import LoadingScreen from '@/components/LoadingScreen';
import MusicPlayer from '@/components/MusicPlayer';
import CountdownTimer from '@/components/CountdownTimer';
import AnimatedTimeline from '@/components/AnimatedTimeline';
import RippleButton from '@/components/RippleButton';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';
import AnimatedHero from '@/components/AnimatedHero';
import FaqAccordion from '@/components/FaqAccordion';
import ProgramaDestacado from '@/components/ProgramaDestacado';

// ── Layout components (defined outside to avoid remount on every render) ──

function Section({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            className={`rounded-2xl border border-[#e2dbd3]/60 bg-white/70 p-6 shadow-[0_2px_16px_rgba(139,115,85,0.06)] backdrop-blur-sm ${className}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
}

function SectionTitle({ children }) {
    return (
        <h3 className="mb-5 text-center font-serif text-xl italic text-[#8b7355]">{children}</h3>
    );
}

function Divider() {
    return (
        <div className="flex items-center justify-center gap-3 py-1">
            <span className="h-px w-10 bg-[#d4c5b9]/50" />
            <span className="text-[10px] text-[#d4c5b9]">&#10047;</span>
            <span className="h-px w-10 bg-[#d4c5b9]/50" />
        </div>
    );
}

// ── Main component ──

export default function GuestDashboard({ group, questions, faqs, weddingInfo }) {
    const { flash } = usePage().props;
    const [step, setStep] = useState('initial');
    const [showFlash, setShowFlash] = useState(false);
    const [showLoading, setShowLoading] = useState(true);

    const isSubmitted = !!group.submitted_at;
    const allAttending = group.guests.every((g) => g.attending);
    const isSingle = group.guests.length === 1;

    // Función para disparar confetti
    const triggerConfetti = () => {
        const duration = 3000;
        const colors = ['#8b7355', '#d4c5b9', '#f5f1ed', '#c4a571'];

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
        });

        // Segundo disparo después de 200ms
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });
        }, 400);
    };

    useEffect(() => {
        if (isSubmitted) setStep('confirmed');
    }, [isSubmitted]);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash?.success]);

    const confirmForm = useForm({
        attending: true,
        guests: group.guests.map((g) => ({
            id: g.id,
            allergies: g.allergies || '',
        })),
        transport: group.transport || 'NO_CONFIRMADO',
        bus_onda_ida: group.bus_onda_ida || false,
        bus_onda_vuelta: group.bus_onda_vuelta || false,
        bus_cs: group.bus_cs || false,
        contact_email: group.contact_email || '',
        contact_phone: group.contact_phone || '',
    });

    const declineForm = useForm({ attending: false });
    const questionForm = useForm({ message: '' });

    const submitAttending = (e) => {
        e.preventDefault();
        confirmForm.post(route('guest.confirm'), {
            preserveScroll: true,
            onSuccess: () => {
                setStep('confirmed');
                // Disparar confetti cuando confirman asistencia
                setTimeout(triggerConfetti, 300);
            },
        });
    };

    const submitDecline = () => {
        declineForm.post(route('guest.confirm'), {
            preserveScroll: true,
            onSuccess: () => setStep('confirmed'),
        });
    };

    const submitQuestion = (e) => {
        e.preventDefault();
        questionForm.post(route('guest.question'), {
            preserveScroll: true,
            onSuccess: () => questionForm.reset('message'),
        });
    };

    const updateGuestAllergies = (index, allergies) => {
        const g = [...confirmForm.data.guests];
        g[index].allergies = allergies;
        confirmForm.setData('guests', g);
    };

    const logout = () => router.post(route('guest.logout'));

    return (
        <>
            {/* Loading Screen */}
            <AnimatePresence>
                {showLoading && (
                    <LoadingScreen onComplete={() => setTimeout(() => setShowLoading(false), 2000)} />
                )}
            </AnimatePresence>

            {/* Scroll Progress Bar */}
            {!showLoading && <ScrollProgress />}

            {/* Scroll to Top Button */}
            {!showLoading && <ScrollToTop />}

            {/* Music Player - solo se muestra cuando termina el loading */}
            {!showLoading && (
                <MusicPlayer audioUrl="/audio/wedding-music.mp3" />
            )}

            <div className="min-h-screen bg-gradient-to-b from-[#f5f1ed] via-[#faf8f5] to-[#f0ebe5]">
                <Head title={`Bienvenido/a ${group.name}`} />

            {/* ── Flash toast ── */}
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

            {/* ── Header with Typewriter Animation ── */}
            <AnimatedHero showLoading={showLoading} />

            <motion.main
                className="mx-auto max-w-lg space-y-6 px-5 pb-20 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: showLoading ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                {/* ── Saludo ── */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-serif text-2xl italic text-[#8b7355]">
                        ¡Hola, {group.name}!
                    </h2>
                    <p className="mt-1.5 text-sm text-[#a89584]">
                        Nos encantaría que nos acompañaseis en este día tan especial
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                     1. DETALLES DEL EVENTO
                     ══════════════════════════════════════════ */}
                <Section>
                    <SectionTitle>Detalles del evento</SectionTitle>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] p-4 text-center">
                            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                                <svg className="h-4 w-4 text-[#8b7355]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <p className="text-[10px] uppercase tracking-wider text-[#b5a594]">Fecha</p>
                            <p className="mt-0.5 text-sm font-medium text-[#8b7355]">
                                Sábado, 20 de junio
                            </p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] p-4 text-center">
                            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                                <svg className="h-4 w-4 text-[#8b7355]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] uppercase tracking-wider text-[#b5a594]">Lugar</p>
                            <p className="mt-0.5 text-sm font-medium text-[#8b7355]">
                                {weddingInfo.venue.name}
                            </p>
                            <p className="text-[11px] text-[#b5a594]">{weddingInfo.venue.address}</p>
                            <a
                                href={weddingInfo.venue.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#8b7355] underline underline-offset-2"
                            >
                                Ver ubicación
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </Section>

                <Divider />

                {/* ══════════════════════════════════════════
                     PROGRAMA DEL DÍA - SECCIÓN DESTACADA
                     ══════════════════════════════════════════ */}
                <Section delay={0.1}>
                    <SectionTitle>Programa del Día</SectionTitle>
                    <p className="mb-6 text-center text-sm text-[#a89584]">
                        El orden del día para que no os perdáis nada
                    </p>
                    <ProgramaDestacado schedule={weddingInfo.schedule} />
                </Section>

                <Divider />

                {/* ══════════════════════════════════════════
                     2. CONFIRMACIÓN
                     ══════════════════════════════════════════ */}

                {/* ── Initial choice ── */}
                {step === 'initial' && (
                    <Section>
                        <SectionTitle>Confirma tu asistencia</SectionTitle>
                        <p className="mb-5 text-center text-sm text-[#a89584]">
                            {isSingle
                                ? '¿Podrás venir?'
                                : `Sois ${group.guests.length} invitados. ¿Podréis venir?`}
                        </p>
                        <div className="flex flex-col gap-3">
                            <RippleButton
                                onClick={() => setStep('form')}
                                className="flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-medium shadow-lg"
                                variant="primary"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {isSingle ? 'Asistiré' : 'Asistiremos'}
                            </RippleButton>
                            <RippleButton
                                onClick={submitDecline}
                                disabled={declineForm.processing}
                                className="flex items-center justify-center gap-3 rounded-xl py-3.5 text-base"
                                variant="secondary"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {declineForm.processing ? 'Enviando...' : 'No podremos asistir'}
                            </RippleButton>
                        </div>
                        <p className="mt-4 text-center text-xs text-[#b5a594]">
                            Podéis modificar vuestra respuesta hasta el 1 de mayo
                        </p>
                    </Section>
                )}

                {/* ── Attending form ── */}
                {step === 'form' && (
                    <form onSubmit={submitAttending} className="space-y-5">
                        {/* Allergies */}
                        <Section>
                            <SectionTitle>Alergias alimentarias</SectionTitle>
                            <div className="space-y-4">
                                {group.guests.map((guest, index) => (
                                    <div key={guest.id}>
                                        <Label className="text-sm font-medium text-[#8b7355]">
                                            {guest.name}
                                        </Label>
                                        <Input
                                            value={confirmForm.data.guests[index].allergies}
                                            onChange={(e) => updateGuestAllergies(index, e.target.value)}
                                            className="mt-1.5 border-[#e2dbd3] bg-[#faf8f5] transition-colors focus:border-[#8b7355] focus:ring-[#8b7355]/20"
                                            placeholder="Ninguna"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Transport */}
                        <Section>
                            <SectionTitle>Transporte</SectionTitle>
                            <RadioGroup
                                value={confirmForm.data.transport}
                                onValueChange={(v) => confirmForm.setData('transport', v)}
                                className="space-y-3"
                            >
                                <label
                                    htmlFor="t-autobus"
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                                        confirmForm.data.transport === 'AUTOBUS'
                                            ? 'border-[#8b7355] bg-[#faf8f5] shadow-sm'
                                            : 'border-[#e2dbd3] hover:border-[#c4b5a4]'
                                    }`}
                                >
                                    <RadioGroupItem value="AUTOBUS" id="t-autobus" className="text-[#8b7355]" />
                                    <div>
                                        <span className="text-sm font-medium text-[#8b7355]">Autobús gratuito</span>
                                        <p className="text-xs text-[#b5a594]">Horarios por confirmar</p>
                                    </div>
                                </label>

                                {confirmForm.data.transport === 'AUTOBUS' && (
                                    <div className="ml-4 space-y-2.5 rounded-xl bg-[#faf8f5] p-4">
                                        {[
                                            { id: 'bus_onda_ida', label: 'Bus desde Onda (ida)', key: 'bus_onda_ida' },
                                            { id: 'bus_onda_vuelta', label: 'Bus desde Onda (vuelta)', key: 'bus_onda_vuelta' },
                                            { id: 'bus_cs', label: 'Bus desde Castellón', key: 'bus_cs' },
                                        ].map((bus) => (
                                            <div key={bus.id} className="flex items-center gap-2.5">
                                                <AnimatedCheckbox
                                                    id={bus.id}
                                                    checked={confirmForm.data[bus.key]}
                                                    onCheckedChange={(c) => confirmForm.setData(bus.key, c)}
                                                    className="border-[#8b7355] data-[state=checked]:bg-[#8b7355]"
                                                />
                                                <Label htmlFor={bus.id} className="text-sm text-[#8b7355]">
                                                    {bus.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <label
                                    htmlFor="t-coche"
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                                        confirmForm.data.transport === 'COCHE'
                                            ? 'border-[#8b7355] bg-[#faf8f5] shadow-sm'
                                            : 'border-[#e2dbd3] hover:border-[#c4b5a4]'
                                    }`}
                                >
                                    <RadioGroupItem value="COCHE" id="t-coche" className="text-[#8b7355]" />
                                    <div>
                                        <span className="text-sm font-medium text-[#8b7355]">Coche propio</span>
                                        <p className="text-xs text-[#b5a594]">Parking gratuito disponible</p>
                                    </div>
                                </label>
                            </RadioGroup>
                        </Section>

                        {/* Contact */}
                        <Section>
                            <SectionTitle>
                                Contacto <span className="text-sm font-normal not-italic text-[#b5a594]">(opcional)</span>
                            </SectionTitle>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="contact_email" className="text-sm text-[#8b7355]">Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={confirmForm.data.contact_email}
                                        onChange={(e) => confirmForm.setData('contact_email', e.target.value)}
                                        className="mt-1.5 border-[#e2dbd3] bg-[#faf8f5] transition-colors focus:border-[#8b7355]"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contact_phone" className="text-sm text-[#8b7355]">Teléfono</Label>
                                    <Input
                                        id="contact_phone"
                                        type="tel"
                                        value={confirmForm.data.contact_phone}
                                        onChange={(e) => confirmForm.setData('contact_phone', e.target.value)}
                                        className="mt-1.5 border-[#e2dbd3] bg-[#faf8f5] transition-colors focus:border-[#8b7355]"
                                        placeholder="+34 600 000 000"
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Submit */}
                        <div className="space-y-2.5 pt-1">
                            <Button
                                type="submit"
                                disabled={confirmForm.processing}
                                className="w-full rounded-xl bg-[#8b7355] py-6 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#7a6448] hover:shadow-lg active:scale-[0.98]"
                            >
                                {confirmForm.processing ? 'Guardando...' : 'Confirmar asistencia'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep('initial')}
                                className="block w-full py-2 text-center text-sm text-[#a89584] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                            >
                                Volver
                            </button>
                        </div>
                    </form>
                )}

                {/* ── Confirmed summary ── */}
                {step === 'confirmed' && (
                    <Section className="text-center">
                        {allAttending ? (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">
                                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="mb-1 font-serif text-2xl italic text-[#8b7355]">
                                    ¡Confirmación recibida!
                                </h3>
                                <p className="text-sm text-[#a89584]">
                                    {isSingle ? '1 persona asistirá' : `${group.guests.length} personas asistirán`}
                                </p>
                                <p className="mt-1 text-sm text-[#a89584]">
                                    ¡Nos vemos el 20 de junio!
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f1ed]">
                                    <svg className="h-8 w-8 text-[#a89584]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </div>
                                <h3 className="mb-1 font-serif text-2xl italic text-[#8b7355]">
                                    Respuesta registrada
                                </h3>
                                <p className="text-sm text-[#a89584]">
                                    Lamentamos que no podáis acompañarnos. ¡Os echaremos de menos!
                                </p>
                            </>
                        )}
                        <button
                            onClick={() => setStep('initial')}
                            className="mt-5 inline-block text-sm text-[#a89584] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                        >
                            Modificar respuesta
                        </button>
                        <p className="mt-2 text-xs text-[#b5a594]">
                            Podéis modificar vuestra respuesta hasta el 1 de mayo
                        </p>
                    </Section>
                )}

                <Divider />

                {/* ══════════════════════════════════════════
                     3. PREGUNTAS / DUDAS  (always visible)
                     ══════════════════════════════════════════ */}
                <Section>
                    <SectionTitle>¿Tenéis alguna duda?</SectionTitle>
                    <p className="mb-4 text-center text-sm text-[#a89584]">
                        Escríbenos y os contestaremos lo antes posible
                    </p>
                    <form onSubmit={submitQuestion} className="space-y-3">
                        <Textarea
                            value={questionForm.data.message}
                            onChange={(e) => questionForm.setData('message', e.target.value)}
                            rows={3}
                            className="border-[#e2dbd3] bg-[#faf8f5] transition-colors focus:border-[#8b7355] focus:ring-[#8b7355]/20"
                            placeholder="Escribe tu pregunta aquí..."
                        />
                        {questionForm.errors.message && (
                            <p className="text-xs text-red-500">{questionForm.errors.message}</p>
                        )}
                        <Button
                            type="submit"
                            disabled={questionForm.processing || !questionForm.data.message.trim()}
                            className="w-full bg-[#a89584] text-white transition-all hover:bg-[#8b7355]"
                        >
                            {questionForm.processing ? 'Enviando...' : 'Enviar pregunta'}
                        </Button>
                    </form>

                    {questions.length > 0 && (
                        <div className="mt-6 border-t border-[#e2dbd3]/60 pt-4">
                            <h4 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-[#b5a594]">
                                Preguntas anteriores
                            </h4>
                            <div className="space-y-2.5">
                                {questions.map((q) => (
                                    <div key={q.id} className="rounded-lg bg-[#faf8f5] p-3">
                                        <p className="text-sm text-[#8b7355]">{q.message}</p>
                                        <p className="mt-1 text-[11px] text-[#b5a594]">{q.created_at}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Section>

                {/* ══════════════════════════════════════════
                     4. PREGUNTAS FRECUENTES (FAQ)
                     ══════════════════════════════════════════ */}
                {faqs && faqs.length > 0 && (
                    <>
                        <Divider />
                        <Section delay={0.1}>
                            <SectionTitle>Preguntas Frecuentes</SectionTitle>
                            <p className="mb-4 text-center text-sm text-[#a89584]">
                                Respuestas a las dudas más comunes
                            </p>
                            <FaqAccordion faqs={faqs} />
                        </Section>
                    </>
                )}

                {/* ── Logout ── */}
                <div className="pt-4 text-center">
                    <button
                        onClick={logout}
                        className="text-xs text-[#b5a594] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </motion.main>
        </div>
        </>
    );
}
