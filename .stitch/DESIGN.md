# Mindlife web design system

## Purpose and source of truth

This codebase is the public website and appointment journey for **Mindlife Clínica Psicológica**, a psychological clinic in Ciudad de Guatemala. Its job is to explain the clinic's individual, couples, and family therapy services; establish a respectful, confidential, person-centred tone; show session and package prices in quetzales; and move a visitor safely through selecting care, reserving a time, confirming the booking, and completing pre-session information.

The rendered Astro source is the product source of truth. The repository `README.md` is still the generic “Astro Starter Kit: Minimal” document and contains no Mindlife product positioning; do not use its astronaut copy, badges, or starter structure as product content. For product language and hierarchy, use the active route and component copy listed below. Brand source files live one level above the app in `../manual-de-marca-mindlife/`, but this document records the system actually implemented in `src/` and the assets actually served from `public/`.

## Product goals reflected by the implementation

1. Lead with professional emotional-wellbeing care: “Un espacio profesional para cuidar tu bienestar emocional.”
2. Make care options understandable: individual, couples, and family therapy, available in person and online.
3. Reduce uncertainty with a visible three-step journey: choose care, reserve a time, complete information.
4. Build trust through restrained claims: respect, confidentiality, shared goals, and person-centred care. Do not promise outcomes.
5. Make prices, session length, modality, availability, cancellation terms, and emergency limitations explicit.
6. Make booking the primary conversion. WhatsApp is the assistance and coordination fallback, not the main information architecture.
7. Preserve privacy and clinical safety: avoid asking for sensitive clinical information in public or third-party free-text fields.

## Native information shape

The product is a **guided care-selection and booking pipeline**, not a generic marketing-section template:

`service → modality → payment option → schedule/coordination → confirmation → intake form`

The homepage introduces that pipeline in this order:

1. Hero: clinic, location, core care proposition, and primary booking action.
2. Services: individual, couples, and family therapy.
3. Process: the same three booking steps used by the booking route.
4. Approach: listening without judgement, shared goals, confidentiality.
5. Investment: therapy tabs and package cards with real prices and durations.
6. Emergency limitation notice.
7. Final booking and consultation CTA.

New designs should preserve this priority. Emotional care and the path to an appropriate appointment come before promotional metrics or unsupported social proof.

## Critical files

| File | Role |
| --- | --- |
| `src/styles/global.css` | Canonical color, typography, radius, shadow, container, section, button, card, focus, and reduced-motion rules. |
| `src/layout/MainLayout.astro` | Shared document shell, Spanish locale, metadata, skip link, navigation, footer, and default site description. |
| `src/pages/index.astro` | Canonical homepage composition and content hierarchy. |
| `src/components/HeroSection.astro` | Highest-weight product message, core actions, trust attributes, and hero image treatment. |
| `src/components/Services.astro` | Canonical service taxonomy and numbered service-card pattern. |
| `src/components/Process.astro` | Canonical three-step booking model and step-card pattern. |
| `src/components/Approach.astro` | Clinical tone, person-centred principles, and secondary photography pattern. |
| `src/components/Packages.astro` | Real pricing data, therapy segmentation, durations, package selection, featured-card treatment, and booking query schema. |
| `src/pages/agendar.astro` | Core interactive journey: service, modality, package, booking summary, Google Calendar state, WhatsApp coordination, loading/delay states, and cancellation terms. |
| `src/pages/cita-confirmada.astro` | Confirmation caveat, selected-care summary, preparation steps, and modality-specific instructions. |
| `src/pages/formulario.astro` | Pre-session intake handoff and embedded Google Forms states. |
| `src/pages/privacidad.astro` | Privacy language and safe handling of contact and clinical information. |
| `src/components/Navbar.astro` / `Footer.astro` | Global navigation, contact details, location, social links, and booking CTA. |
| `public/logo-nuevo.svg`, `public/logo-blanco.svg`, `public/logo-nuevo-icono.svg` | Canonical logo variants and favicon. |
| `public/imagen-hero-libertad.webp`, `public/soporte-terapia.webp` | Canonical photography used by the active homepage. |

`src/components/BenefitsSection.astro`, `FinalCTA.astro`, `Testimonial.astro`, and `UserForm.astro` are not imported by any active route. They use an older visual language and include claims, testimonials, options, or English copy that are not supported by the active experience. Treat them as legacy code, not as design-system precedent or approved content.

## Brand character and content voice

