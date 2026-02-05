# 🌴 Webapp de Boda - Alex & Ana (TypeScript Edition)

Aplicación web elegante para gestionar invitaciones de boda, construida sobre el **Laravel React Starter Kit oficial** con TypeScript.

## ✨ Características

### 🎯 Stack Tecnológico

- **Backend:** Laravel 11
- **Frontend:** React 19 + **TypeScript**
- **Routing:** Inertia.js
- **UI Components:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS
- **Build:** Vite

### 💎 Por qué TypeScript

Esta versión usa TypeScript en lugar de JavaScript porque:

✅ **Type Safety** - Errores detectados en tiempo de compilación
✅ **IntelliSense** - Autocompletado y sugerencias en el editor
✅ **Refactoring** - Cambios seguros y confiables
✅ **Documentación** - Los tipos son documentación viva
✅ **Mantenibilidad** - Código más fácil de mantener a largo plazo
✅ **Compatibilidad** - 100% compatible con el starter kit oficial

### 🎨 Para Invitados

- 🔐 Login con código único de 5 caracteres
- 📋 Información completa de la boda
- ✅ Confirmación de asistencia (Sí/No)
- 🍽️ Gestión de alergias y restricciones
- 🚌 Selección de transporte (autobús/coche)
- 📧 Formulario de contacto opcional
- 📱 100% responsive

### 👑 Para Administradores (Alex & Ana)

- 📊 Dashboard con estadísticas en tiempo real
- 👥 Lista completa de invitados con filtros
- 🔍 Búsqueda por nombre
- 📥 Exportación a CSV
- 🖨️ Códigos imprimibles para invitaciones
- 🚌 Resumen de necesidades de transporte
- ⚠️ Vista de alergias y restricciones

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar el starter kit oficial
git clone https://github.com/laravel/react-starter-kit.git boda-alex-ana
cd boda-alex-ana

# 2. Instalar dependencias
composer install
npm install

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos en .env
# DB_DATABASE=boda_alex_ana
# DB_USERNAME=tu_usuario
# DB_PASSWORD=tu_contraseña

# 5. Copiar archivos personalizados (del paquete)
# Ver INSTALACION_TYPESCRIPT.md para detalles

# 6. Migrar y cargar datos
php artisan migrate
php artisan db:seed --class=GuestSeeder

# 7. Compilar y ejecutar
npm run dev
php artisan serve
```

**Accede a:** http://localhost:8000

---

## 📚 Documentación

Lee en este orden:

1. **INSTALACION_TYPESCRIPT.md** - Guía paso a paso completa
2. **GUIA_QR.md** - Cómo generar el QR para invitaciones
3. **GUIA_NOTIFICACIONES.md** - Configurar emails y WhatsApp
4. **RESUMEN_Y_PROXIMOS_PASOS.md** - Plan de deployment

---

## 📁 Estructura de Archivos TypeScript

```typescript
// Types compartidos
resources/js/types/wedding.ts

// Interfaces principales
export interface Guest {
    id: number;
    name: string;
    code: string;
    type: 'FAMILIAR' | 'AMIGO' | 'NOVIOS';
    confirmed: boolean | null;
    // ... más campos
}

// Componentes tipados
resources/js/pages/guest/login.tsx
resources/js/pages/guest/dashboard.tsx
resources/js/pages/admin/dashboard.tsx
```

---

## 🎨 Componentes Shadcn/UI

El starter kit incluye componentes profesionales listos para usar:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
```

**No necesitas crear componentes desde cero** - ya vienen con el starter kit.

---

## 🔐 Acceso

- **Administración:** Código `ADMIN`
- **Invitados:** Códigos únicos de 5 caracteres

Total de invitados cargados: **89**

---

## ⚙️ Configuración

### Colores de la Boda

Los colores están definidos en `tailwind.config.ts`:

```typescript
colors: {
    wedding: {
        primary: '#8b7355',    // Marrón suave
        secondary: '#a89584',  // Beige
        cream: '#faf8f5',      // Crema
        // ...
    }
}
```

### TypeScript Config

El `tsconfig.json` del starter kit incluye:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "module": "ESNext",
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  }
}
```

---

## 🎯 Ventajas sobre JavaScript

### Type Safety

```typescript
// ❌ JavaScript - Error en runtime
const guest = guests.find(g => g.id === 'abc'); // Oops! id es number

// ✅ TypeScript - Error en compilación
const guest = guests.find(g => g.id === 'abc');
//                                  ^^^ Type error!
```

### IntelliSense

TypeScript proporciona autocompletado inteligente en tu editor:

```typescript
const { data, setData } = useForm<RsvpFormData>({
    confirmed: true,
    allergies: '',
    // Tu editor te sugiere todos los campos disponibles
});

data. // <- Autocompletado con todos los campos
```

### Refactoring Seguro

Si cambias la estructura de `Guest`, TypeScript te avisa en todos los lugares donde lo usas.

---

## 🔧 Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build para producción
npm run build
```

---

## 📦 Lo que incluye este paquete

### Backend (PHP)

