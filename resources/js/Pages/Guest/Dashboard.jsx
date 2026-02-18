import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import CountdownTimer from '@/components/CountdownTimer';
import AnimatedTimeline from '@/components/AnimatedTimeline';
import RippleButton from '@/components/RippleButton';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import ScrollProgress from '@/components/ScrollProgress';
import ScrollToTop from '@/components/ScrollToTop';
import AnimatedHero from '@/components/AnimatedHero';
import FaqAccordion from '@/components/FaqAccordion';
import ProgramaDestacado from '@/components/ProgramaDestacado';
import {CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import Lottie from "lottie-react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

// ── Layout components (defined outside to avoid remount on every render) ──

function Section({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            className={`rounded-2xl border border-[#e2dbd3]/60 bg-white/70 p-6 shadow-[0_2px_16px_rgba(139,115,85,0.06)] backdrop-blur-sm ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
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
        <motion.div
            className="flex items-center justify-center gap-3 py-1"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <span className="h-px w-10 bg-[#d4c5b9]/50" />
            <span className="text-[10px] text-[#d4c5b9]">&#10047;</span>
            <span className="h-px w-10 bg-[#d4c5b9]/50" />
        </motion.div>
    );
}

// ── Main component ──

export default function GuestDashboard({ group, questions, faqs, weddingInfo }) {
    const { t, i18n } = useTranslation();
    const { flash } = usePage().props;
    const [step, setStep] = useState('initial');
    const [showFlash, setShowFlash] = useState(false);

    const isSubmitted = !!group.submitted_at;
    const allAttending = group.guests.every((g) => g.attending);
    const isSingle = group.guests.length === 1;

    const currentLang = i18n.language;

    // Localizar el programa del día
    const localizedSchedule = (currentLang !== 'es' && weddingInfo.schedule_translations?.[currentLang])
        ? weddingInfo.schedule_translations[currentLang]
        : weddingInfo.schedule;

    // Localizar las FAQs
    const localizedFaqs = (faqs || []).map((faq) => {
        const tr = faq.translations?.[currentLang];
        if (!tr) return faq;
        return { ...faq, question: tr.question, answer: tr.answer };
    });

    const [noviosAnimation, setNoviosAnimation] = useState(null);
    const flashTimerRef = useRef(null);

    // Aplicar idioma por defecto del grupo si el usuario no ha elegido manualmente
    useEffect(() => {
        if (group.default_language && !localStorage.getItem('lang-user-chosen')) {
            i18n.changeLanguage(group.default_language);
            localStorage.setItem('i18nextLng', group.default_language);
        }
    }, []);

    useEffect(() => {
        // Cargar la animación de novios
        fetch('/animations/noviosoutlined.json')
            .then(response => response.json())
            .then(data => setNoviosAnimation(data))
            .catch(err => console.log('Error cargando animación:', err));
    }, []);

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
            {/* Scroll Progress Bar */}
            <ScrollProgress />

            {/* Scroll to Top Button */}
            <ScrollToTop />

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
                <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1ed]/95 via-[#faf8f5]/92 to-[#f0ebe5]/95" />
            </div>

            <div className="min-h-screen">

                <Head title={`${t('dashboard.greeting', { name: group.name })}`} />

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
            <AnimatedHero />

            <motion.main
                className="mx-auto max-w-lg space-y-6 px-5 pb-20 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                {/* ── Saludo ── */}
                <motion.div
                    className="text-center space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div>
                        <h2 className="font-serif text-2xl italic text-[#8b7355]">
                            {t('dashboard.greeting', { name: group.name })}
                        </h2>
                        <p className="mt-1.5 text-sm text-[#a89584]">
                            {t('dashboard.greeting_sub')}
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                    >
                        <div style={{marginTop: '3rem', marginBottom: '3rem'}}>
                            <CountdownTimer targetDate="2026-06-20T00:00:00" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* ── Link a Nuestra Historia ── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Link
                        href={route('guest.our-story')}
                        className="group block rounded-2xl border border-[#e2dbd3]/60 bg-white/70 p-5 shadow-[0_2px_16px_rgba(139,115,85,0.06)] backdrop-blur-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b7355]/10 text-xl">
                                    💕
                                </span>
                                <div>
                                    <h3 className="font-serif text-base italic text-[#8b7355]">
                                        {t('dashboard.our_story_title')}
                                    </h3>
                                    <p className="text-xs text-[#a89584]">
                                        {t('dashboard.our_story_sub')}
                                    </p>
                                </div>
                            </div>
                            <svg className="h-5 w-5 text-[#c4a571] transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </Link>
                </motion.div>

                {/* ── Banner de recordatorio si no ha confirmado ── */}
                {!isSubmitted && (
                    <motion.div
                        className="rounded-xl bg-gradient-to-r from-[#8b7355] to-[#a89584] p-4 text-center shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-sm font-medium text-white">
                                {t('dashboard.reminder')}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════
                     1. CONFIRMACIÓN DE ASISTENCIA
                     ══════════════════════════════════════════ */}

                {/* ── Initial choice ── */}
                {step === 'initial' && (
                    <Section>
                        <SectionTitle>{t('dashboard.confirm_title')}</SectionTitle>
                        <motion.p
                            className="mb-5 text-center text-sm text-[#a89584]"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {isSingle
                                ? t('dashboard.confirm_single_question')
                                : t('dashboard.confirm_group_question', { count: group.guests.length })}
                        </motion.p>
                        <motion.div
                            className="flex flex-col gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        >
                            <RippleButton
                                onClick={() => setStep('form')}
                                className="flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-medium shadow-lg"
                                variant="primary"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {isSingle ? t('dashboard.attend_single') : t('dashboard.attend_plural')}
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
                                {declineForm.processing ? t('dashboard.sending') : t('dashboard.decline')}
                            </RippleButton>
                        </motion.div>
                        <motion.p
                            className="mt-4 text-center text-xs text-[#b5a594]"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            {t('dashboard.deadline')}
                        </motion.p>
                    </Section>
                )}

                {/* ── Attending form ── */}
                {step === 'form' && (
                    <form onSubmit={submitAttending} className="space-y-5">
                        {/* Allergies */}
                        <Section>
                            <SectionTitle>{t('dashboard.allergies_title')}</SectionTitle>
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
                                            placeholder={t('dashboard.allergies_placeholder')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Transport */}
                        <Section>
                            <SectionTitle>{t('dashboard.transport_title')}</SectionTitle>
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
                                        <span className="text-sm font-medium text-[#8b7355]">{t('dashboard.transport_bus')}</span>
                                        <p className="text-xs text-[#b5a594]">{t('dashboard.transport_bus_hint')}</p>
                                    </div>
                                </label>

                                {confirmForm.data.transport === 'AUTOBUS' && (
                                    <div className="ml-4 space-y-2.5 rounded-xl bg-[#faf8f5] p-4">
                                        {[
                                            { id: 'bus_onda_ida', label: t('dashboard.transport_bus_onda_ida'), key: 'bus_onda_ida' },
                                            { id: 'bus_onda_vuelta', label: t('dashboard.transport_bus_onda_vuelta'), key: 'bus_onda_vuelta' },
                                            { id: 'bus_cs', label: t('dashboard.transport_bus_cs'), key: 'bus_cs' },
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
                                        <span className="text-sm font-medium text-[#8b7355]">{t('dashboard.transport_car')}</span>
                                        <p className="text-xs text-[#b5a594]">{t('dashboard.transport_car_hint')}</p>
                                    </div>
                                </label>
                            </RadioGroup>
                        </Section>

                        {/* Contact */}
                        <Section>
                            <SectionTitle>
                                {t('dashboard.contact_title')} <span className="text-sm font-normal not-italic text-[#b5a594]">{t('dashboard.contact_optional')}</span>
                            </SectionTitle>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="contact_email" className="text-sm text-[#8b7355]">{t('dashboard.contact_email')}</Label>
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
                                    <Label htmlFor="contact_phone" className="text-sm text-[#8b7355]">{t('dashboard.contact_phone')}</Label>
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
                                {confirmForm.processing ? t('dashboard.confirm_saving') : t('dashboard.confirm_submit')}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep('initial')}
                                className="block w-full py-2 text-center text-sm text-[#a89584] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                            >
                                {t('dashboard.back')}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── Confirmed summary ── */}
                {step === 'confirmed' && (
                    <Section className="text-center">
                        {allAttending ? (
                            <>
                                <motion.div
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100"
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut", type: "spring" }}
                                >
                                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </motion.div>
                                <motion.h3
                                    className="mb-1 font-serif text-2xl italic text-[#8b7355]"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {t('dashboard.confirmed_attending_title')}
                                </motion.h3>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <p className="text-sm text-[#a89584]">
                                        {isSingle
                                            ? t('dashboard.confirmed_attending_single')
                                            : t('dashboard.confirmed_attending_plural', { count: group.guests.length })}
                                    </p>
                                    <p className="mt-1 text-sm text-[#a89584]">
                                        {t('dashboard.confirmed_attending_see_you')}
                                    </p>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f1ed]"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                                >
                                    <svg className="h-8 w-8 text-[#a89584]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </motion.div>
                                <motion.h3
                                    className="mb-1 font-serif text-2xl italic text-[#8b7355]"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {t('dashboard.confirmed_decline_title')}
                                </motion.h3>
                                <motion.p
                                    className="text-sm text-[#a89584]"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    {t('dashboard.confirmed_decline_text')}
                                </motion.p>
                            </>
                        )}
                        <motion.button
                            onClick={() => setStep('initial')}
                            className="mt-5 inline-block text-sm text-[#a89584] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {t('dashboard.modify_response')}
                        </motion.button>
                        <motion.p
                            className="mt-2 text-xs text-[#b5a594]"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            {t('dashboard.deadline')}
                        </motion.p>
                    </Section>
                )}

                <Divider />

                {/* ══════════════════════════════════════════
                     2. DETALLES DEL EVENTO
                     ══════════════════════════════════════════ */}
                <Section>
                    <SectionTitle>{t('dashboard.event_title')}</SectionTitle>

                    <div className="grid grid-cols-2 gap-3">
                        <motion.div
                            className="rounded-xl bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] p-4 text-center"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        >
                            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                                <svg className="h-4 w-4 text-[#8b7355]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <p className="text-[10px] uppercase tracking-wider text-[#b5a594]">{t('dashboard.event_date_label')}</p>
                            <p className="mt-0.5 text-sm font-medium text-[#8b7355]">
                                {t('dashboard.event_date_value')}
                            </p>
                        </motion.div>
                        <motion.div
                            className="rounded-xl bg-gradient-to-br from-[#faf8f5] to-[#f5f1ed] p-4 text-center"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
                                <svg className="h-4 w-4 text-[#8b7355]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <p className="text-[10px] uppercase tracking-wider text-[#b5a594]">{t('dashboard.event_venue_label')}</p>
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
                                {t('dashboard.event_venue_link')}
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>

                </Section>

                <Divider />

                {/* ══════════════════════════════════════════
                     PROGRAMA DEL DÍA
                     ══════════════════════════════════════════ */}
                <Section delay={0.1}>
                    <SectionTitle>{t('dashboard.program_title')}</SectionTitle>
                    <p className="mb-6 text-center text-sm text-[#a89584]">
                        {t('dashboard.program_sub')}
                    </p>
                    <ProgramaDestacado schedule={localizedSchedule} />
                </Section>


                {/* ══════════════════════════════════════════
                     3. PREGUNTAS / DUDAS
                     ══════════════════════════════════════════ */}
                <Section>
                    <SectionTitle>{t('dashboard.questions_title')}</SectionTitle>
                    <p className="mb-4 text-center text-sm text-[#a89584]">
                        {t('dashboard.questions_sub')}
                    </p>
                    <form onSubmit={submitQuestion} className="space-y-3">
                        <Textarea
                            value={questionForm.data.message}
                            onChange={(e) => questionForm.setData('message', e.target.value)}
                            rows={3}
                            className="border-[#e2dbd3] bg-[#faf8f5] transition-colors focus:border-[#8b7355] focus:ring-[#8b7355]/20"
                            placeholder={t('dashboard.questions_placeholder')}
                        />
                        {questionForm.errors.message && (
                            <p className="text-xs text-red-500">{questionForm.errors.message}</p>
                        )}
                        <Button
                            type="submit"
                            disabled={questionForm.processing || !questionForm.data.message.trim()}
                            className="w-full bg-[#a89584] text-white transition-all hover:bg-[#8b7355]"
                        >
                            {questionForm.processing ? t('dashboard.questions_sending') : t('dashboard.questions_submit')}
                        </Button>
                    </form>

                    {questions.length > 0 && (
                        <div className="mt-6 border-t border-[#e2dbd3]/60 pt-4">
                            <h4 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-[#b5a594]">
                                {t('dashboard.previous_questions')}
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
                            <SectionTitle>{t('dashboard.faqs_title')}</SectionTitle>
                            <p className="mb-4 text-center text-sm text-[#a89584]">
                                {t('dashboard.faqs_sub')}
                            </p>
                            <FaqAccordion faqs={localizedFaqs} />
                        </Section>
                    </>
                )}

                {/* ── Logout + Selector de idioma ── */}
                <motion.div
                    className="pt-2 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <LanguageSelector />
                    <button
                        onClick={logout}
                        className="text-xs text-[#b5a594] underline underline-offset-2 transition-colors hover:text-[#8b7355]"
                    >
                        {t('dashboard.logout')}
                    </button>
                </motion.div>
            </motion.main>
        </div>
        </>
    );
}