The visual and verbal character is calm, clinical, warm, and direct. Copy is Spanish, specific, and non-sensational. It describes what happens, what is available, and what limitations apply.

- Use “atención”, “acompañamiento”, “proceso”, “sesión”, “reservación”, “modalidad”, “objetivos”, “bienestar emocional”, and “persona”.
- Prefer “Agendar una cita”, “Reservar un horario”, “Completar formulario previo”, and “Consultar por WhatsApp” for actions.
- Explain uncertainty honestly: availability is confirmed when booking; a package does not guarantee clinical outcomes; confirmation comes from Google Calendar or the Mindlife team.
- Never invent clinician biographies, credentials, years of experience, patient names, testimonials, success rates, outcome claims, or additional service types.
- Do not reuse the legacy claims “10 años de experiencia”, “profesionales certificados”, or the hard-coded testimonials unless independently verified and deliberately reintroduced.
- Emergency copy must remain explicit: Mindlife is not an immediate-care service; users should contact local emergency services or the nearest care centre.

## Color system

The active palette is defined in `src/styles/global.css` and echoed by the current logo SVGs.

| Token | Value | Intended use |
| --- | --- | --- |
| `--color-primary` | `#1f3361` | Main navy: hero and CTA backgrounds, headings, primary buttons, active tabs, links. Also the browser theme color. |
| `--color-primary-dark` | `#142344` | Dark navy: footer background and strongest dark surface. |
| `--color-primary-soft` | `#e9edf5` | Pale navy: pricing/404 backgrounds, numbered circles, selection summaries, subtle information blocks. |
| `--color-accent` | `#8e6ba5` | Lilac: secondary CTA, active/featured accents, focus outline, loading spinner, logo accent. |
| `--color-accent-dark` | `#705285` | Dark lilac: eyebrow text and accessible accent text on light surfaces. |
| `--color-accent-soft` | `#f1ebf4` | Pale lilac: help, safety, privacy, featured and emergency-support surfaces. |
| `--color-bg` | `#ffffff` | Page background, cards, navigation, embedded-content surfaces. |
| `--color-surface` | `#f8f7fa` | Alternating neutral section background for process and form/booking flows. |
| `--color-text` | `#172033` | Default body copy. |
| `--color-muted` | `#525b6b` | Supporting copy, captions, notes, and subdued metadata. |
| `--color-on-primary` | `#ffffff` | Copy and controls on navy/accent surfaces. |
| `--color-border` | `#d9dce3` | Card, input, divider, iframe, and navigation borders. |

Use semantic variables and the helper classes in `global.css` rather than adding raw brand hex values. White-on-navy copy typically uses `white/75`, `white/80`, `white/85`, or `white/90` to create hierarchy. Accent text on light backgrounds uses the darker `--color-accent-dark`; the base accent is primarily a fill, border, icon, or decorative color.

The extended purple, blue, green, and indigo entries in `tailwind.config.cjs` reference CSS variables that are not defined in `global.css`. They are not part of the active system. The old components that use generic Tailwind purple/blue/gray colors should not guide new work.

## Typography

The only active family is **Metro Sans**, loaded locally from `public/fonts/`:

