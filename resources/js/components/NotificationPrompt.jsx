import { useState, useEffect, useCallback } from 'react';

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

async function sendSubscriptionToServer(subscription) {
    const { endpoint, keys } = subscription.toJSON();
    await fetch(route('guest.push.subscribe'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
        },
        body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
    });
}

function useNotificationState() {
    const [supported, setSupported] = useState(false);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        const ok = 'Notification' in window && 'PushManager' in window;
        setSupported(ok);
        if (ok) setPermission(Notification.permission);
    }, []);

    // Sync existing subscription on load
    useEffect(() => {
        if (!supported || Notification.permission !== 'granted') return;
        navigator.serviceWorker.ready
            .then(reg => reg.pushManager.getSubscription())
            .then(sub => { if (sub) return sendSubscriptionToServer(sub); })
            .catch(() => {});
    }, [supported]);

    const subscribe = useCallback(async () => {
        if (!supported) return false;
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== 'granted') return false;

        try {
            const vapidKey = document.querySelector('meta[name="vapid-public-key"]')?.content;
            if (!vapidKey) throw new Error('VAPID key not found');
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });
            await sendSubscriptionToServer(subscription);
            return true;
        } catch (err) {
            console.error('Push subscription error:', err);
            return false;
        }
    }, [supported]);

    return { supported, permission, subscribe };
}

// ── Banner card (shown in page content) ─────────────────────────────────────

export default function NotificationPrompt() {
    const { supported, permission, subscribe } = useNotificationState();
    const [show, setShow] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {
        if (!supported) return;
        if (permission !== 'default') return;
        if (localStorage.getItem('push-prompt-dismissed')) return;
        setShow(true);
    }, [supported, permission]);

    if (!show) return null;

    const dismiss = () => {
        localStorage.setItem('push-prompt-dismissed', '1');
        setShow(false);
    };

    const handleActivate = async () => {
        const ok = await subscribe();
        if (ok) {
            setToastMsg('Notificaciones activadas');
            setTimeout(() => setToastMsg(''), 3000);
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

// ── Small bell button for header bar (always accessible) ─────────────────────

export function NotificationButton() {
    const { supported, permission, subscribe } = useNotificationState();
    const [toastMsg, setToastMsg] = useState('');

    // Don't show if not supported or already granted
    if (!supported) return null;
    if (permission === 'granted') return null;

    // Show if permission is 'default' (not yet asked or dismissed the banner)
    // Don't show if 'denied' (browser blocked it permanently)
    if (permission === 'denied') return null;

    const handleClick = async () => {
        // Clear the dismissed flag so the flow works clean
        localStorage.removeItem('push-prompt-dismissed');
        const ok = await subscribe();
        if (ok) {
            setToastMsg('Notificaciones activadas');
            setTimeout(() => setToastMsg(''), 3000);
        }
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
            <button
                onClick={handleClick}
                aria-label="Activar notificaciones"
                title="Activar notificaciones"
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
                🔔
            </button>
        </>
    );
}
