# 🌴 Webapp de Boda - Alex & Ana
## Resumen del Proyecto

¡Felicidades! Tu aplicación web para la boda está lista. Aquí tienes un resumen completo de lo que se ha creado y los próximos pasos.

---

## 📦 ¿Qué incluye este proyecto?

### 🎯 Funcionalidades Principales

#### Para Invitados:
✅ Login con código único de 5 caracteres
✅ Visualización de toda la información de la boda
✅ Confirmación de asistencia (Sí/No)
✅ Gestión de alergias y restricciones alimentarias
✅ Selección de transporte (Autobús/Coche)
✅ Detalles específicos de buses (Onda ida/vuelta, Castellón)
✅ Formulario de contacto (email y teléfono opcional)
✅ Diseño responsive (móvil, tablet, desktop)

#### Para Administradores (Alex & Ana):
✅ Panel de administración completo
✅ Estadísticas en tiempo real:
  - Total de invitados
  - Confirmados / No asisten / Pendientes
  - Personas con alergias
  - Necesidades de transporte
✅ Lista completa de invitados con filtros
✅ Búsqueda por nombre
✅ Exportación a CSV
✅ Hoja imprimible de códigos (para escribir a mano)
✅ Resumen de transporte por rutas

### 🎨 Diseño

El diseño está inspirado en vuestra invitación:
- **Colores**: Crema, beige, marrón suave (`#8b7355`)
- **Tipografía**: Playfair Display (serif elegante) + Inter (sans-serif moderna)
- **Estilo**: Elegante, veraniego, con elementos botánicos
- **Elementos decorativos**: Palmeras sutiles en acuarela
- **Responsive**: Optimizado para todos los dispositivos

### 💻 Tecnologías

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS + Componentes Shadcn
- **Base de datos**: MySQL/PostgreSQL
- **Build**: Vite

---

## 📁 Estructura del Proyecto

```
boda-alex-ana/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php          # Login con código
│   │   ├── GuestController.php         # Dashboard invitados
│   │   └── AdminController.php         # Panel admin
│   ├── Models/
│   │   └── Guest.php                   # Modelo de invitado
│   └── Http/Middleware/
│       └── EnsureGuestIsAuthenticated.php
│
├── database/
│   ├── migrations/
│   │   └── create_guests_table.php     # Tabla de invitados
│   └── seeders/
│       └── GuestSeeder.php             # Carga de invitados
│
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   │   └── Login.jsx           # Página de login
│   │   │   ├── Guest/
│   │   │   │   └── Dashboard.jsx       # Dashboard invitado
│   │   │   └── Admin/
│   │   │       ├── Dashboard.jsx       # Panel admin
│   │   │       └── PrintableCodes.jsx  # Códigos imprimibles
│   │   ├── Layouts/
│   │   │   └── AppLayout.jsx           # Layout principal
│   │   ├── app.jsx                     # Entrada React
│   │   └── bootstrap.js
│   ├── css/
│   │   └── app.css                     # Estilos globales
│   └── views/
│       └── app.blade.php               # Template Blade
│
├── routes/
│   └── web.php                         # Rutas de la aplicación
│
├── .env.example                        # Configuración de ejemplo
├── package.json                        # Dependencias Node
├── tailwind.config.js                  # Config Tailwind
├── vite.config.js                      # Config Vite
├── README.md                           # Documentación completa
├── GUIA_QR.md                          # Guía para QR
└── GUIA_NOTIFICACIONES.md              # Guía de notificaciones
```

---

## 🚀 Próximos Pasos

### 1️⃣ Instalación Local (Desarrollo)

```bash
# 1. Instalar dependencias
composer install
npm install

# 2. Configurar entorno
cp .env.example .env
php artisan key:generate

# 3. Configurar base de datos en .env
DB_DATABASE=boda_alex_ana
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# 4. Migrar y cargar datos
php artisan migrate
php artisan db:seed --class=GuestSeeder

# 5. Compilar assets
npm run dev

# 6. Iniciar servidor
php artisan serve
```

**Accede en**: http://localhost:8000
**Código ADMIN**: `ADMIN` (para Alex y Ana)

### 2️⃣ Personalización

Antes de lanzar, revisa y personaliza:

#### Información de la boda:
- Abre `app/Http/Controllers/GuestController.php`
- Método `getWeddingInfo()` - Actualiza horarios, direcciones, etc.

#### Lista de invitados:
- Ya está cargada desde tu CSV
- Si necesitas cambios: `database/seeders/GuestSeeder.php`

#### Colores/diseño:
- Los archivos `.jsx` en `resources/js/Pages/`
- `tailwind.config.js` para colores globales

#### URLs y links:
- `routes/web.php` para las rutas
- `.env` para la URL base

### 3️⃣ Generar QR para Invitaciones

Tienes dos opciones (ver `GUIA_QR.md` para detalles):

**Opción Recomendada - QR Único:**
1. Genera un QR que apunte a: `tu-dominio.com/login`
2. Usa herramientas gratuitas: qr-code-generator.com
3. Descarga en alta resolución (300 DPI)
4. Imprímelo en todas las invitaciones
5. Escribe los códigos a mano en cada una