- 400: `MetroSans-Book.ttf`
- 500: `MetroSans-Medium.ttf`
- 600: `MetroSans-SemiBold.ttf`
- 700: `MetroSans-Bold.ttf`
- Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`

Use weight, size, color, and spacing for hierarchy; the system does not introduce a second display face.

| Role | Current pattern |
| --- | --- |
| Homepage hero H1 | `2.15rem` mobile, `3rem` small screens, `3.75rem` large screens; 700; line-height 1.15; white. |
| Route hero H1 | `2.25rem` mobile, `3rem` small screens; 700; white. |
| Section H2 | `1.875rem` mobile, `2.25rem` small screens; 700; primary navy. |
| Card/step H3 | `1.25rem`; 700; primary navy. |
| Intro/body lead | `1.125rem`; normal weight; muted or white at 85%. |
| Body | browser `1rem`; line-height 1.6; `--color-text`. |
| Small note | `0.875rem`; muted. |
| Eyebrow | `0.8rem`; 700; uppercase; `0.12em` letter spacing; dark accent. On dark surfaces use `0.875rem`, `0.14em`, white at 70–80%. |
| Price | `2.25rem`; 700; primary navy. |
| Large status numeral | `2.25rem` in process cards, accent at 30%; `4.5–8rem` for the 404 numeral. |

Global headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

## Layout and spacing

- Mobile-first responsive layout.
- Main container: `width: min(100% - 2rem, 1180px)`; from 640px, `min(100% - 4rem, 1180px)`.
- Standard section spacing: `padding-block: clamp(3.5rem, 8vw, 7rem)`.
- Standard content max widths: 2xl for supporting copy, 3xl for section introductions, 4xl/5xl for focused booking and form flows.
- Primary desktop split: two columns at `lg`, commonly near `1.05fr / 0.95fr` for the hero and `1fr / 1fr` for the approach.
- Booking desktop split: sticky configuration sidebar plus main task panel at `0.72fr / 1.28fr`.
- Three-up grids are used only when the source naturally has three items: services, process steps, packages, and cancellation rules.
- Typical vertical rhythm: 0.75rem between eyebrow and heading, 1.25rem between heading and lead, 2–3rem before a card grid, 0.75rem between card heading and body.
- Common gaps: 1rem mobile, 1.5rem larger screens; 2–3rem for major split layouts.
- Navigation is sticky with roughly 88px accounted for by `scroll-padding-top`.

Alternate white, `--color-surface`, `--color-primary-soft`, and full navy sections to mark conceptual changes. Avoid arbitrary decorative section templates.

## Shape, borders, and elevation

The system is rounded and reassuring without becoming playful.

- Standard card radius: `--radius-md: 16px` / `rounded-2xl`.
- Large media radius: `--radius-lg: 28px`.
- Hero media: 24px image radius inside a 32px offset outline.
- Controls and compact information panels: 12px (`rounded-xl`).
- Buttons, tabs, badges, and circular indices: fully rounded (`999px`).
- Standard border: 1px solid `--color-border`.
- Featured package: 2px accent border plus soft shadow.
- `--shadow-card`: `0 8px 24px rgba(31, 51, 97, 0.08)`.
- `--shadow-soft`: `0 16px 40px rgba(31, 51, 97, 0.1)`.
- Hero image uses a stronger `shadow-2xl`; do not spread this elevation across ordinary cards.

## Component patterns

### Global navigation

White sticky header, bottom border, navy/lilac logo, text links, and a navy “Agendar cita” pill. Desktop links are visible at `lg`; mobile uses a 48px-friendly menu button and a vertical disclosure menu. Links are “Servicios”, “Cómo funciona”, “Precios”, and “Contacto”. Preserve Escape-to-close, `aria-expanded`, `aria-hidden`, and body scroll lock.

### Hero

Full navy surface with a low-opacity oversized circular outline, a two-column text/image layout, one dominant H1, a lilac primary booking CTA, and a white secondary service CTA. Below the actions, short check-mark attributes state the service facts: in-person/online, confidential process, and reservation-based times. The hero image is `imagen-hero-libertad.webp`, 3:2, cover-cropped.

### Section introduction

Eyebrow → navy heading → muted lead, usually within `max-w-3xl`. Centre only process and investment sections; use left alignment for service and approach explanations.

### Cards

White surface, 16px radius, subtle border and shadow, 24–28px padding. Service cards start with a two-digit lilac index in a pale-lilac circle. Process cards use a large faded step number. Do not add icons when the number or text already provides the organising cue.

### Buttons and text actions

All main buttons have at least 48px height, 999px radius, 12px/24px padding, 700 weight, and a 180ms lift/shadow hover.

- Primary: navy fill, white text.
- Secondary: lilac fill, white text.
- Light: white fill, navy text; add a navy border when used on a white surface.
- Inline/help action: bold navy underlined text with a 4px underline offset.

Keep one primary action per decision point. Button labels should name the next step, not use generic “Learn more” language.

### Tabs and selection controls

Therapy tabs form a joined pill with a navy border. Active state is navy/white; inactive is white/navy. Form selects are full width, at least 48px tall, white, 12px radius, 1px border, and 16px horizontal padding. Focus uses accent border plus a soft accent ring.

### Pricing

Segment by “Individual” and “Pareja o familia”. Each set has three options: single session, four sessions, six sessions. The four-session package is marked “Opción frecuente” with a lilac pill and stronger border/shadow. Show package name, total price, session count and duration, effective per-session note where present, and “Agendar esta opción”. Prices are quetzales and come from `Packages.astro` / booking data:

- Individual, 45 minutes: Q250; Q750 for 4; Q950 for 6.
- Couples/family, 90 minutes: Q350; Q1100 for 4; Q1500 for 6.

### Booking pipeline

Use visible “Paso 1”, “Paso 2”, and “Paso 3” labels consistently. Keep the live selection summary close to the selectors. Individual online care uses the embedded Google Calendar; couples/family or in-person care switches to a WhatsApp coordination panel because the duration or room availability differs. Preserve loading, delayed-load, embedded-service, and no-JavaScript messages.

The URL state schema is part of the interface:

- `servicio`: `individual` or `pareja-familia`
- `modalidad`: `online` or `presencial`
- `paquete`: `sesion-unica`, `paquete-4`, or `paquete-6`

Carry this state through `/agendar`, `/cita-confirmada`, and `/formulario` so users see a consistent summary.

### Notices and safety states

- Pale lilac with accent border: important confirmation, privacy, or precondition notes.
- Pale lilac without border: help/coordination support.
- Navy block with white text: next-step confirmation or modality-specific instructions.
- Small muted text: legal, availability, third-party, and outcome limitations.
- Loading: accent-topped spinner on white, bold navy status, muted explanatory line.

### Footer

Dark navy background, white logo, three-column desktop structure, subdued white copy, and circular social controls. Preserve the real contact information: Galerías Reforma, Avenida Reforma 8-60, zona 9, oficina 210, Ciudad de Guatemala; +502 4360 5982; clinicasmindlife@gmail.com.

## Photography and brand assets

Use the shipped WebP files in active layouts; JPEG files are source/fallback copies and `bg.jpg` is currently unused.

- `imagen-hero-libertad.webp`: 1600×1068, used as a calm 3:2 hero crop.
- `soporte-terapia.webp`: 1600×987, used as a 4:3 approach crop showing therapeutic conversation.
- Use descriptive Spanish alt text already present in the components.
- Logos use navy `#1f3361` and lilac `#8e6ba5`; the footer uses the white/lilac variant.
- Prefer genuine clinic-appropriate, calm human imagery. Do not introduce clinical clichés, diagnostic imagery, or fabricated staff/patient portraits.

