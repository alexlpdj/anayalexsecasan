# 📧 Guía de Notificaciones

Esta guía explica cómo configurar notificaciones automáticas por email y WhatsApp cuando los invitados confirmen su asistencia.

## 📨 Notificaciones por Email

### 1. Configuración de Email en Laravel

Edita tu `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_app_de_google
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tu_email@gmail.com
MAIL_FROM_NAME="Alex & Ana - Boda"
```

**Importante para Gmail:** 
- Activa la verificación en 2 pasos
- Genera una "Contraseña de aplicación" en tu cuenta de Google
- Usa esa contraseña en `MAIL_PASSWORD`

### 2. Crear el Mailable

```php
<?php
// app/Mail/RsvpConfirmation.php

namespace App\Mail;

use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RsvpConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $guest;
    public $confirmed;

    public function __construct(Guest $guest, bool $confirmed)
    {
        $this->guest = $guest;
        $this->confirmed = $confirmed;
    }

    public function build()
    {
        $subject = $this->confirmed 
            ? '¡Gracias por confirmar tu asistencia! 🎉'
            : 'Lamentamos que no puedas acompañarnos';

        return $this->subject($subject)
                    ->view('emails.rsvp-confirmation');
    }
}
```

### 3. Crear la Vista del Email

```php
<!-- resources/views/emails/rsvp-confirmation.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Georgia', serif;
            background-color: #faf8f5;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .monogram {
            font-size: 48px;
            color: #8b7355;
            font-style: italic;
            margin-bottom: 10px;
        }
        .content {
            color: #333;
            line-height: 1.6;
        }
        .highlight {
            background-color: #f5f1ed;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #a89584;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="monogram">A & A</div>
            <p style="color: #a89584; letter-spacing: 2px;">22.06.26</p>
        </div>

        <div class="content">
            <h2 style="color: #8b7355;">Hola {{ $guest->name }},</h2>

            @if($confirmed)
                <p>¡Muchísimas gracias por confirmar tu asistencia a nuestra boda! 🎉</p>
                
                <p>Nos hace una ilusión enorme poder compartir este día tan especial contigo.</p>

                <div class="highlight">
                    <p><strong>📅 Fecha:</strong> Sábado, 20 de Junio de 2026</p>
                    <p><strong>📍 Lugar:</strong> La Ópera, Benicàssim</p>
                    <p><strong>🕐 Ceremonia:</strong> 14:00h</p>
                </div>

                @if($guest->transport === 'AUTOBUS')
                <p><strong>🚌 Transporte:</strong> Te hemos apuntado para el autobús. Te enviaremos los horarios en cuanto los tengamos confirmados.</p>
                @endif

                @if($guest->allergies)
                <p><strong>⚠️ Alergias:</strong> Hemos tomado nota de tus restricciones alimentarias: {{ $guest->allergies }}</p>
                @endif

                <p>Te iremos enviando más información sobre la boda próximamente.</p>
            @else
                <p>Lamentamos mucho que no puedas acompañarnos en nuestro día especial.</p>
                <p>De todos modos, estarás en nuestros pensamientos. ❤️</p>
            @endif

            <p style="margin-top: 30px;">Con cariño,<br>
            <em style="color: #8b7355; font-size: 20px;">Alex & Ana</em></p>
        </div>

        <div class="footer">
            <p>Si necesitas modificar tu respuesta, puedes volver a acceder con tu código en cualquier momento.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Enviar el Email

Actualiza el controlador `GuestController.php`:

```php
use App\Mail\RsvpConfirmation;
use Illuminate\Support\Facades\Mail;

// En el método updateRsvp, después de $guest->update():

if ($guest->email) {
    Mail::to($guest->email)->send(
        new RsvpConfirmation($guest, $validated['confirmed'])
    );
}
```

---

## 💬 Notificaciones por WhatsApp

Hay varias formas de integrar WhatsApp:

### Opción 1: Grupo de WhatsApp Manual

La forma más sencilla es crear un grupo de WhatsApp y copiar/pegar manualmente las actualizaciones.

En el panel de admin, agrega un botón para copiar el resumen:

```javascript
// En Admin/Dashboard.jsx

const copyWhatsAppMessage = () => {
    const message = `
🎉 *Actualización Boda Alex & Ana*

✅ Confirmados: ${stats.confirmed}
⏳ Pendientes: ${stats.pending}
❌ No asisten: ${stats.declined}
🚌 Necesitan bus: ${stats.need_bus}

¡Última actualización: ${new Date().toLocaleString('es-ES')}!
    `.trim();

    navigator.clipboard.writeText(message);
    alert('Mensaje copiado al portapapeles. Pégalo en el grupo de WhatsApp.');
};

