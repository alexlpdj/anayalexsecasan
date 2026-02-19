import { useState, useEffect } from 'react';

export default function InstallPrompt() {
    const [show, setShow] = useState(false);
    const [isIos, setIsIos] = useState(false);

    useEffect(() => {
        // Already installed as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        // User dismissed before
        if (localStorage.getItem('pwa-install-dismissed')) return;

        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        setIsIos(ios);

        if (ios || window.__pwaInstallPrompt) {
            setShow(true);
        }
    }, []);

    if (!show) return null;

    const dismiss = () => {
        localStorage.setItem('pwa-install-dismissed', '1');
        setShow(false);
    };

    const handleInstall = async () => {
        if (!window.__pwaInstallPrompt) return;
        window.__pwaInstallPrompt.prompt();
        const { outcome } = await window.__pwaInstallPrompt.userChoice;
        if (outcome === 'accepted') {
            window.__pwaInstallPrompt = null;
        }
        setShow(false);
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: '#faf8f5',
                borderTop: '1px solid #e2dbd3',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 -4px 20px rgba(139,115,85,0.12)',
            }}
        >
            <img
                src="/icons/icon-512.png"
                alt="App icon"
                style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 600, color: '#5c4a35' }}>
                    Añadir a pantalla de inicio
                </p>
                {isIos ? (
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8b7355', lineHeight: 1.4 }}>
                        Pulsa <strong>Compartir</strong> (<span style={{ fontSize: 16 }}>⬆</span>) y selecciona{' '}
                        <strong>"Añadir a pantalla de inicio"</strong>
                    </p>
                ) : (
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8b7355' }}>
                        Accede más rápido desde tu pantalla de inicio
                    </p>
                )}
                {!isIos && (
                    <button
                        onClick={handleInstall}
                        style={{
                            marginTop: 8,
                            backgroundColor: '#8b7355',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 16px',
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                        }}
                    >
                        Instalar app
                    </button>
                )}
            </div>
            <button
                onClick={dismiss}
                aria-label="Cerrar"
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#a89584',
                    fontSize: 20,
                    lineHeight: 1,
                    padding: 0,
                    flexShrink: 0,
                }}
            >
                ×
            </button>
        </div>
    );
}
