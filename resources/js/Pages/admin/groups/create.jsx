import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminSidebarLayout from '@/Layouts/AdminSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CreateGroup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'FAMILIAR',
        guests: [{ name: '', gender: '' }],
    });

    const addGuest = () => {
        setData('guests', [...data.guests, { name: '', gender: '' }]);
    };

    const removeGuest = (index) => {
        const newGuests = data.guests.filter((_, i) => i !== index);
        setData('guests', newGuests.length > 0 ? newGuests : [{ name: '', gender: '' }]);
    };

    const updateGuest = (index, field, value) => {
        const newGuests = [...data.guests];
        newGuests[index][field] = value;
        setData('guests', newGuests);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.groups.store'));
    };

    return (
        <AdminSidebarLayout>
            <Head title="Crear Grupo Nuevo" />

            <div className="mx-auto max-w-4xl space-y-4 p-3 sm:space-y-6 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Crear Grupo Nuevo
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Define un nuevo núcleo familiar o grupo de amigos
                        </p>
                    </div>
                    <Link href={route('admin.groups.index')} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">← Volver</Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Información del Grupo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Grupo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nombre del Grupo */}
                            <div>
                                <Label htmlFor="name" className="text-base">
                                    Nombre del Grupo *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder='Ej: "Familia Vicent", "Carlos y Arancha"'
                                    className="mt-2"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Este nombre aparecerá cuando los invitados accedan con su
                                    código
                                </p>
                            </div>

                            {/* Tipo de Grupo */}
                            <div>
                                <Label className="text-base">Tipo de Grupo *</Label>
                                <RadioGroup
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                    className="mt-3 flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="FAMILIAR" id="familiar" />
                                        <Label htmlFor="familiar" className="cursor-pointer">
                                            👨‍👩‍👧‍👦 Familiar
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="AMIGO" id="amigo" />
                                        <Label htmlFor="amigo" className="cursor-pointer">
                                            👥 Amigos
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            {/* Info: Código */}
                            <div className="rounded-lg border-2 border-dashed border-[#8b7355]/30 bg-[#faf8f5] p-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🔑</span>
                                    <div>
                                        <p className="font-medium text-[#8b7355]">
                                            Código único
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Se generará automáticamente un código alfanumérico
                                            único cuando guardes el grupo. Este código lo
                                            escribirás a mano en las invitaciones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invitados del Grupo */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Personas del Grupo</CardTitle>
                                <Button
                                    type="button"
                                    onClick={addGuest}
                                    variant="outline"
                                    size="sm"
                                    className="text-[#8b7355]"
                                >
                                    ➕ Agregar Persona
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.guests.map((guest, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 rounded-lg border bg-white p-4"
                                >
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            {/* Número */}
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#8b7355] text-white md:col-span-1 md:h-auto md:w-auto md:max-w-[60px]">
                                                <span className="text-sm font-bold md:text-lg">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Nombre */}
                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor={`guest-${index}-name`}
                                                    className="text-sm"
                                                >
                                                    Nombre completo *
                                                </Label>
                                                <Input
                                                    id={`guest-${index}-name`}
                                                    type="text"
                                                    value={guest.name}
                                                    onChange={(e) =>
                                                        updateGuest(
                                                            index,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ej: María García López"
                                                    className="mt-1"
                                                />
                                                {errors[`guests.${index}.name`] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors[`guests.${index}.name`]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Género */}
                                        <div>
                                            <Label
                                                htmlFor={`guest-${index}-gender`}
                                                className="text-sm"
                                            >
                                                Género (opcional)
                                            </Label>
                                            <Select
                                                value={guest.gender}
                                                onValueChange={(value) =>
                                                    updateGuest(index, 'gender', value)
                                                }
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="HOMBRE">
                                                        Hombre
                                                    </SelectItem>
                                                    <SelectItem value="MUJER">Mujer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Botón Eliminar */}
                                    <div className="flex items-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeGuest(index)}
                                            disabled={data.guests.length === 1}
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {errors.guests && typeof errors.guests === 'string' && (
                                <p className="text-sm text-red-600">{errors.guests}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                        <Link href={route('admin.groups.index')} className="order-2 sm:order-1">
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="order-1 w-full bg-gradient-to-r from-[#8b7355] to-[#a89584] sm:order-2 sm:w-auto"
                        >
                            {processing ? 'Guardando...' : '💾 Guardar Grupo'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminSidebarLayout>
    );
}