// Agregar botón en la interfaz:
<button onClick={copyWhatsAppMessage} className="...">
    📋 Copiar resumen para WhatsApp
</button>
```

### Opción 2: API de WhatsApp Business

Si quieres automatizar completamente, usa WhatsApp Business API:

1. **Twilio WhatsApp API** (https://www.twilio.com/whatsapp)

```php
<?php
// Instalar: composer require twilio/sdk

use Twilio\Rest\Client;

class WhatsAppNotification
{
    public static function sendUpdate($message)
    {
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        $from = env('TWILIO_WHATSAPP_NUMBER'); // 'whatsapp:+14155238886'
        $to = env('WEDDING_GROUP_NUMBER'); // 'whatsapp:+34600000000'

        $client = new Client($sid, $token);
        
        $client->messages->create(
            $to,
            [
                'from' => $from,
                'body' => $message
            ]
        );
    }
}

// Usar en el controlador:
WhatsAppNotification::sendUpdate(
    "¡{$guest->name} acaba de confirmar su asistencia! 🎉"
);
```

Configura en `.env`:

```env
TWILIO_SID=tu_account_sid
TWILIO_TOKEN=tu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WEDDING_GROUP_NUMBER=whatsapp:+34600000000
```

### Opción 3: Webhook a Make/Zapier

Puedes usar Make.com o Zapier para conectar con WhatsApp:

1. Crea un webhook en Make/Zapier
2. Conecta con WhatsApp Business
3. Envía datos desde Laravel:

```php
// En el controlador:
Http::post(env('WEBHOOK_URL'), [
    'guest_name' => $guest->name,
    'confirmed' => $guest->confirmed,
    'timestamp' => now()->toDateTimeString(),
]);
```

---

## 📊 Notificaciones de Resumen Diarias

Crea un comando de Laravel para enviar resúmenes:

```php
<?php
// app/Console/Commands/SendDailySummary.php

namespace App\Console\Commands;

use App\Models\Guest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDailySummary extends Command
{
    protected $signature = 'wedding:daily-summary';
    protected $description = 'Send daily summary of RSVPs';

    public function handle()
    {
        $stats = [
            'total' => Guest::count(),
            'confirmed' => Guest::where('confirmed', true)->count(),
            'pending' => Guest::whereNull('confirmed')->count(),
        ];

        // Enviar email a los novios
        Mail::to(['alex@email.com', 'ana@email.com'])->send(
            new DailySummary($stats)
        );

        $this->info('Daily summary sent!');
    }
}
```

Programa el comando en `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('wedding:daily-summary')->dailyAt('20:00');
}
```

---

## 🔔 Notificaciones en Tiempo Real (Opcional)

Para notificaciones instantáneas en el panel de admin:

### Usando Laravel Echo + Pusher:

```php
// Instalar: composer require pusher/pusher-php-server

// En el controlador, después de confirmar:
event(new NewRsvpEvent($guest));

// Configurar Pusher en .env:
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=tu_app_id
PUSHER_APP_KEY=tu_app_key
PUSHER_APP_SECRET=tu_app_secret
```

---

## ✅ Checklist de Implementación

### Email:
- [ ] Configurar SMTP en `.env`
- [ ] Crear Mailable
- [ ] Crear vista del email
- [ ] Probar con un email de prueba
- [ ] Agregar logs de emails enviados

### WhatsApp:
- [ ] Decidir método (Manual, Twilio, Webhook)
- [ ] Configurar credenciales
- [ ] Crear mensaje template
- [ ] Probar envío
- [ ] Documentar para uso futuro

### Resúmenes:
- [ ] Crear comando de resumen diario
- [ ] Programar en cron
- [ ] Probar ejecución manual

---

## 🎯 Recomendación

Para empezar, recomiendo:

1. **Email automático** - Es fácil de configurar y muy útil
2. **WhatsApp manual** - Copiar/pegar resúmenes al grupo es simple y efectivo
3. **Resumen diario** - Para manteneros al tanto sin revisar constantemente

Podéis añadir automatización de WhatsApp más adelante si lo necesitáis.

---

**¿Necesitas ayuda configurando alguna de estas opciones?**

¡Avísame y te echo una mano! 💝🌴