- `Guest.php` - Modelo con tipado de propiedades
- `GuestController.php` - Login y dashboard de invitados
- `AdminController.php` - Panel de administración
- `GuestAuthentication.php` - Middleware de autenticación
- `AdminMiddleware.php` - Middleware de admin
- `GuestSeeder.php` - 89 invitados con códigos únicos
- Migración de tabla `guests`

### Frontend (TypeScript)

- `wedding.ts` - Interfaces y tipos compartidos
- `wedding-layout.tsx` - Layout con diseño elegante
- `guest/login.tsx` - Login con componentes Shadcn
- `guest/dashboard.tsx` - Dashboard tipado
- `admin/dashboard.tsx` - Panel de administración
- `admin/printable-codes.tsx` - Códigos para imprimir

### Configuración

- `tailwind.config.ts` - Colores de la boda
- `routes/web.php` - Rutas personalizadas
- `tsconfig.json` - Ya viene con el starter kit

---

## 🌐 Deployment

### Compilación para Producción

```bash
# 1. Instalar dependencias optimizadas
composer install --optimize-autoloader --no-dev

# 2. Build de TypeScript
npm run build

# 3. Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Opciones de Hosting

1. **Laravel Forge** - Deployment automático desde Git
2. **Heroku** - Plataforma como servicio
3. **DigitalOcean** - VPS o App Platform
4. **Vercel/Netlify** - Frontend + API separado

Ver **RESUMEN_Y_PROXIMOS_PASOS.md** para instrucciones detalladas.

---

## ✅ Checklist de Implementación

### Instalación
- [ ] Clonar React Starter Kit
- [ ] Copiar archivos personalizados
- [ ] Configurar `.env`
- [ ] Migrar base de datos
- [ ] Cargar invitados (seeder)
- [ ] Compilar assets TypeScript

### Pruebas
- [ ] Login con código ADMIN funciona
- [ ] Login con código de invitado funciona
- [ ] Formulario de confirmación guarda datos
- [ ] Panel admin muestra estadísticas
- [ ] Exportar CSV funciona
- [ ] Imprimir códigos funciona
- [ ] TypeScript compila sin errores

### Deployment
- [ ] Configurar hosting
- [ ] Comprar dominio
- [ ] SSL configurado
- [ ] Base de datos en producción
- [ ] Build de producción
- [ ] Variables de entorno configuradas

### QR e Invitaciones
- [ ] Generar QR en alta resolución
- [ ] Imprimir hoja de códigos
- [ ] Integrar QR en invitaciones
- [ ] Escribir códigos a mano
- [ ] Probar con varios teléfonos

---

## 🆘 Troubleshooting

### Errores de TypeScript

```bash
# Verificar configuración
cat tsconfig.json

# Limpiar y recompilar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Cannot find module '@/components/ui/...'"

Asegúrate de que tienes los paths configurados en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  }
}
```

### Errores de Inertia Types

```bash
# Instalar tipos
npm install -D @inertiajs/react @types/react @types/react-dom
```

---

## 📊 Estadísticas del Proyecto

- **Total invitados:** 89
- **Archivos TypeScript:** 7
- **Componentes reutilizados:** 7+ (Shadcn/UI)
- **Type safety:** 100%
- **Lines of code:** ~2,000 (TypeScript + PHP)

---

## 💡 Tips de TypeScript

### Usa los tipos proporcionados

```typescript
import { Guest, WeddingInfo, RsvpFormData } from '@/types/wedding';

// Typesafe props
interface DashboardProps {
    guest: Guest;
    weddingInfo: WeddingInfo;
}
```

### Aprovecha el IntelliSense

Los componentes están completamente tipados:

```typescript
<Button
    onClick={handleClick}
    disabled={processing}
    className="..."
>
    {/* Tu editor sabe qué props acepta Button */}
</Button>
```

### Refactoring seguro

Si cambias un tipo, TypeScript te avisa en todos los lugares afectados.

---

## 🎉 ¡Todo Listo!

Tienes una webapp moderna, profesional y type-safe para vuestra boda:

✅ **TypeScript** - Código seguro y mantenible
✅ **React 19** - Última versión
✅ **Inertia.js** - SPA sin complejidad
✅ **Shadcn/UI** - Componentes profesionales
✅ **Tailwind CSS** - Estilos modernos
✅ **Laravel 11** - Backend robusto

---

## 📞 Soporte

Para dudas durante la implementación, consulta:

- `INSTALACION_TYPESCRIPT.md` - Guía completa
- `GUIA_QR.md` - Generación de QR
- `GUIA_NOTIFICACIONES.md` - Emails y WhatsApp

---

## 💝 Créditos

Desarrollado con amor para Alex & Ana.

**Basado en:**
- [Laravel React Starter Kit](https://github.com/laravel/react-starter-kit)
- Laravel 11
- React 19
- TypeScript 5
- Inertia.js
- Shadcn/UI

---

**¡Que tengáis una boda increíble! 🌴💝🎉**

*20 de Junio de 2026 - La Ópera, Benicàssim*
