import { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function GuestDashboard({ group, questions, weddingInfo }) {
    const { flash } = usePage().props;
    const [step, setStep] = useState('initial'); // initial | form | declined | confirmed
    const [showFlash, setShowFlash] = useState(false);

    const isSubmitted = !!group.submitted_at;
    const allAttending = group.guests.every((g) => g.attending);

    useEffect(() => {
        if (isSubmitted) {
            setStep('confirmed');
        }
    }, [isSubmitted]);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    // Confirm form (attending)
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

    // Decline form
    const declineForm = useForm({
        attending: false,
    });

    // Question form
    const questionForm = useForm({
        message: '',
    });

    const submitAttending = (e) => {
        e.preventDefault();
        confirmForm.post(route('guest.confirm'), {
            onSuccess: () => setStep('confirmed'),
        });
    };

    const submitDecline = () => {
        declineForm.post(route('guest.confirm'), {
            onSuccess: () => setStep('confirmed'),
        });
    };

    const submitQuestion = (e) => {
        e.preventDefault();
        questionForm.post(route('guest.question'), {
            onSuccess: () => questionForm.reset('message'),
        });
    };

    const updateGuestAllergies = (index, allergies) => {
        const newGuests = [...confirmForm.data.guests];
        newGuests[index].allergies = allergies;
        confirmForm.setData('guests', newGuests);
    };

    const logout = () => {
        router.post(route('guest.logout'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#faf8f5] to-[#ede8e3]">
            <Head title={`Bienvenido/a ${group.name}`} />

            {/* Flash message */}
            {showFlash && flash?.success && (
                <div className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
                    <div className="rounded-lg bg-[#8b7355] px-6 py-3 text-sm text-white shadow-lg transition-all">
                        {flash.success}
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="pb-2 pt-10 text-center">
                <h1 className="font-serif text-5xl italic text-[#8b7355]">
                    A <span className="text-4xl">&</span> A
                </h1>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#a89584]">
                    20 de junio de 2026
                </p>
            </header>

            <main className="mx-auto max-w-lg space-y-8 px-5 pb-16 pt-6">
                {/* Saludo */}
                <div className="text-center">
                    <h2 className="font-serif text-3xl italic text-[#8b7355]">
                        ¡Hola, {group.name}!
                    </h2>
                    <p className="mt-2 text-[#a89584]">
                        Nos encantaría que nos acompañaseis en este día tan especial
                    </p>
                </div>

                {/* ─── STEP: Initial choice ─── */}
                {step === 'initial' && (
                    <div className="space-y-4 text-center">
                        <p className="text-sm text-[#a89584]">
                            {group.guests.length === 1
                                ? '¿Podrás venir?'
                                : `Sois ${group.guests.length} invitados. ¿Podréis venir?`}
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={() => setStep('form')}
                                className="group flex items-center justify-center gap-3 rounded-xl border-2 border-[#8b7355] bg-[#8b7355] px-8 py-4 text-lg font-medium text-white shadow-sm transition-all hover:bg-[#7a6448] hover:shadow-md"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {group.guests.length === 1 ? 'Asistiré' : 'Asistiremos'}
                            </button>
                            <button
                                onClick={() => setStep('declined')}
                                className="flex items-center justify-center gap-3 rounded-xl border-2 border-[#d4c5b9] bg-white px-8 py-4 text-lg font-medium text-[#a89584] transition-all hover:border-[#a89584] hover:shadow-md"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                No podremos asistir
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── STEP: Decline confirmation ─── */}
                {step === 'declined' && (
                    <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f1ed]">
                            <svg className="h-7 w-7 text-[#a89584]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 font-serif text-xl italic text-[#8b7355]">
                            Sentimos que no podáis venir
                        </h3>
                        <p className="mb-6 text-sm text-[#a89584]">
                            Os echaremos de menos. ¡Gracias por hacérnoslo saber!
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                onClick={submitDecline}
                                disabled={declineForm.processing}
                                className="bg-[#a89584] text-white hover:bg-[#8b7355]"
                            >
                                {declineForm.processing ? 'Enviando...' : 'Confirmar que no asistiremos'}
                            </Button>
                            <Button
                                onClick={() => setStep('initial')}
                                variant="ghost"
                                className="text-[#a89584]"
                            >
                                Volver
                            </Button>
                        </div>
                    </div>
                )}

                {/* ─── STEP: Attending form ─── */}
                {step === 'form' && (
                    <form onSubmit={submitAttending} className="space-y-6">
                        <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-4 text-center font-serif text-lg italic text-[#8b7355]">
                                Alergias o restricciones alimentarias
                            </h3>
                            <div className="space-y-4">
                                {group.guests.map((guest, index) => (
                                    <div key={guest.id}>
                                        <Label className="text-sm font-medium text-[#8b7355]">
                                            {guest.name}
                                        </Label>
                                        <Input
                                            value={confirmForm.data.guests[index].allergies}
                                            onChange={(e) => updateGuestAllergies(index, e.target.value)}
                                            className="mt-1 border-[#d4c5b9] bg-[#faf8f5] focus:border-[#8b7355] focus:ring-[#8b7355]"
                                            placeholder="Ninguna"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transport */}
                        <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-4 text-center font-serif text-lg italic text-[#8b7355]">
                                Transporte
                            </h3>
                            <RadioGroup
                                value={confirmForm.data.transport}
                                onValueChange={(value) => confirmForm.setData('transport', value)}
                                className="space-y-3"
                            >
                                <label
                                    htmlFor="t-autobus"
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                        confirmForm.data.transport === 'AUTOBUS'
                                            ? 'border-[#8b7355] bg-[#faf8f5]'
                                            : 'border-[#d4c5b9]/50 hover:border-[#a89584]'
                                    }`}
                                >
                                    <RadioGroupItem value="AUTOBUS" id="t-autobus" className="text-[#8b7355]" />
                                    <div>
                                        <span className="font-medium text-[#8b7355]">Autobús gratuito</span>
                                        <p className="text-xs text-[#a89584]">Horarios por confirmar</p>
                                    </div>
                                </label>

                                {confirmForm.data.transport === 'AUTOBUS' && (
                                    <div className="ml-4 space-y-2 rounded-lg bg-[#faf8f5] p-4">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="bus_onda_ida"
                                                checked={confirmForm.data.bus_onda_ida}
                                                onCheckedChange={(c) => confirmForm.setData('bus_onda_ida', c)}
                                                className="border-[#8b7355] data-[state=checked]:bg-[#8b7355]"
                                            />
                                            <Label htmlFor="bus_onda_ida" className="text-sm text-[#8b7355]">
                                                Bus desde Onda (ida)
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="bus_onda_vuelta"
                                                checked={confirmForm.data.bus_onda_vuelta}
                                                onCheckedChange={(c) => confirmForm.setData('bus_onda_vuelta', c)}
                                                className="border-[#8b7355] data-[state=checked]:bg-[#8b7355]"
                                            />
                                            <Label htmlFor="bus_onda_vuelta" className="text-sm text-[#8b7355]">
                                                Bus desde Onda (vuelta)
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="bus_cs"
                                                checked={confirmForm.data.bus_cs}
                                                onCheckedChange={(c) => confirmForm.setData('bus_cs', c)}
                                                className="border-[#8b7355] data-[state=checked]:bg-[#8b7355]"
                                            />
                                            <Label htmlFor="bus_cs" className="text-sm text-[#8b7355]">
                                                Bus desde Castellón
                                            </Label>
                                        </div>
                                    </div>
                                )}

                                <label
                                    htmlFor="t-coche"
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                        confirmForm.data.transport === 'COCHE'
                                            ? 'border-[#8b7355] bg-[#faf8f5]'
                                            : 'border-[#d4c5b9]/50 hover:border-[#a89584]'
                                    }`}
                                >
                                    <RadioGroupItem value="COCHE" id="t-coche" className="text-[#8b7355]" />
                                    <div>
                                        <span className="font-medium text-[#8b7355]">Coche propio</span>
                                        <p className="text-xs text-[#a89584]">Parking gratuito disponible</p>
                                    </div>
                                </label>
                            </RadioGroup>
                        </div>

                        {/* Contact */}
                        <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                            <h3 className="mb-4 text-center font-serif text-lg italic text-[#8b7355]">
                                Contacto <span className="text-sm font-normal text-[#a89584]">(opcional)</span>
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="contact_email" className="text-sm text-[#8b7355]">Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={confirmForm.data.contact_email}
                                        onChange={(e) => confirmForm.setData('contact_email', e.target.value)}
                                        className="mt-1 border-[#d4c5b9] bg-[#faf8f5] focus:border-[#8b7355]"
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
                                        className="mt-1 border-[#d4c5b9] bg-[#faf8f5] focus:border-[#8b7355]"
                                        placeholder="+34 600 000 000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                disabled={confirmForm.processing}
                                className="w-full rounded-xl bg-[#8b7355] py-6 text-base font-medium text-white shadow-sm transition-all hover:bg-[#7a6448] hover:shadow-md"
                            >
                                {confirmForm.processing ? 'Guardando...' : 'Confirmar asistencia'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep('initial')}
                                className="text-sm text-[#a89584] underline hover:text-[#8b7355]"
                            >
                                Volver
                            </button>
                        </div>
                    </form>
                )}

                {/* ─── STEP: Confirmed summary ─── */}
                {step === 'confirmed' && (
                    <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
                        {allAttending ? (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200">
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-serif text-2xl italic text-[#8b7355]">
                                    ¡Confirmación recibida!
                                </h3>
                                <p className="mb-1 text-[#a89584]">
                                    {group.guests.length === 1
                                        ? '1 persona asistirá'
                                        : `${group.guests.length} personas asistirán`}
                                </p>
                                <p className="mb-6 text-sm text-[#a89584]">
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
                                <h3 className="mb-2 font-serif text-2xl italic text-[#8b7355]">
                                    Respuesta registrada
                                </h3>
                                <p className="mb-6 text-sm text-[#a89584]">
                                    Lamentamos que no podáis acompañarnos. ¡Os echaremos de menos!
                                </p>
                            </>
                        )}
                        <button
                            onClick={() => setStep('initial')}
                            className="text-sm text-[#a89584] underline transition-colors hover:text-[#8b7355]"
                        >
                            Modificar respuesta
                        </button>
                    </div>
                )}

                {/* ─── Questions section (always visible when confirmed or initial) ─── */}
                {(step === 'confirmed' || step === 'initial') && (
                    <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                        <h3 className="mb-4 text-center font-serif text-lg italic text-[#8b7355]">
                            ¿Tenéis alguna duda?
                        </h3>
                        <form onSubmit={submitQuestion} className="space-y-3">
                            <Textarea
                                value={questionForm.data.message}
                                onChange={(e) => questionForm.setData('message', e.target.value)}
                                rows={3}
                                className="border-[#d4c5b9] bg-[#faf8f5] focus:border-[#8b7355] focus:ring-[#8b7355]"
                                placeholder="Escribe tu pregunta aquí..."
                            />
                            {questionForm.errors.message && (
                                <p className="text-xs text-red-500">{questionForm.errors.message}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={questionForm.processing || !questionForm.data.message.trim()}
                                className="w-full bg-[#a89584] text-white hover:bg-[#8b7355]"
                            >
                                {questionForm.processing ? 'Enviando...' : 'Enviar pregunta'}
                            </Button>
                        </form>

                        {questions.length > 0 && (
                            <div className="mt-6 border-t border-[#d4c5b9]/30 pt-4">
                                <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-[#a89584]">
                                    Preguntas anteriores
                                </h4>
                                <div className="space-y-3">
                                    {questions.map((q) => (
                                        <div key={q.id} className="rounded-lg bg-[#faf8f5] p-3">
                                            <p className="text-sm text-[#8b7355]">{q.message}</p>
                                            <p className="mt-1 text-xs text-[#a89584]">{q.created_at}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Event details ─── */}
                <div className="rounded-2xl border border-[#d4c5b9]/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                    <h3 className="mb-5 text-center font-serif text-lg italic text-[#8b7355]">
                        Detalles del evento
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-[#faf8f5] p-4 text-center">
                            <p className="text-xs uppercase tracking-wide text-[#a89584]">Fecha</p>
                            <p className="mt-1 font-serif text-sm font-medium text-[#8b7355]">
                                Sábado 20 de junio
                            </p>
                        </div>
                        <div className="rounded-xl bg-[#faf8f5] p-4 text-center">
                            <p className="text-xs uppercase tracking-wide text-[#a89584]">Lugar</p>
                            <p className="mt-1 font-serif text-sm font-medium text-[#8b7355]">
                                {weddingInfo.venue.name}
                            </p>
                            <a
                                href={weddingInfo.venue.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-xs text-[#a89584] underline"
                            >
                                Ver ubicación
                            </a>
                        </div>
                    </div>

                    <div className="mt-5 space-y-2">
                        {weddingInfo.schedule.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 rounded-lg bg-[#faf8f5] px-4 py-3">
                                <span className="w-12 flex-shrink-0 text-center font-serif text-sm font-medium text-[#8b7355]">
                                    {item.time}
                                </span>
                                <div className="h-4 w-px bg-[#d4c5b9]" />
                                <div>
                                    <p className="text-sm font-medium text-[#8b7355]">{item.event}</p>
                                    <p className="text-xs text-[#a89584]">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <div className="text-center">
                    <button
                        onClick={logout}
                        className="text-xs text-[#a89584] underline hover:text-[#8b7355]"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </main>
        </div>
    );
}
