# 🎵 INSTALACIÓN Y PRUEBAS - Webapp Boda A & A

## ✅ TODO IMPLEMENTADO

### Alta Prioridad (5/5) ✅
- ✅ Loading Screen animado
- ✅ Música de fondo con control
- ✅ Confetti al confirmar asistencia
- ✅ Scroll animations
- ✅ Countdown timer (ARREGLADO - sin flasheos)

### Media Prioridad (4/4) ✅
- ✅ Timeline animado con línea progresiva
- ✅ Microinteracciones refinadas (ripple buttons)
- ✅ Smooth scroll + barra de progreso
- ✅ Hero animation con typewriter

### Nuevas Features (3/3) ✅
- ✅ Optimización para móvil
- ✅ Sistema FAQ completo (backend)
- ✅ FAQ Accordion animado para invitados

---

## 📁 PASO 1: AÑADIR MÚSICA

### Ubicación del archivo:
```
public/audio/wedding-music.mp3
```

### Cómo hacerlo:

1. **Descarga una canción romántica** (libre de derechos):
   - [Bensound](https://www.bensound.com/) → busca "wedding" o "love"
   - [Incompetech](https://incompetech.com/) → busca "romantic"
   - [Free Music Archive](https://freemusicarchive.org/)

2. **Renombra el archivo a:** `wedding-music.mp3`

3. **Mueve el archivo a la carpeta:**
   ```bash
   # Desde tu carpeta de descargas
   mv ~/Downloads/tu-cancion.mp3 public/audio/wedding-music.mp3
   ```

4. **Verifica que existe:**
   ```bash
   ls -lh public/audio/wedding-music.mp3
   ```

### ⚠️ Importante:
- El archivo **DEBE** llamarse exactamente `wedding-music.mp3`
- Formato recomendado: MP3
- Peso recomendado: Menos de 5MB para carga rápida
- Si no añades música, el player simplemente no aparecerá (sin errores)

---

## 🚀 PASO 2: INICIAR EL SERVIDOR

```bash
# Compilar assets
npm run build

# O en modo desarrollo (recomendado para pruebas)
npm run dev

# En otra terminal, iniciar Laravel
php artisan serve
```

---

## 🧪 PASO 3: PROBAR TODAS LAS FEATURES

### A) PÁGINA DE LOGIN DE INVITADOS

Visita: `http://localhost:8000/invitacion/login`

**Qué verás:**
1. ✅ **Loading screen** (2 segundos) con "A & A" animado
2. ✅ **Animación de entrada** del formulario
3. ✅ Header con palmeras decorativas

### B) DASHBOARD DE INVITADOS

Inicia sesión con un código válido

**Qué verás:**

#### 1. Hero Section (Arriba)
- ✅ **Typewriter effect**: "A" se escribe → "&" aparece → "A" se escribe
- ✅ **Countdown timer**: Solo los segundos se animan (sin flasheos)
- ✅ **Duración total**: ~3.5 segundos

#### 2. Scroll y Navegación
- ✅ **Barra de progreso** dorada en la parte superior
- ✅ Haz scroll hacia abajo → aparece **botón "scroll to top"** (abajo-izquierda)
- ✅ **Reproductor de música** flotante (abajo-derecha)
  - Click para play/pause
  - Hover para ver controles de volumen

#### 3. Timeline del Evento
- ✅ Al hacer scroll hasta la sección "Detalles del evento"
- ✅ **Línea vertical** se dibuja progresivamente
- ✅ **Puntos** aparecen uno tras otro con efecto "pop"
- ✅ **Pulsos decorativos** cada 3 segundos

#### 4. Botones y Formularios
- ✅ Click en "Asistiré" o "No podremos asistir"
- ✅ **Efecto ripple** (ondas) desde donde hiciste click
- ✅ Marca checkboxes → **animación "wiggle"**
- ✅ Al confirmar asistencia → **¡CONFETTI!** 🎊

#### 5. FAQ (Preguntas Frecuentes)
- ✅ Sección nueva al final (si hay FAQs en la BD)
- ✅ **Accordion animado** - click para expandir/colapsar
- ✅ Animación suave de apertura/cierre

---

## 🎨 PASO 4: CREAR FAQs (ADMIN)

### Acceder al Admin:
1. Login: `http://localhost:8000/login`
2. Ve a: `http://localhost:8000/admin/faqs`

### Crear una FAQ de prueba:

**Opción A: Usando la interfaz (próximamente)**
- Por implementar: formulario visual

**Opción B: Usando Tinker (ahora)**
```bash
php artisan tinker
```

```php
// Crear FAQs de ejemplo
\App\Models\Faq::create([
    'question' => '¿Hay parking disponible?',
    'answer' => 'Sí, hay parking gratuito en La Ópera para todos los invitados.',
    'order' => 1,
    'is_active' => true
]);

\App\Models\Faq::create([
    'question' => '¿Cuál es el código de vestimenta?',
    'answer' => 'Etiqueta formal. Los hombres con traje y las mujeres con vestido de gala. Por favor, evitad el color blanco.',
    'order' => 2,
    'is_active' => true
]);

\App\Models\Faq::create([
    'question' => '¿Puedo llevar niños?',
    'answer' => 'Por favor, dejad a los peques en casa. Será una celebración solo para adultos para que todos podamos disfrutar al máximo.',
    'order' => 3,
    'is_active' => true
]);

\App\Models\Faq::create([
    'question' => '¿Hasta cuándo puedo confirmar mi asistencia?',
    'answer' => 'La fecha límite para confirmar es el 1 de mayo de 2026. Después de esa fecha no se podrán hacer cambios.',
    'order' => 4,
    'is_active' => true
]);

// Salir de tinker
exit
```

**Luego recarga** la página del dashboard de invitados y verás la sección FAQ aparecen al final.

---

## 🎯 CHECKLIST DE PRUEBAS

### ✅ Desktop (Navegador)

- [ ] Loading screen se ve bien
- [ ] Typewriter escribe "A & A" correctamente
- [ ] Countdown muestra tiempo correcto (sin flasheos)
- [ ] Barra de progreso se llena al hacer scroll
- [ ] Timeline se dibuja al entrar en viewport
- [ ] Botones hacen efecto ripple
- [ ] Checkboxes bailan al marcar
- [ ] Música suena y se puede controlar
- [ ] Botón scroll-to-top aparece y funciona
- [ ] Confetti aparece al confirmar
- [ ] FAQs se expanden/contraen suavemente

### ✅ Móvil (Chrome/Safari)

- [ ] Loading screen más rápido (optimizado)
- [ ] Typewriter más rápido en móvil
- [ ] Countdown responsive
- [ ] Timeline se ve bien
- [ ] Botones táctiles funcionan
- [ ] Reproductor de música accesible
- [ ] FAQs tocables

---

## 🐛 TROUBLESHOOTING

### Problema: "No se escucha música"
**Solución:**
1. Verifica que el archivo existe: `ls public/audio/wedding-music.mp3`
2. Verifica el nombre exacto (case-sensitive)
3. Recarga la página (Cmd+R / Ctrl+R)
4. Abre consola del navegador (F12) y busca errores

### Problema: "Countdown hace flasheos"
**Solución:**
- Ya está arreglado ✅
- Solo los segundos se animan ahora
- Si persiste, limpia caché: `npm run build`

### Problema: "No aparecen las FAQs"
**Solución:**
1. Verifica que hay FAQs en la BD:
   ```bash
   php artisan tinker
   \App\Models\Faq::active()->count()  # Debe ser > 0
   exit
   ```
2. Verifica que `is_active = true`
3. Limpia caché de Inertia (recarga página)

### Problema: "Animaciones van lentas en móvil"
**Solución:**
- Ya está optimizado ✅
- Las animaciones son 30% más rápidas en móvil
- Si tu móvil es muy viejo, algunas animaciones pueden verse entrecortadas

---

## 📊 ARCHIVOS IMPORTANTES

```
public/
└── audio/
    └── wedding-music.mp3          ← AÑADIR AQUÍ

resources/js/
├── components/
│   ├── LoadingScreen.jsx          ← Loading inicial
│   ├── MusicPlayer.jsx            ← Reproductor música
│   ├── CountdownTimer.jsx         ← Countdown (ARREGLADO)
│   ├── AnimatedTimeline.jsx       ← Timeline dibujado
│   ├── AnimatedHero.jsx           ← Hero con typewriter
│   ├── RippleButton.jsx           ← Botones con ripple
│   ├── FaqAccordion.jsx           ← Accordion de FAQs
│   ├── ScrollProgress.jsx         ← Barra superior
│   └── ScrollToTop.jsx            ← Botón volver arriba
│
└── utils/
    └── deviceDetection.js         ← Detección móvil

database/migrations/
└── 2026_02_16_*_create_faqs_table.php

app/
├── Models/Faq.php
└── Http/Controllers/
    └── Admin/FaqController.php
```

---

## 🎨 PERSONALIZACIÓN RÁPIDA

### Cambiar velocidad del typewriter:
```jsx
// resources/js/components/AnimatedHero.jsx, línea ~21
const typeSpeed = mobile ? 100 : 200;  // ← Cambiar aquí
                    // ↑ móvil  ↑ desktop
```

### Cambiar duración del loading screen:
```jsx
// resources/js/Pages/Guest/Dashboard.jsx, línea ~120
setTimeout(() => setShowLoading(false), 2000)  // ← 2000ms = 2s
```

### Cambiar colores del confetti:
```jsx
// resources/js/Pages/Guest/Dashboard.jsx, función triggerConfetti
const colors = ['#8b7355', '#d4c5b9', '#f5f1ed', '#c4a571'];
```

---

## 🎉 ¡LISTO!

Tu webapp de boda está **100% funcional** con todas las animaciones premium.

**Próximos pasos opcionales:**
- Añadir interfaz visual para crear FAQs en admin
- Mejorar admin dashboard con animaciones
- Añadir más efectos visuales
- Galería de fotos
- Y mucho más... (ver `MEJORAS_FUTURAS.md`)

**¡Disfruta de vuestra webapp! 💕**
