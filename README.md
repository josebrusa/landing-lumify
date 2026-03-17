# Lumify — Landing de consultoría PIM & Data Governance

Este proyecto es una landing page desarrollada con **Vue 3 + TypeScript + Vite**, orientada a presentar los servicios de consultoría en **PIM, gobierno de datos y syndication omnicanal** de Lumify.

El objetivo de este README es que cualquier desarrollador pueda:

- **Levantar el proyecto en local** en pocos minutos.
- **Entender la arquitectura básica** (páginas, secciones, stores, composables).
- **Extender o modificar funcionalidades** (nuevas secciones, contenidos, tests, etc.).

---

## Requisitos previos

- **Node.js** ≥ 18 (recomendado usar `nvm`).
- **npm** (incluido con Node).

Comprueba tu versión:

```bash
node -v
npm -v
```

---

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <URL_DEL_REPO>
cd lumify
npm install
```

> El proyecto usa un `package-lock.json`, por lo que se recomienda **mantener npm** como gestor por defecto.

---

## Scripts disponibles

Todos los comandos se ejecutan desde la raíz del proyecto (`lumify`).

- **Desarrollo**:

  ```bash
  npm run dev
  ```

  Levanta el servidor de desarrollo de Vite (por defecto en `http://localhost:5173`).

- **Build de producción**:

  ```bash
  npm run build
  ```

  Genera la versión optimizada en la carpeta `dist/`.

- **Previsualización del build**:

  ```bash
  npm run preview
  ```

  Sirve el contenido de `dist/` para revisar el build localmente.

- **Tests unitarios**:

  ```bash
  npm run test
  ```

  Ejecuta la suite de tests con **Jest** + **@vue/test-utils**.

- **Tests en modo watch**:

  ```bash
  npm run test:watch
  ```

---

## Estructura del proyecto

Resumen de los directorios y archivos principales:

- **`index.html`**: plantilla HTML principal usada por Vite.
- **`src/main.ts`**: punto de entrada de la aplicación; monta `App.vue`, registra el router y los stores.
- **`src/App.vue`**: shell raíz de la SPA; suele contener el layout general (navbar, footer, router-view).
- **`src/pages/Home.vue`**: página principal de la landing; compone las distintas secciones.
- **`src/components/layout`**:
  - `Nav.vue`: cabecera / navegación principal.
  - `Footer.vue`: pie de página.
- **`src/components/sections`**:
  Componentes de sección de la landing:
  - `Hero.vue`
  - `About.vue`
  - `Methodology.vue`
  - `Services.vue`
  - `Packs.vue`
  - `Retainers.vue`
  - `Register.vue` (sección de registro/contacto).
- **`src/components/modals`**:
  - `Modal.vue`: modal base reutilizable.
  - `PricingModal.vue`: modal específico para planes/precios.
- **`src/stores`** (Pinia):
  - `index.ts`: registro e inicialización de Pinia.
  - `locale.ts`: gestión de idioma/locale.
  - `modal.ts`: estado de modales (abierto/cerrado, modal activo, etc.).
- **`src/composables`**:
  - `useI18n.ts`: lógica de internacionalización basada en los datos de `src/data/translations.ts`.
  - `useModals.ts`: helpers para abrir/cerrar modales desde componentes.
  - `useFocusTrap.ts`: gestión de foco accesible dentro de modales.
  - `useScrollReveal.ts`: animaciones/efectos al hacer scroll.
  - `__tests__/...`: tests unitarios específicos de estos composables.
- **`src/data`**:
  - `translations.ts`: diccionario de textos por idioma (por ahora ES, extensible a más).
  - `modalData.ts`: contenido y configuración de los distintos modales.
- **`src/router/index.ts`**:
  Configuración del router de Vue (rutas principales, actualmente centradas en `Home`).
- **`src/style.css`**:
  Estilos globales, integración con TailwindCSS 4 (via `@tailwindcss/vite`) y tipografías.
- **`public/`**:
  - `favicon.svg`, `icons.svg`
  - `robots.txt`, `sitemap.xml`

---

## Flujo de desarrollo típico

1. **Arrancar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

2. **Editar secciones de la landing**:
   - Modificar o añadir componentes en `src/components/sections`.
   - Registrar nuevas secciones dentro de `Home.vue`.

3. **Actualizar textos / idiomas**:
   - Añadir o modificar claves en `src/data/translations.ts`.
   - Usar el composable `useI18n` dentro de los componentes para consumir esos textos.

4. **Gestionar modales**:
   - Declarar nuevos tipos de modal o contenidos en `src/data/modalData.ts`.
   - Usar la store `modal` y el composable `useModals` para abrir/cerrar modales.

