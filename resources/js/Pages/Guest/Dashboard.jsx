import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuestDashboard({ group, weddingInfo }) {
    const [showForm, setShowForm] = useState(!group.confirmed_at);

    const { data, setData, post, processing, errors } = useForm({
        guests: group.guests.map((g) => ({
            id: g.id,
            attending: g.attending ?? true,
            allergies: g.allergies || '',
        })),
        transport: group.transport || 'NO_CONFIRMADO',
        bus_onda_ida: group.bus_onda_ida || false,
        bus_onda_vuelta: group.bus_onda_vuelta || false,
        bus_cs: group.bus_cs || false,
        contact_email: group.contact_email || '',
        contact_phone: group.contact_phone || '',
    });

    const updateGuestAttending = (index, attending) => {
        const newGuests = [...data.guests];
        newGuests[index].attending = attending;
        setData('guests', newGuests);
    };

    const updateGuestAllergies = (index, allergies) => {
        const newGuests = [...data.guests];
        newGuests[index].allergies = allergies;
        setData('guests', newGuests);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('guest.confirm'), {
            onSuccess: () => setShowForm(false),
        });
    };

    const logout = () => {
        router.post(route('guest.logout'));
    };

    const attendingCount = data.guests.filter((g) => g.attending).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#faf8f5] to-[#ede8e3]">
            <Head title={`Bienvenido/a ${group.name}`} />

            {/* Header */}
            <header className="relative py-8 text-center">
                <div className="mx-auto max-w-6xl px-4">
                    <h1 className="mb-2 font-serif text-5xl italic text-[#8b7355]">
                        A <span className="text-4xl">&</span> A
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#a89584]">
                        22 • Junio • 2026
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-4xl space-y-8 px-4 pb-12">
                {/* Saludo */}
                <div className="text-center">
                    <h2 className="mb-3 font-serif text-4xl italic text-[#8b7355]">
                        ¡Hola, {group.name}!
                    </h2>
                    <p className="text-lg text-[#a89584]">
                        Nos encantaría que nos acompañéis en este día tan especial
                    </p>
                </div>

                {/* Estado de confirmación o formulario */}
                {group.confirmed_at && !showForm ? (
                    <Card className="border-green-200 bg-white/70 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                                    <svg
                                        className="h-8 w-8 text-white"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-serif text-2xl italic text-green-700">
                                    ¡Confirmación Recibida!
                                </h3>
                                <p className="mb-4 text-[#a89584]">
                                    Gracias por confirmar. {attendingCount > 0 ? `${attendingCount} ${attendingCount === 1 ? 'persona asistirá' : 'personas asistirán'}.` : 'Lamentamos que no podáis acompañarnos.'}
                                </p>
                                <p className="mb-6 text-sm text-[#a89584]">
                                    ¡Nos vemos el 20 de junio! 🌴💝
                                </p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    variant="outline"
                                    className="border-[#8b7355] text-[#8b7355]"
                                >
                                    ✏️ Modificar respuesta
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-[#d4c5b9]/30 bg-white/70 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-center font-serif text-2xl italic text-[#8b7355]">
                                Por favor, confirma tu asistencia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-8">
                                {/* Invitados */}
                                <div>
                                    <Label className="mb-4 block text-base uppercase tracking-wide text-[#8b7355]">
                                        ¿Quiénes podréis asistir?
                                    </Label>
                                    <div className="space-y-3">
                                        {group.guests.map((guest, index) => (
                                            <div
                                                key={guest.id}
                                                className="rounded-lg border-2 border-[#d4c5b9]/30 bg-[#faf8f5] p-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Checkbox
                                                        id={`guest-${guest.id}`}
                                                        checked={data.guests[index].attending}
                                                        onCheckedChange={(checked) =>
                                                            updateGuestAttending(
                                                                index,
                                                                checked
                                                            )
                                                        }
                                                        className="mt-1 border-[#8b7355] data-[state=checked]:bg-[#8b7355]"
                                                    />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={`guest-${guest.id}`}
                                                            className="cursor-pointer text-base font-medium text-[#8b7355]"
                                                        >
                                                            {guest.name}
                                                        </Label>

                                                        {data.guests[index].attending && (
                                                            <div className="mt-3">
                                                                <Label
                                                                    htmlFor={`allergies-${guest.id}`}
                                                                    className="text-sm text-[#a89584]"
                                                                >
                                                                    Alergias o restricciones
                                                                    alimentarias
                                                                </Label>
                                                                <Textarea
                                                                    id={`allergies-${guest.id}`}
                                                                    value={
                                                                        data.guests[index].allergies
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateGuestAllergies(
                                                                            index,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    rows={2}
                                                                    className="mt-1 border-[#d4c5b9]"
                                                                    placeholder="Ninguna"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {attendingCount > 0 && (
                                    <>
                                        {/* Transporte */}
                                        <div>
                                            <Label className="mb-4 block text-base uppercase tracking-wide text-[#8b7355]">
                                                ¿Cómo llegaréis al evento?
                                            </Label>
                                            <RadioGroup
                                                value={data.transport}
                                                onValueChange={(value) =>
                                                    setData('transport', value)
                                                }
                                                className="space-y-3"
                                            >
                                                <div className="flex items-start space-x-3 rounded-lg border-2 border-[#d4c5b9] bg-white p-4 transition hover:border-[#8b7355]">
                                                    <RadioGroupItem
                                                        value="AUTOBUS"
                                                        id="autobus"
                                                        className="mt-1 text-[#8b7355]"
                                                    />
                                                    <div className="flex-grow">
                                                        <Label
                                                            htmlFor="autobus"
                                                            className="cursor-pointer font-medium text-[#8b7355]"
                                                        >
                                                            🚌 Autobús (gratis)
                                                        </Label>

                                                        {data.transport === 'AUTOBUS' && (
                                                            <div className="ml-0 mt-3 space-y-2 rounded-lg bg-[#faf8f5] p-3">
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id="bus_onda_ida"
                                                                        checked={data.bus_onda_ida}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) =>
                                                                            setData(
                                                                                'bus_onda_ida',
                                                                                checked
                                                                            )
                                                                        }
                                                                        className="border-[#8b7355]"
                                                                    />
                                                                    <Label
                                                                        htmlFor="bus_onda_ida"
                                                                        className="text-sm"
                                                                    >
                                                                        Bus desde Onda (ida)
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id="bus_onda_vuelta"
                                                                        checked={
                                                                            data.bus_onda_vuelta
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) =>
                                                                            setData(
                                                                                'bus_onda_vuelta',
                                                                                checked
                                                                            )
                                                                        }
                                                                        className="border-[#8b7355]"
                                                                    />
                                                                    <Label
                                                                        htmlFor="bus_onda_vuelta"
                                                                        className="text-sm"
                                                                    >
                                                                        Bus desde Onda (vuelta)
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id="bus_cs"
                                                                        checked={data.bus_cs}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) =>
                                                                            setData(
                                                                                'bus_cs',
                                                                                checked
                                                                            )
                                                                        }
                                                                        className="border-[#8b7355]"
                                                                    />
                                                                    <Label
                                                                        htmlFor="bus_cs"
                                                                        className="text-sm"
                                                                    >
                                                                        Bus desde Castellón
                                                                    </Label>
                                                                </div>
                                                                <p className="mt-2 text-xs text-[#a89584]">
                                                                    * Horarios por confirmar
                                                                    próximamente
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 rounded-lg border-2 border-[#d4c5b9] bg-white p-4 transition hover:border-[#8b7355]">
                                                    <RadioGroupItem
                                                        value="COCHE"
                                                        id="coche"
                                                        className="text-[#8b7355]"
                                                    />
                                                    <Label
                                                        htmlFor="coche"
                                                        className="flex-grow cursor-pointer font-medium text-[#8b7355]"
                                                    >
                                                        🚗 Coche propio (parking gratis disponible)
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Contacto */}
                                        <div>
                                            <Label className="mb-4 block text-base uppercase tracking-wide text-[#8b7355]">
                                                Contacto (opcional)
                                            </Label>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="contact_email" className="text-sm">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="contact_email"
                                                        type="email"
                                                        value={data.contact_email}
                                                        onChange={(e) =>
                                                            setData('contact_email', e.target.value)
                                                        }
                                                        className="mt-1 border-[#d4c5b9]"
                                                        placeholder="tu@email.com"
                                                    />
                                                    <p className="mt-1 text-xs text-[#a89584]">
                                                        Para enviarte actualizaciones
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="contact_phone" className="text-sm">
                                                        Teléfono
                                                    </Label>
                                                    <Input
                                                        id="contact_phone"
                                                        type="tel"
                                                        value={data.contact_phone}
                                                        onChange={(e) =>
                                                            setData('contact_phone', e.target.value)
                                                        }
                                                        className="mt-1 border-[#d4c5b9]"
                                                        placeholder="+34 600 000 000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Botón */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-[#8b7355] to-[#a89584] py-6 text-base font-medium uppercase tracking-wide"
                                >
                                    {processing ? 'Guardando...' : '💾 Confirmar Respuesta'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Información de la boda */}
                <Card className="border-[#d4c5b9]/30 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-center font-serif text-2xl italic text-[#8b7355]">
                            Detalles del Evento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg bg-gradient-to-br from-[#faf8f5] to-white p-6 text-center">
                                <div className="mb-2 text-4xl">📅</div>
                                <h4 className="mb-1 font-serif text-lg text-[#8b7355]">Fecha</h4>
                                <p className="font-medium text-[#8b7355]">
                                    Sábado, 20 de Junio de 2026
                                </p>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-[#faf8f5] to-white p-6 text-center">
                                <div className="mb-2 text-4xl">📍</div>
                                <h4 className="mb-1 font-serif text-lg text-[#8b7355]">Lugar</h4>
                                <p className="font-medium text-[#8b7355]">
                                    {weddingInfo.venue.name}
                                </p>
                                <p className="text-sm text-[#a89584]">
                                    {weddingInfo.venue.address}
                                </p>
                                <a
                                    href={weddingInfo.venue.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-sm text-[#8b7355] underline hover:text-[#6d5b45]"
                                >
                                    Ver ubicación →
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h4 className="font-serif text-lg text-[#8b7355]">
                                Programa del Día
                            </h4>
                            {weddingInfo.schedule.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start rounded-lg bg-gradient-to-r from-[#faf8f5] to-white p-4"
                                >
                                    <div className="w-16 flex-shrink-0 text-center">
                                        <div className="font-serif text-xl text-[#8b7355]">
                                            {item.time}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h5 className="font-medium text-[#8b7355]">
                                            {item.event}
                                        </h5>
                                        <p className="text-sm text-[#a89584]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Logout */}
                <div className="text-center">
                    <button
                        onClick={logout}
                        className="text-sm text-[#a89584] underline hover:text-[#8b7355]"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </main>
        </div>
    );
}
