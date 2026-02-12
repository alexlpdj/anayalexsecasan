# 🌴 Webapp de Boda - Alex & Ana


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

El diseño está inspirado en la invitación:
- **Colores**: Crema, beige, marrón suave (`#8b7355`)
- **Tipografía**: Playfair Display (serif elegante) + Inter (sans-serif moderna)
- **Estilo**: Elegante, veraniego, con elementos botánicos
- **Elementos decorativos**: Palmeras sutiles en acuarela
- **Responsive**: Optimizado para todos los dispositivos

### 💻 Tecnologías

- **Backend**: Laravel 12
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS + Componentes ShadcnUI
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


