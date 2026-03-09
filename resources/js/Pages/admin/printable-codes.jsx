import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function PrintableCodes({ groups }) {
    return (
        <>
            <Head title="Códigos de Invitados" />

            {/* Print button - hidden when printing */}
            <div className="fixed right-4 top-4 print:hidden">
                <Button
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#8b7355] to-[#a89584] hover:shadow-lg"
                >
                    🖨️ Imprimir
                </Button>
            </div>

            {/* Printable content */}
            <div className="p-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 font-serif text-3xl italic text-[#8b7355]">
                        Códigos de Invitados
                    </h1>
                    <p className="text-[#a89584]">Alex & Ana — 20.06.2026</p>
                </div>

                {/* Grid of codes - 3 columns */}
                <div className="grid grid-cols-3 gap-4">
                    {groups.map((group, index) => (
                        <div
                            key={group.code}
                            className="break-inside-avoid rounded-lg border-2 border-[#d4c5b9] bg-white p-4"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-[#a89584]">#{index + 1}</span>
                                <code className="rounded bg-[#8b7355] px-3 py-1 font-mono text-lg font-bold text-white">
                                    {group.code}
                                </code>
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
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-[#a89584]">
                    <p>Total de grupos: {groups.length}</p>
                </div>
            </div>

            {/* Print-specific styles */}
            <style>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </>
    );
}
