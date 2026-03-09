import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function PrintableCodes({ groups }) {
    const [printed, setPrinted] = useState(new Set());

    const toggle = (code) => {
        setPrinted((prev) => {
            const next = new Set(prev);
            next.has(code) ? next.delete(code) : next.add(code);
            return next;
        });
    };

    const markAll = () => setPrinted(new Set(groups.map((g) => g.code)));
    const clearAll = () => setPrinted(new Set());

    return (
        <>
            <Head title="Códigos de Invitados" />

            {/* Toolbar - hidden when printing */}
            <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#d4c5b9] bg-white/95 px-6 py-3 backdrop-blur-sm print:hidden">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-[#a89584]">
                        <span className="font-semibold text-[#8b7355]">{printed.size}</span>
                        {' '}/ {groups.length} impresos
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={markAll}
                            className="rounded-full border border-[#d4c5b9] px-3 py-1 text-xs text-[#8b7355] hover:bg-[#8b7355]/10"
                        >
                            Marcar todos
                        </button>
                        <button
                            onClick={clearAll}
                            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-400 hover:bg-gray-50"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
                <Button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#8b7355] to-[#a89584] hover:shadow-lg"
                >
                    🖨️ Imprimir
                </Button>
            </div>

            {/* Printable content */}
            <div className="p-8 pt-20 print:pt-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 font-serif text-3xl italic text-[#8b7355]">
                        Códigos de Invitados
                    </h1>
                    <p className="text-[#a89584]">Alex & Ana — 20.06.2026</p>
                </div>

                {/* Grid of codes - 3 columns */}
                <div className="grid grid-cols-3 gap-4">
                    {groups.map((group, index) => {
                        const isPrinted = printed.has(group.code);
                        return (
                            <div
                                key={group.code}
                                onClick={() => toggle(group.code)}
                                className={`break-inside-avoid cursor-pointer rounded-lg border-2 p-4 transition-all print:cursor-default ${
                                    isPrinted
                                        ? 'border-green-300 bg-green-50 opacity-60'
                                        : 'border-[#d4c5b9] bg-white hover:border-[#8b7355]/40 hover:shadow-sm'
                                }`}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm text-[#a89584]">#{index + 1}</span>
                                    <div className="flex items-center gap-2">
                                        {isPrinted && (
                                            <span className="print:hidden text-green-500 text-sm font-medium">✓</span>
                                        )}
                                        <code className={`rounded px-3 py-1 font-mono text-lg font-bold text-white ${isPrinted ? 'bg-green-500' : 'bg-[#8b7355]'}`}>
                                            {group.code}
                                        </code>
                                    </div>
                                </div>
                                <div className="truncate text-sm font-medium text-[#8b7355]">
                                    {group.name}
                                </div>
                                {group.guests && (
                                    <div className="mt-1 truncate text-xs text-[#a89584]">
                                        {group.guests}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-[#a89584]">
                    <p>Total de grupos: {groups.length}</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page { margin: 1cm; }
                }
            `}</style>
        </>
    );
}