5. **Añadir tests**:
   - Crear archivos `.spec.ts` o `.spec.vue` en las carpetas `__tests__` existentes o en nuevas.
   - Ejecutar `npm run test` o `npm run test:watch` mientras desarrollas.

---

## Internacionalización (i18n)

La internacionalización se basa en un **diccionario estático** en `src/data/translations.ts` y un composable `useI18n`.

- Para **añadir un nuevo idioma**, por ejemplo `en`:
  - Añadir un nuevo objeto de traducciones para `en` en `translations.ts`.
  - Extender la store `locale` para aceptar el nuevo código de idioma.
  - Ajustar `Nav.vue` (o donde se encuentre el selector de idioma) para permitir cambiar a `en`.

- Para **usar textos traducidos en un componente**:
  - Importar y usar `useI18n` dentro del `setup()`.
  - Leer las claves definidas en `translations.ts` usando el helper que exponga el composable (por ejemplo, una función `t('clave')` o acceso directo a un objeto reactivo, según implementación).

---

## Estilos y diseño

El proyecto utiliza:

- **TailwindCSS 4** integrado vía `@tailwindcss/vite`.
- Tipografías **Syne** y **DM Sans** cargadas en `index.html`.
- Estilos globales en `src/style.css`.

Recomendaciones para extender el diseño:

- Centralizar colores, tamaños y espaciados en utilidades de Tailwind siempre que sea posible.
- Mantener coherencia tipográfica reutilizando las mismas clases de tamaño/peso en secciones similares (títulos, subtítulos, body, etc.).
- Evitar lógica de presentación compleja dentro de los componentes de sección; si crece, extraer en componentes más pequeños.

---

## Testing

La configuración de tests está en `jest.config.cjs` y usa:

- **Jest** como runner.
- **jest-environment-jsdom** como entorno.
- **@vue/vue3-jest** para montar componentes Vue.
- **@vue/test-utils** para utilidades de testing en Vue 3.

Arquitectura de tests actual:

- `src/components/sections/__tests__/Register.spec.ts`: testea la sección de registro.
- `src/composables/__tests__/useI18n.spec.ts`: testea la lógica de internacionalización.
- `src/composables/__tests__/useModals.spec.ts`: testea la gestión de modales.

Para añadir nuevos tests:

- Crea archivos `.spec.ts` o `.spec.vue` siguiendo la estructura de carpetas actual.
- Asegúrate de usar `@vue/test-utils` para montar componentes y simular interacciones.

---

## Cómo continuar el desarrollo

Algunas líneas de trabajo habituales:

- **Nuevas secciones de contenido**:
  - Crear un nuevo componente en `src/components/sections`.
  - Importarlo y usarlo en `Home.vue`.
  - Añadir textos en `translations.ts` y usarlos vía `useI18n`.

- **Nuevos modales (por ejemplo, para lead magnets específicos)**:
  - Definir el contenido y metadatos en `modalData.ts`.
  - Añadir la lógica necesaria en la store `modal` si hace falta un nuevo tipo/estado.
  - Reutilizar `Modal.vue` / `PricingModal.vue` o crear un modal nuevo según complejidad.

- **Mejoras de accesibilidad**:
  - Revisar uso de `useFocusTrap` en modales.
  - Asegurar roles ARIA y navegación con teclado en `Nav.vue` y componentes clave.

- **Optimización de rendimiento**:
  - Lazy-load de secciones pesadas mediante `defineAsyncComponent` o rutas divididas en chunks.
  - Revisión de efectos de scroll en `useScrollReveal` para evitar trabajo innecesario.

Antes de abrir un PR o hacer un merge importante:

1. Ejecuta `npm run build` para asegurar que el build pasa.
2. Ejecuta `npm run test` para confirmar que los tests siguen en verde.

---

## Convenciones de código

No exhaustivo, pero recomendado:

- **Lenguaje**: TypeScript siempre que sea posible en lógica y stores.
- **Componentes**:
  - API de composición (`<script setup lang="ts">`) como estilo por defecto.
  - Nombres de componentes en **PascalCase** (`HeroSection.vue`, `PricingModal.vue`).
- **Stores de Pinia**:
  - Un store por dominio (`locale`, `modal`, etc.).
  - Mantener tipados los estados y getters.
- **Composables**:
  - Prefijo `use` y nombre descriptivo (`useScrollReveal`, `useI18n`, etc.).
  - Evitar dependencias cruzadas innecesarias entre composables y stores.

Si necesitas añadir reglas o guías adicionales (por ejemplo, convenciones de commits, linting, formato), se pueden documentar en secciones adicionales de este README o en archivos específicos (`CONTRIBUTING.md`, etc.).