## Responsive behaviour

- Mobile is a single-column reading and action flow.
- Stack paired CTAs full width on mobile; switch to intrinsic width and horizontal layout at `sm`.
- Three-card groups become three columns at `md`.
- Hero, approach, footer, and booking split into multiple columns at `lg`.
- Booking configuration becomes sticky only at `lg` (`top-28`).
- Preserve minimum 48px interactive heights and comfortable mobile gutters.
- Embedded calendar/form frames remain full width; retain the current minimum heights to avoid unusable clipped third-party content.

## Accessibility and interaction requirements

- Document language is `es`; include the skip link to `#contenido`.
- Every interactive element must retain a visible focus indicator: 3px accent outline with 3px offset globally.
- Use semantic `section`, `article`, `nav`, `ol`, `dl`, `aside`, and headings with explicit `aria-labelledby` where already established.
- Keep accessible tab roles/states, menu disclosure states, live booking summary, loading `role="status"`, and `aria-busy` states.
- Do not use color alone to communicate selection or warnings; pair it with labels, borders, text, or structure.
- Respect `prefers-reduced-motion`: disable smooth scrolling and collapse transition/animation duration.
- External links opening a new tab use `target="_blank"` with `rel="noopener noreferrer"`.
- Third-party embeds must include a direct-open fallback and privacy/context copy.

## Design guardrails

- Build from the active service, process, pricing, booking, privacy, and contact content. Do not add placeholder sections or invented features.
- Preserve the homepage’s dominant proposition and booking path before adding secondary content.
- Reuse `site-container`, `section-space`, `eyebrow`, semantic color helpers, button classes, and `card-brand`.
- Keep page files focused on composition; reusable sections belong in `src/components/`.
- Use root-relative public asset paths such as `/logo-nuevo.svg`.
- Do not copy legacy generic Tailwind blue/purple cards into active pages.
- Do not present `/cita-confirmada` as proof that a booking exists; confirmation must still come from Google Calendar or the Mindlife team.
- Do not imply that Mindlife provides emergency or immediate-response care.

## Current implementation goals for future work

Future design changes should strengthen, without changing the verified product model:

1. Consistency across homepage, booking, confirmation, intake, privacy, and 404 routes.
2. Clear state continuity throughout the query-driven booking journey.
3. Trust through precise, ethical clinical language and visible limitations.
4. Responsive usability for selection controls, embedded tools, navigation, and calls to action.
5. Consolidation around the active semantic tokens and component patterns while preventing unused legacy components from reintroducing unsupported content or obsolete styling.
