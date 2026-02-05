# 🚀 Instalación - Webapp Boda (TypeScript + React Starter Kit)

Esta guía te llevará paso a paso para crear la webapp usando el **Laravel React Starter Kit oficial** con TypeScript.

---

## 📋 Requisitos Previos

- PHP 8.2+
- Composer
- Node.js 20+ y npm
- MySQL 8+ o PostgreSQL

---

## 🎯 Paso 1: Clonar el React Starter Kit

```bash
# Clonar el repositorio oficial
git clone https://github.com/laravel/react-starter-kit.git boda-alex-ana

cd boda-alex-ana

# Instalar dependencias de PHP
composer install

# Instalar dependencias de Node
npm install
```

---

## 🔧 Paso 2: Configuración Inicial

```bash
# Copiar archivo de entorno
cp .env.example .env

# Generar application key
php artisan key:generate
```

Edita `.env`:

```env
APP_NAME="Boda Alex & Ana"
APP_URL=http://localhost:8000

APP_LOCALE=es
APP_FALLBACK_LOCALE=es

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=boda_alex_ana
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

---

## 🗄️ Paso 3: Base de Datos

```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE boda_alex_ana CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 📦 Paso 4: Copiar Archivos Personalizados

### 4.1. Tipos TypeScript

Crea `resources/js/types/wedding.ts` con las interfaces proporcionadas.

### 4.2. Backend

Copia estos archivos PHP:

```
app/Models/Guest.php
app/Http/Controllers/GuestController.php
app/Http/Controllers/AdminController.php
app/Http/Middleware/GuestAuthentication.php
app/Http/Middleware/AdminMiddleware.php
database/migrations/xxxx_create_guests_table.php
database/seeders/GuestSeeder.php
```

### 4.3. Frontend

Copia estos archivos TypeScript:

```
resources/js/types/wedding.ts
resources/js/layouts/wedding-layout.tsx
resources/js/pages/guest/login.tsx
resources/js/pages/guest/dashboard.tsx
resources/js/pages/admin/dashboard.tsx
resources/js/pages/admin/printable-codes.tsx
```

### 4.4. Configuración

Reemplaza:
- `routes/web.php` - Rutas personalizadas
- `tailwind.config.ts` - Colores de la boda

---

## ⚙️ Paso 5: Registrar Middleware

Edita `bootstrap/app.php`:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Registrar middleware personalizados
        $middleware->alias([
            'guest.auth' => \App\Http\Middleware\GuestAuthentication::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## 🎨 Paso 6: Estilos Personalizados

Añade al principio de `resources/css/app.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

@layer components {
    .wedding-card {
        @apply rounded-lg border border-[#d4c5b9]/30 bg-white/70 p-6 shadow-lg backdrop-blur-sm;
    }

    .wedding-button {
        @apply rounded-lg bg-gradient-to-r from-[#8b7355] to-[#a89584] px-6 py-3 font-medium uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg;
    }
}
```

---

## 🗃️ Paso 7: Migración y Datos

```bash
# Ejecutar migraciones
php artisan migrate

# Cargar invitados (89 personas con códigos únicos)
php artisan db:seed --class=GuestSeeder
```

---

## 🎨 Paso 8: Compilar Assets

```bash
# Desarrollo (con hot reload)
npm run dev

# En otra terminal, iniciar servidor
php artisan serve
```

**Accede a:** http://localhost:8000

---

## 🔐 Credenciales de Prueba

- **Administración:** Código `ADMIN`
- **Invitados:** Códigos de 5 caracteres (ej: `ABC12`)

Para ver todos los códigos:
1. Login con `ADMIN`
2. Click en "Imprimir Códigos"

---

## 📁 Estructura Final del Proyecto

```
boda-alex-ana/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── GuestController.php          ← Nuevo
│   │   │   └── AdminController.php          ← Nuevo
│   │   └── Middleware/
│   │       ├── GuestAuthentication.php      ← Nuevo
│   │       └── AdminMiddleware.php          ← Nuevo
│   └── Models/
│       └── Guest.php                        ← Nuevo
│
├── database/
│   ├── migrations/
│   │   └── xxxx_create_guests_table.php     ← Nuevo
│   └── seeders/
│       └── GuestSeeder.php                  ← Nuevo
│
├── resources/
│   ├── js/
│   │   ├── types/
│   │   │   └── wedding.ts                   ← Nuevo
│   │   ├── layouts/
│   │   │   └── wedding-layout.tsx           ← Nuevo
│   │   ├── pages/
│   │   │   ├── guest/                       ← Nuevo
│   │   │   │   ├── login.tsx
│   │   │   │   └── dashboard.tsx
│   │   │   └── admin/                       ← Nuevo
│   │   │       ├── dashboard.tsx
│   │   │       └── printable-codes.tsx
│   │   └── components/
│   │       └── ui/                          ← Del starter kit
│   │           ├── button.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── checkbox.tsx
│   │           └── ...
│   └── css/
│       └── app.css                          ← Modificado
│
├── routes/
│   └── web.php                              ← Reemplazado
│
├── tailwind.config.ts                        ← Modificado
└── tsconfig.json                             ← Del starter kit
```

---

## ✅ Verificación

Comprueba que todo funciona:

- [ ] Login con código `ADMIN` accede al panel de administración
- [ ] Panel admin muestra estadísticas correctas (89 invitados total)
- [ ] Login con otro código muestra el dashboard de invitado
- [ ] Formulario de confirmación funciona
- [ ] Exportar CSV funciona
- [ ] Imprimir códigos funciona
- [ ] Estilos se ven correctos (colores crema/beige)

---

## 🎯 Componentes Shadcn/UI Utilizados

El starter kit incluye estos componentes que usamos:

- ✅ **Button** - Botones con variants
- ✅ **Input** - Campos de texto
- ✅ **Label** - Etiquetas de formulario
- ✅ **Textarea** - Campos de texto largos
- ✅ **Checkbox** - Casillas de verificación
- ✅ **RadioGroup** - Grupos de radio buttons
- ✅ **Badge** - Badges de estado

**No necesitas instalar nada adicional**, ya vienen con el starter kit.

---

## 🔄 Compilación para Producción

```bash
# Compilar assets optimizados
npm run build

# Optimizar autoloader
composer install --optimize-autoloader --no-dev

# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🐛 Troubleshooting

### TypeScript muestra errores

```bash
# Verificar tsconfig.json
cat tsconfig.json

# Reiniciar el servidor de desarrollo
npm run dev
```

### Componentes no se encuentran

Asegúrate de que los paths estén configurados en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  }
}
```

### Errores de tipado con Inertia

```bash
# Instalar tipos de Inertia
npm install -D @inertiajs/react @types/react @types/react-dom
```

---

## 📚 Recursos

- [Laravel Docs](https://laravel.com/docs)
- [Inertia.js Docs](https://inertiajs.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Shadcn/UI Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🎉 ¡Listo!

Tu webapp de boda está lista con:

- ✅ TypeScript para mayor seguridad de tipos
- ✅ Componentes profesionales de Shadcn/UI
- ✅ Inertia.js para SPA sin complejidad
- ✅ 89 invitados cargados con códigos únicos
- ✅ Panel de administración completo
- ✅ Diseño elegante y veraniego

**Próximos pasos:**
1. Personaliza colores/textos si es necesario
2. Genera el QR (ver GUIA_QR.md)
3. Despliega en producción (ver RESUMEN_Y_PROXIMOS_PASOS.md)
4. ¡Disfruta de vuestra boda! 🌴💝

---

¿Necesitas ayuda? Consulta la documentación incluida o contacta con el desarrollador.