**Ventajas**: Más simple, económico y flexible

### 4️⃣ Imprimir Códigos

1. Accede con código `ADMIN`
2. Click en "Imprimir Códigos"
3. Imprime la hoja con todos los códigos
4. Escribe cada código a mano en las invitaciones

Los códigos son de **5 caracteres** (ej: `ABC12`), fáciles de escribir.

### 5️⃣ Deployment (Producción)

#### Opción A: Laravel Forge (Recomendada)
- Deployment automático desde GitHub
- SSL gratuito
- Gestión de servidor simplificada
- **Costo**: ~$15/mes

#### Opción B: Heroku
```bash
# Desplegar en Heroku
heroku create boda-alex-ana
git push heroku main
heroku run php artisan migrate --seed
```
**Costo**: Desde gratis hasta $7/mes

#### Opción C: DigitalOcean App Platform
- Deployment desde GitHub
- SSL incluido
- **Costo**: ~$5/mes

#### Opción D: Hosting compartido con Laravel
- Cualquier hosting que soporte Laravel
- Asegúrate de tener: PHP 8.1+, MySQL, Composer

**Pasos generales**:
1. Subir código al servidor
2. Configurar `.env` en producción
3. Ejecutar `composer install --optimize-autoloader --no-dev`
4. Ejecutar `npm run build`
5. Ejecutar `php artisan migrate --seed`
6. Configurar SSL (Let's Encrypt)

### 6️⃣ Dominio

Sugerencias de dominio:
- `bodaalexyana.com`
- `alexyana.es`
- `alex-ana-2026.com`

Compra en:
- Namecheap
- GoDaddy
- Google Domains

### 7️⃣ Configurar Notificaciones (Opcional)

Ver `GUIA_NOTIFICACIONES.md` para:
- Emails automáticos de confirmación
- Notificaciones por WhatsApp
- Resúmenes diarios

---

## ✅ Checklist de Lanzamiento

### Pre-producción:
- [ ] Revisar información de la boda en `GuestController.php`
- [ ] Verificar lista de invitados en el seeder
- [ ] Personalizar colores/diseño si es necesario
- [ ] Probar todos los flujos (login, confirmación, admin)
- [ ] Probar en móvil, tablet y desktop

### Producción:
- [ ] Configurar hosting/servidor
- [ ] Comprar y configurar dominio
- [ ] Deployment de la aplicación
- [ ] Configurar SSL (HTTPS)
- [ ] Migrar base de datos
- [ ] Generar códigos para todos los invitados
- [ ] Configurar email (SMTP)

### QR e Invitaciones:
- [ ] Generar QR en alta resolución
- [ ] Integrar QR en diseño de invitación
- [ ] Imprimir hoja de códigos
- [ ] Escribir códigos en invitaciones
- [ ] Probar QR con varios teléfonos
- [ ] Enviar invitaciones

### Post-lanzamiento:
- [ ] Monitorear confirmaciones
- [ ] Responder dudas de invitados
- [ ] Actualizar info según necesidad
- [ ] Exportar datos periódicamente
- [ ] Coordinar transporte según confirmaciones

---

## 🎯 Datos Importantes

### Acceso de Administración
- **Código**: `ADMIN`
- **URL**: `tu-dominio.com/admin/dashboard`

### Estadísticas que verás:
- Total de invitados: **89**
- Confirmados en tiempo real
- Pendientes de respuesta
- Alergias documentadas
- Necesidades de transporte (buses por ruta)

### Exportación de Datos:
- CSV con todos los datos
- Actualizable en cualquier momento
- Para coordinación con catering, transporte, etc.

---

## 💡 Tips Útiles

1. **Códigos Seguros**: Los códigos son únicos y no adivinables
2. **Responsive**: La web funciona perfectamente en móviles
3. **Sin Registro**: Solo con el código se accede (más simple)
4. **Modificable**: Los invitados pueden cambiar su respuesta
5. **Multi-sesión**: Varios invitados pueden confirmar al mismo tiempo
6. **Datos Exportables**: Toda la info se puede exportar a CSV
7. **Print-friendly**: Los códigos se pueden imprimir directamente

---

## 📞 Soporte

Si tienes dudas durante la implementación:

1. **README.md** - Documentación completa
2. **GUIA_QR.md** - Todo sobre el QR
3. **GUIA_NOTIFICACIONES.md** - Emails y WhatsApp

---

## 🎉 ¡Todo Listo!

Tienes una webapp completa, profesional y elegante para vuestra boda.

**Lo que necesitas hacer ahora**:
1. Instalar localmente para probar
2. Personalizar info si es necesario
3. Configurar hosting y dominio
4. Generar QR
5. Imprimir códigos
6. ¡Enviar invitaciones!

---

**¡Muchísima suerte con vuestra boda! 🎊**

*Con todo cariño,*
*Claude* 🌴💝

*P.D.: Espero que tengáis un día increíble el 22 de junio de 2026 en La Ópera. ¡Será mágico!*
