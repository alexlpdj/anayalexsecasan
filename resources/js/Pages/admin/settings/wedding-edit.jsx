import { Head, useForm, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function WeddingEdit({ settings }) {
    const [translating, setTranslating] = useState(false);

    const handleTranslateSchedule = useCallback(() => {
        setTranslating(true);
        router.post(route('admin.settings.wedding.translate-schedule'), {}, {
            onFinish: () => setTranslating(false),
        });
    }, []);

    const { data, setData, put, processing, errors } = useForm({
        bride: settings.bride || '',
        groom: settings.groom || '',
        wedding_date: settings.wedding_date || '',
        civil_ceremony_date: settings.civil_ceremony_date || '',
        venue_name: settings.venue_name || '',
        venue_address: settings.venue_address || '',
        venue_url: settings.venue_url || '',
        venue_parking_info: settings.venue_parking_info || '',
        schedule: settings.schedule || [],
        buses_available: settings.buses_available || false,
        buses_info: settings.buses_info || '',
        parking_available: settings.parking_available || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.wedding.update'));
    };

    const addScheduleItem = () => {
        setData('schedule', [
            ...data.schedule,
            { time: '', event: '', description: '', details: [] },
        ]);
    };

    const removeScheduleItem = (index) => {
        const newSchedule = data.schedule.filter((_, i) => i !== index);
        setData('schedule', newSchedule);
    };

    const updateScheduleItem = (index, field, value) => {
        const newSchedule = [...data.schedule];
        newSchedule[index][field] = value;
        setData('schedule', newSchedule);
    };

    const addDetail = (scheduleIndex) => {
        const newSchedule = [...data.schedule];
        if (!newSchedule[scheduleIndex].details) {
            newSchedule[scheduleIndex].details = [];
        }
        newSchedule[scheduleIndex].details.push('');
        setData('schedule', newSchedule);
    };

    const removeDetail = (scheduleIndex, detailIndex) => {
        const newSchedule = [...data.schedule];
        newSchedule[scheduleIndex].details = newSchedule[scheduleIndex].details.filter(
            (_, i) => i !== detailIndex
        );
        setData('schedule', newSchedule);
    };

    const updateDetail = (scheduleIndex, detailIndex, value) => {
        const newSchedule = [...data.schedule];
        newSchedule[scheduleIndex].details[detailIndex] = value;
        setData('schedule', newSchedule);
    };

    return (
        <AdminSidebarLayout>
            <Head title="Configuración de la Boda" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-6 sm:p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Configuración de la Boda</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Personaliza la información que verán tus invitados
                        </p>
                    </div>
                </div>

                {/* Banner de traducción pendiente del programa */}
                {settings.schedule_needs_translation && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-amber-800">Programa pendiente de traducción</p>
                                <p className="mt-0.5 text-sm text-amber-700">
                                    El programa del día ha cambiado y aún no está traducido al PT y FR. Pulsa el botón para traducirlo automáticamente con IA.
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={handleTranslateSchedule}
                            disabled={translating}
                            className="shrink-0 bg-amber-600 text-white hover:bg-amber-700"
                        >
                            {translating ? (
                                <span className="flex items-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        ⏳
                                    </motion.span>
                                    Traduciendo...
                                </span>
                            ) : (
                                '🌐 Traducir programa'
                            )}
                        </Button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Couple Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Información de la Pareja</CardTitle>
                            <CardDescription>
                                Nombres de los novios que aparecerán en el sitio
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="bride">Novia</Label>
                                <Input
                                    id="bride"
                                    value={data.bride}
                                    onChange={(e) => setData('bride', e.target.value)}
                                    placeholder="Nombre de la novia"
                                />
                                {errors.bride && (
                                    <p className="text-sm text-red-600">{errors.bride}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="groom">Novio</Label>
                                <Input
                                    id="groom"
                                    value={data.groom}
                                    onChange={(e) => setData('groom', e.target.value)}
                                    placeholder="Nombre del novio"
                                />
                                {errors.groom && (
                                    <p className="text-sm text-red-600">{errors.groom}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </motion.div>

                    {/* Dates */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Fechas</CardTitle>
                            <CardDescription>
                                Fechas de las ceremonias civil y religiosa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="civil_ceremony_date">Ceremonia Civil</Label>
                                <Input
                                    id="civil_ceremony_date"
                                    type="date"
                                    value={data.civil_ceremony_date}
                                    onChange={(e) => setData('civil_ceremony_date', e.target.value)}
                                />
                                {errors.civil_ceremony_date && (
                                    <p className="text-sm text-red-600">
                                        {errors.civil_ceremony_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wedding_date">Fecha de Boda</Label>
                                <Input
                                    id="wedding_date"
                                    type="date"
                                    value={data.wedding_date}
                                    onChange={(e) => setData('wedding_date', e.target.value)}
                                    required
                                />
                                {errors.wedding_date && (
                                    <p className="text-sm text-red-600">{errors.wedding_date}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </motion.div>

                    {/* Venue */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Lugar de Celebración</CardTitle>
                            <CardDescription>
                                Información del venue donde se celebrará la boda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="venue_name">Nombre del Lugar</Label>
                                    <Input
                                        id="venue_name"
                                        value={data.venue_name}
                                        onChange={(e) => setData('venue_name', e.target.value)}
                                        placeholder="Ej: La Ópera"
                                        required
                                    />
                                    {errors.venue_name && (
                                        <p className="text-sm text-red-600">{errors.venue_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="venue_url">URL del Lugar</Label>
                                    <Input
                                        id="venue_url"
                                        type="url"
                                        value={data.venue_url}
                                        onChange={(e) => setData('venue_url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.venue_url && (
                                        <p className="text-sm text-red-600">{errors.venue_url}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="venue_address">Dirección</Label>
                                <Textarea
                                    id="venue_address"
                                    value={data.venue_address}
                                    onChange={(e) => setData('venue_address', e.target.value)}
                                    placeholder="Dirección completa del lugar"
                                    rows={2}
                                    required
                                />
                                {errors.venue_address && (
                                    <p className="text-sm text-red-600">{errors.venue_address}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="venue_parking_info">Información de Parking</Label>
                                <Textarea
                                    id="venue_parking_info"
                                    value={data.venue_parking_info}
                                    onChange={(e) => setData('venue_parking_info', e.target.value)}
                                    placeholder="Detalles sobre el parking disponible"
                                    rows={2}
                                />
                                {errors.venue_parking_info && (
                                    <p className="text-sm text-red-600">
                                        {errors.venue_parking_info}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </motion.div>

                    {/* Schedule */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Programa del Día</CardTitle>
                                    <CardDescription>
                                        Eventos y horarios de la celebración
                                    </CardDescription>
                                </div>
                                <Button type="button" onClick={addScheduleItem} size="sm">
                                    ➕ Añadir Evento
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.schedule.length === 0 && (
                                <p className="text-center text-sm text-gray-500">
                                    No hay eventos. Añade al menos uno para continuar.
                                </p>
                            )}

                            {data.schedule.map((item, index) => (
                                <Card key={index} className="border-2">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">
                                                Evento {index + 1}
                                            </CardTitle>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeScheduleItem(index)}
                                            >
                                                🗑️ Eliminar
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>Hora</Label>
                                                <Input
                                                    type="time"
                                                    value={item.time}
                                                    onChange={(e) =>
                                                        updateScheduleItem(
                                                            index,
                                                            'time',
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Nombre del Evento</Label>
                                                <Input
                                                    value={item.event}
                                                    onChange={(e) =>
                                                        updateScheduleItem(
                                                            index,
                                                            'event',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ej: Ceremonia Civil"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Descripción</Label>
                                            <Textarea
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateScheduleItem(
                                                        index,
                                                        'description',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Breve descripción del evento"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label>Detalles Adicionales</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addDetail(index)}
                                                >
                                                    ➕ Añadir Detalle
                                                </Button>
                                            </div>

                                            {item.details && item.details.length > 0 && (
                                                <div className="space-y-2">
                                                    {item.details.map((detail, detailIndex) => (
                                                        <div
                                                            key={detailIndex}
                                                            className="flex gap-2"
                                                        >
                                                            <Input
                                                                value={detail}
                                                                onChange={(e) =>
                                                                    updateDetail(
                                                                        index,
                                                                        detailIndex,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Detalle del evento"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeDetail(index, detailIndex)
                                                                }
                                                            >
                                                                ✖️
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {errors.schedule && (
                                <p className="text-sm text-red-600">{errors.schedule}</p>
                            )}
                        </CardContent>
                    </Card>
                    </motion.div>

                    {/* Transport */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Transporte</CardTitle>
                            <CardDescription>
                                Información sobre buses y parking disponibles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="buses_available">Autobuses Disponibles</Label>
                                    <p className="text-sm text-gray-500">
                                        ¿Habrá autobuses para los invitados?
                                    </p>
                                </div>
                                <Switch
                                    id="buses_available"
                                    checked={data.buses_available}
                                    onCheckedChange={(checked) =>
                                        setData('buses_available', checked)
                                    }
                                />
                            </div>

                            {data.buses_available && (
                                <div className="space-y-2">
                                    <Label htmlFor="buses_info">Información de Autobuses</Label>
                                    <Textarea
                                        id="buses_info"
                                        value={data.buses_info}
                                        onChange={(e) => setData('buses_info', e.target.value)}
                                        placeholder="Horarios, paradas, y detalles de los autobuses"
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="parking_available">Parking Disponible</Label>
                                    <p className="text-sm text-gray-500">
                                        ¿Hay parking en el lugar?
                                    </p>
                                </div>
                                <Switch
                                    id="parking_available"
                                    checked={data.parking_available}
                                    onCheckedChange={(checked) =>
                                        setData('parking_available', checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="flex justify-end gap-4"
                    >
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-[#8b7355] to-[#a89584] transition-all hover:scale-105 hover:opacity-90"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        ⏳
                                    </motion.span>
                                    Guardando...
                                </span>
                            ) : (
                                '💾 Guardar Cambios'
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </AdminSidebarLayout>
    );
}
