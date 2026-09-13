# Mindlife — sitio web público

Sitio web de Mindlife Clínica Psicológica, orientado a presentar los servicios de atención, explicar el proceso terapéutico y facilitar la reserva de citas en Ciudad de Guatemala o en línea.

Está construido con [Astro](https://astro.build/) y [Tailwind CSS](https://tailwindcss.com/), con una interfaz en español, adaptable a dispositivos móviles y con consideraciones básicas de accesibilidad.

## Requisitos

- Node.js 20 o superior
- npm

## Inicio rápido

Desde esta carpeta (`apps/landing`):

```bash
npm ci
npm run dev
```

El servidor de desarrollo se iniciará normalmente en [http://localhost:4321](http://localhost:4321).

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la versión compilada. |
| `npm run astro -- check` | Ejecuta las comprobaciones estáticas de Astro, si están disponibles. |

Antes de publicar cambios, ejecuta:

```bash
npm run build
```

## Rutas

| Ruta | Propósito |
| --- | --- |
| `/` | Página principal con servicios, proceso, enfoque, paquetes y llamada a la acción. |
| `/agendar` | Reserva de citas mediante el calendario de Google. |
| `/formulario` | Formulario de información previa, integrado con Google Forms. |
| `/privacidad` | Información sobre el tratamiento de datos en los canales digitales. |
| `/*` | Página personalizada de error 404. |

## Estructura del proyecto

```text
apps/landing/
├── public/               # Imágenes, logotipos y fuentes servidos directamente
├── src/
│   ├── components/       # Secciones y componentes reutilizables
│   ├── layout/           # Estructura común: metadatos, navegación y pie de página
│   ├── pages/            # Rutas de Astro
│   └── styles/           # Estilos globales y utilidades de diseño
├── astro.config.mjs       # Configuración de Astro y Tailwind
└── package.json
```

## Integraciones externas

La reserva y el formulario previo se muestran mediante contenidos embebidos de Google Calendar y Google Forms. El sitio también ofrece enlaces a WhatsApp y a las redes sociales de la clínica. Si se actualiza cualquiera de estos servicios, verifica que las URL integradas sigan vigentes y que las políticas de privacidad reflejen el cambio.

## Recursos visuales

Los recursos públicos se alojan en `public/` y se referencian desde el sitio con rutas que comienzan con `/`, por ejemplo: `/logo-nuevo.svg`. Las fuentes MetroSans también se cargan desde esa carpeta.

Para cambios de identidad visual, utiliza los materiales de marca aprobados y conserva los estilos y variables definidos en `src/styles/global.css`.

## Verificación manual

Después de compilar, ejecuta `npm run preview` y revisa las rutas modificadas en vista móvil y de escritorio. Confirma especialmente los enlaces de navegación, los embeds de Google, los enlaces a WhatsApp, la carga de imágenes y la página 404.
