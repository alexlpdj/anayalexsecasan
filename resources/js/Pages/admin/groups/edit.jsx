import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditGroup({ group }) {
    const { data, setData, put, processing, errors } = useForm({
        name: group.name || '',
        type: group.type || 'FAMILIAR',
        notes: group.notes || '',
        guests: group.guests.map(g => ({
            id: g.id,
            name: g.name,
            gender: g.gender || '',
        })),
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
        put(route('admin.groups.update', group.id));
    };

    const regenerateCode = () => {
        if (confirm('¿Estás seguro de que quieres regenerar el código? El código anterior dejará de funcionar.')) {
            router.post(route('admin.groups.regenerate-code', group.id));
        }
    };

    const deleteGroup = () => {
        router.delete(route('admin.groups.destroy', group.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Editar: ${group.name}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Editar Grupo
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Modifica la información del grupo y sus invitados
                        </p>
                    </div>
                    <Link href={route('admin.groups.index')}>
                        <Button variant="outline">← Volver</Button>
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
                            {/* Código actual */}
                            <div className="rounded-lg border-2 border-dashed border-[#8b7355]/30 bg-[#faf8f5] p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-[#8b7355]">
                                            Código actual
                                        </p>
                                        <code className="mt-1 block font-mono text-2xl font-bold text-[#8b7355]">
                                            {group.code}
                                        </code>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={regenerateCode}
                                        variant="outline"
                                        size="sm"
                                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                                    >
                                        🔄 Regenerar Código
                                    </Button>
                                </div>
                                <p className="mt-2 text-xs text-gray-600">
                                    ⚠️ Al regenerar el código, el código anterior dejará de funcionar
                                </p>
                            </div>

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
                                    placeholder='Ej: "Familia García", "Carlos y María"'
                                    className="mt-2"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
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

                            {/* Notas administrativas */}
                            <div>
                                <Label htmlFor="notes" className="text-base">
                                    Notas Administrativas (opcional)
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Notas internas sobre este grupo..."
                                    className="mt-2"
                                    rows={3}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Estas notas son solo para uso administrativo y no son visibles para los invitados
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invitados del Grupo */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Personas del Grupo</CardTitle>
                                    <CardDescription>
                                        Gestiona los invitados de este grupo
                                    </CardDescription>
                                </div>
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
                                            <div className="flex items-center justify-center rounded-full bg-[#8b7355] text-white md:col-span-1 md:max-w-[60px] md:justify-center">
                                                <span className="text-lg font-bold">
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
                    <div className="flex items-center justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="gap-2"
                                >
                                    🗑️ Eliminar Grupo
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Se eliminará el grupo "{group.name}"
                                        y todos sus invitados ({data.guests.length} personas).
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={deleteGroup}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Sí, eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <div className="flex gap-3">
                            <Link href={route('admin.groups.index')}>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-[#8b7355] to-[#a89584]"
                            >
                                {processing ? 'Guardando...' : '💾 Guardar Cambios'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
