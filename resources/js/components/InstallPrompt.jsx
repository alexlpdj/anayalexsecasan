import { useState, useEffect, useCallback } from 'react';

function useInstall() {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        if (standalone) {
            setIsStandalone(true);
            return;
        }

        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        setIsIos(ios);

        // Already captured before React mounted
        if (ios || window.__pwaInstallPrompt) {
            setIsInstallable(true);
        }

        // Listen for late-firing beforeinstallprompt
        const handler = (e) => {
            e.preventDefault();
            window.__pwaInstallPrompt = e;
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handler);

        // Listen for successful install
        const installed = () => {
            setIsStandalone(true);
            setIsInstallable(false);
            window.__pwaInstallPrompt = null;
        };
        window.addEventListener('appinstalled', installed);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installed);
        };
    }, []);

    const triggerInstall = useCallback(async () => {
        const prompt = window.__pwaInstallPrompt;
        if (!prompt) return false;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
            window.__pwaInstallPrompt = null;
            setIsInstallable(false);
        }
        return outcome === 'accepted';
    }, []);

    return { isInstallable, isIos, isStandalone, triggerInstall };
}

// ── Banner (se muestra automáticamente la primera vez) ──────────────────────

export default function InstallPrompt() {
    const { isInstallable, isIos, isStandalone, triggerInstall } = useInstall();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isStandalone) return;
        if (localStorage.getItem('pwa-install-dismissed')) return;
        if (isInstallable) setShow(true);
    }, [isInstallable, isStandalone]);

    if (!show) return null;

    const dismiss = () => {
        localStorage.setItem('pwa-install-dismissed', '1');
        setShow(false);
    };

    const handleInstall = async () => {
        await triggerInstall();
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
                src="/icons/icon-192.png"
                alt="App icon"
                style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, objectFit: 'cover' }}
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

// ── Botón pequeño para la barra superior (siempre accesible) ─────────────────

export function InstallButton() {
    const { isInstallable, isIos, isStandalone, triggerInstall } = useInstall();
    const [showIosTooltip, setShowIosTooltip] = useState(false);

    if (isStandalone || !isInstallable) return null;

    if (isIos) {
        return (
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowIosTooltip(v => !v)}
                    aria-label="Añadir a pantalla de inicio"
                    title="Añadir a pantalla de inicio"
                    style={{
                        background: 'none',
                        border: '1px solid #e2dbd3',
                        borderRadius: 8,
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: 16,
                        lineHeight: 1,
                        color: '#8b7355',
                    }}
                >
                    ⊕
                </button>
                {showIosTooltip && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            width: 220,
                            backgroundColor: '#faf8f5',
                            border: '1px solid #e2dbd3',
                            borderRadius: 10,
                            padding: '10px 12px',
                            boxShadow: '0 4px 16px rgba(139,115,85,0.15)',
                            zIndex: 1000,
                            fontSize: 13,
                            color: '#5c4a35',
                            lineHeight: 1.5,
                        }}
                    >
                        Pulsa <strong>Compartir</strong> <span style={{ fontSize: 15 }}>⬆</span> y selecciona{' '}
                        <strong>"Añadir a pantalla de inicio"</strong>
                        <button
                            onClick={() => setShowIosTooltip(false)}
                            style={{
                                display: 'block',
                                marginTop: 8,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#a89584',
                                fontSize: 12,
                                padding: 0,
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={triggerInstall}
            aria-label="Instalar app"
            title="Instalar app"
            style={{
                background: 'none',
                border: '1px solid #e2dbd3',
                borderRadius: 8,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                color: '#8b7355',
            }}
        >
            ⊕
        </button>
    );
}
