export default function WeddingLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#faf8f5] to-[#ede8e3]">
            {/* Header */}
            <header className="relative py-6 px-4">
                <div className="mx-auto max-w-6xl text-center">
                    {/* Monograma */}
                    <h1 className="mb-2 font-serif text-5xl italic text-[#8b7355]">
                        A <span className="text-4xl">&</span> A
                    </h1>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#a89584]">
                        20.06.26
                    </p>
                </div>

                {/* Palmeras decorativas sutiles */}
                <div className="pointer-events-none absolute left-4 top-0 h-32 w-24 opacity-20">
                    <svg viewBox="0 0 100 200" className="h-full w-full">
                        <path
                            d="M50 180 Q45 140 40 100 Q35 60 30 20 M50 180 Q50 140 50 100 Q50 60 50 20 M50 180 Q55 140 60 100 Q65 60 70 20"
                            stroke="#6b8e5a"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.3"
                        />
                        <ellipse
                            cx="30"
                            cy="15"
                            rx="15"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                        <ellipse
                            cx="50"
                            cy="10"
                            rx="18"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                        <ellipse
                            cx="70"
                            cy="15"
                            rx="15"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                    </svg>
                </div>

                <div className="pointer-events-none absolute right-4 top-0 h-32 w-24 scale-x-[-1] opacity-20">
                    <svg viewBox="0 0 100 200" className="h-full w-full">
                        <path
                            d="M50 180 Q45 140 40 100 Q35 60 30 20 M50 180 Q50 140 50 100 Q50 60 50 20 M50 180 Q55 140 60 100 Q65 60 70 20"
                            stroke="#6b8e5a"
                            strokeWidth="1"
                            fill="none"
                            opacity="0.3"
                        />
                        <ellipse
                            cx="30"
                            cy="15"
                            rx="15"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                        <ellipse
                            cx="50"
                            cy="10"
                            rx="18"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                        <ellipse
                            cx="70"
                            cy="15"
                            rx="15"
                            ry="8"
                            fill="#6b8e5a"
                            opacity="0.2"
                        />
                    </svg>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-4xl px-4 pb-12">{children}</main>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-[#a89584]">
                <p className="font-serif italic">Con todo nuestro amor,  Ana & Alex</p>
            </footer>
        </div>
    );
}
