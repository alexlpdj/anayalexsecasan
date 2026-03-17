import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

function fmt(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function PrintableCodes({ groups }) {
    const printedCount = groups.filter((g) => g.printed_at).length;
    const deliveredCount = groups.filter((g) => g.delivered_at).length;

    const toggle = (groupId, field) => {
        const routeName = field === 'printed'
            ? 'admin.groups.toggle-printed'
            : 'admin.groups.toggle-delivered';
        router.post(route(routeName, groupId), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Códigos de Invitados" />

            {/* Toolbar */}
            <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#d4c5b9] bg-white/95 px-6 py-3 backdrop-blur-sm print:hidden">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
                        <span className="text-[#a89584]">
                            Preparadas: <span className="font-semibold text-[#8b7355]">{printedCount}</span> / {groups.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-[#a89584]">
                            Entregadas: <span className="font-semibold text-green-600">{deliveredCount}</span> / {groups.length}
                        </span>
                    </div>
                </div>
                <Button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#8b7355] to-[#a89584] hover:shadow-lg"
                >
                    🖨️ Imprimir
                </Button>
            </div>

            {/* Content */}
            <div className="p-8 pt-20 print:pt-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 font-serif text-3xl italic text-[#8b7355]">
                        Códigos de Invitados
                    </h1>
                    <p className="text-[#a89584]">Ana & Alex — 20.06.2026</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {groups.map((group, index) => {
                        const isPrinted = !!group.printed_at;
                        const isDelivered = !!group.delivered_at;

                        return (
                            <div
                                key={group.code}
                                className={`break-inside-avoid rounded-lg border-2 p-4 transition-all ${
                                    isDelivered
                                        ? 'border-green-300 bg-green-50'
                                        : isPrinted
                                            ? 'border-amber-300 bg-amber-50'
                                            : 'border-[#d4c5b9] bg-white'
                                }`}
                            >
                                {/* Header row */}
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm text-[#a89584]">#{index + 1}</span>
                                    <code className={`rounded px-3 py-1 font-mono text-lg font-bold text-white ${
                                        isDelivered ? 'bg-green-500' : isPrinted ? 'bg-amber-500' : 'bg-[#8b7355]'
                                    }`}>
                                        {group.code}
                                    </code>
                                </div>

                                {/* Name */}
                                <div className="truncate text-sm font-medium text-[#8b7355]">
                                    {group.name}
                                </div>
                                {group.guests && (
                                    <div className="mt-0.5 truncate text-xs text-[#a89584]">
                                        {group.guests}
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="mt-3 flex gap-2 print:hidden">
                                    <button
                                        onClick={() => toggle(group.id, 'printed')}
                                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                            isPrinted
                                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isPrinted ? `✓ Preparada ${fmt(group.printed_at)}` : '○ Preparar'}
                                    </button>
                                    <button
                                        onClick={() => toggle(group.id, 'delivered')}
                                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                            isDelivered
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isDelivered ? `✓ Entregada ${fmt(group.delivered_at)}` : '○ Entregar'}
                                    </button>
                                </div>

                                {/* Print-only status */}
                                {(isPrinted || isDelivered) && (
                                    <div className="mt-2 hidden text-xs text-gray-400 print:block">
                                        {isDelivered
                                            ? `Entregada: ${fmt(group.delivered_at)}`
                                            : `Preparada: ${fmt(group.printed_at)}`}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center text-sm text-[#a89584]">
                    <p>Total: {groups.length} grupos · {printedCount} preparadas · {deliveredCount} entregadas</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    @page { margin: 1cm; }
                }
            `}</style>
        </>
    );
}
