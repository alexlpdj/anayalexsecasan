import { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function NotificationPrompt() {
    const [show, setShow] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        if (!('Notification' in window) || !('PushManager' in window)) return;
        if (Notification.permission !== 'default') return;
        if (localStorage.getItem('push-prompt-dismissed')) return;
        setShow(true);
    }, []);

    if (!show) return null;

    const dismiss = () => {
        localStorage.setItem('push-prompt-dismissed', '1');
        setShow(false);
    };

    const handleActivate = async () => {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            dismiss();
            return;
        }

        try {
            const vapidKey = document.querySelector('meta[name="vapid-public-key"]')?.content;
            if (!vapidKey) throw new Error('VAPID key not found');

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });

            const { endpoint, keys } = subscription.toJSON();

            await fetch(route('guest.push.subscribe'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({
                    endpoint,
                    p256dh: keys.p256dh,
                    auth: keys.auth,
                }),
            });

            setToastMsg('Notificaciones activadas 🎉');
            setTimeout(() => setToastMsg(''), 3000);
        } catch (err) {
            console.error('Push subscription error:', err);
        }

        setShow(false);
    };

    return (
        <>
            {toastMsg && (
                <div
                    style={{
                        position: 'fixed',
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                        backgroundColor: '#5c4a35',
                        color: '#fff',
                        borderRadius: 10,
                        padding: '10px 20px',
                        fontSize: 14,
                        fontFamily: 'Georgia, serif',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}
                >
                    {toastMsg}
                </div>
            )}
            <div
                style={{
                    backgroundColor: '#faf8f5',
                    border: '1px solid #e2dbd3',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: 12,
                    boxShadow: '0 2px 12px rgba(139,115,85,0.08)',
                }}
            >
                <span style={{ fontSize: 24, flexShrink: 0 }}>🔔</span>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 600, color: '#5c4a35' }}>
                        Recibe avisos de última hora
                    </p>
                    <p style={{ margin: '3px 0 10px', fontSize: 13, color: '#8b7355' }}>
                        Te avisaremos si hay cambios en el bus, horario u otros detalles.
                    </p>
                    <button
                        onClick={handleActivate}
                        style={{
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
                        Activar
                    </button>
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
        </>
    );
}
