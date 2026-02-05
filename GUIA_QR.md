# 📱 Guía para Generar el QR de la Invitación

## Opción 1: QR Único para Todos (Recomendado)

Si solo puedes imprimir un QR por invitación, puedes crear un QR que apunte directamente a la página de login:

**URL del QR:** `https://tu-dominio.com/login`

### Herramientas gratuitas para generar QR:

1. **QR Code Generator** - https://www.qr-code-generator.com/
2. **QRCode Monkey** - https://www.qrcode-monkey.com/
3. **QR Tiger** - https://www.qrcode-tiger.com/

### Pasos:

1. Ve a cualquiera de estas webs
2. Introduce la URL: `https://tu-dominio.com/login`
3. Personaliza el diseño si quieres:
   - Colores: Usa `#8b7355` (marrón de la invitación)
   - Añade un logo en el centro (opcional)
4. Descarga el QR en alta resolución (mínimo 300dpi para impresión)
5. Envíalo a la imprenta junto con las invitaciones

### Ventajas:
- Solo necesitas imprimir un diseño de QR
- Más fácil y económico de imprimir
- Los invitados introducen su código manualmente

### Texto sugerido para la invitación:

```
Escanea el QR para confirmar tu asistencia
o visita: tu-dominio.com

Tu código de acceso:
┌─────────┐
│  [____] │  ← Escribir aquí el código a mano
└─────────┘
```

---

## Opción 2: QRs Personalizados (Más complejo)

Si puedes imprimir QRs personalizados, puedes crear un QR por cada invitado:

**URL personalizada:** `https://tu-dominio.com/login?code=ABC12`

### Generación masiva:

Puedes usar un script PHP para generar todos los QRs:

```php
<?php
// generate_qrs.php

require 'vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$guests = [
    ['name' => 'JUAN', 'code' => 'ABC12'],
    ['name' => 'MARIA', 'code' => 'DEF34'],
    // ... todos los invitados
];

foreach ($guests as $guest) {
    $qrCode = QrCode::create("https://tu-dominio.com/login?code={$guest['code']}")
        ->setSize(300)
        ->setMargin(10);
    
    $writer = new PngWriter();
    $result = $writer->write($qrCode);
    
    $result->saveToFile(__DIR__ . "/qrs/{$guest['code']}.png");
}

echo "QRs generados en la carpeta /qrs/";
```

Instala la librería:
```bash
composer require endroid/qr-code
```

### Ventajas:
- Los invitados acceden directamente sin escribir código
- Experiencia más fluida

### Desventajas:
- Necesitas imprimir QRs diferentes
- Más costoso y complejo

---

## 🎨 Diseño del QR

### Colores recomendados:
- Color del QR: `#8b7355` (marrón de la invitación)
- Fondo: Transparente o `#faf8f5` (crema)

### Tamaño:
- Mínimo: 2cm x 2cm
- Recomendado: 3cm x 3cm
- Para imprimir: 300 DPI

### Ubicación en la invitación:
- Esquina inferior derecha
- Parte trasera de la invitación
- En una tarjeta separada adjunta

---

## 📝 Escribir Códigos a Mano

Si usas la Opción 1 (QR único), necesitarás escribir los códigos a mano.

### Consejos:

1. **Imprime la hoja de códigos** usando el panel de admin:
   - Login como ADMIN
   - Click en "Imprimir Códigos"
   - Imprime en A4

2. **Usa un rotulador de punta fina** - Preferiblemente dorado o color de la invitación

3. **Escribe con claridad** - Usa mayúsculas

4. **Verifica cada código** antes de enviar las invitaciones

5. **Ejemplo de cómo escribir:**
   ```
   Tu código:  A B C 1 2
   ```
   (Separando las letras para mejor legibilidad)

---

## 🔗 Short URL (Opcional)

Si la URL es muy larga, puedes usar un acortador:

1. **Bitly** - https://bitly.com/
2. **TinyURL** - https://tinyurl.com/
3. **Crea tu propio dominio corto**:
   - Compra un dominio corto: `alexyana.es`
   - Redirige a tu webapp completa

Ejemplo:
- URL larga: `https://invitacion-boda-alex-ana.herokuapp.com/login`
- URL corta: `https://alexyana.es`

---

## ✅ Checklist Final

Antes de imprimir las invitaciones:

- [ ] QR generado y probado
- [ ] URL funciona correctamente en móviles
- [ ] Códigos impresos y listos para escribir a mano
- [ ] Diseño del QR integrado en la invitación
- [ ] Texto de instrucciones claro
- [ ] App desplegada y funcionando
- [ ] Probado con 2-3 códigos de prueba

---

## 🎯 Recomendación Final

**Para vuestra boda, recomiendo la Opción 1 (QR único + códigos escritos a mano):**

✅ Más sencillo y económico
✅ Más flexible (puedes cambiar códigos después de imprimir)
✅ Más personal (códigos escritos a mano)
✅ Funciona igual de bien

Solo necesitas:
1. Un QR que apunte a `tu-dominio.com/login`
2. Escribir los códigos a mano en cada invitación
3. ¡Listo!

---

**¿Necesitas ayuda generando el QR o los códigos?**

Avísame y te ayudo con el proceso. ¡Será un placer! 🌴💝
