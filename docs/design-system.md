# Sistema Visual Lumify

Guia base para replicar la identidad visual de Lumify en otros productos. Este documento cubre paleta, superficies, composicion, componentes y tono visual. No incluye `font-family`.

## 1. Paleta de color

### Colores principales

| Token | Hex | Uso recomendado |
| --- | --- | --- |
| `deep` | `#0A3D62` | Color de marca principal. Fondos hero, bloques destacados, cards premium, titulos oscuros. |
| `blue` | `#3C9DFF` | Acento primario. Botones CTA, links activos, badges, focos, detalles de iconos. |
| `gray-dark` | `#1F2A37` | Fondo oscuro secundario y texto fuerte en superficies claras. |
| `white` | `#FFFFFF` | Fondo base, texto sobre fondos oscuros, cards y modales. |

### Colores de superficie y soporte

| Token | Hex | Uso recomendado |
| --- | --- | --- |
| `surface` | `#F0F4FA` | Secciones alternadas claras. |
| `surface2` | `#E8EFF8` | Variacion suave para capas, chips o separacion secundaria. |
| `gray-light` | `#E5E7EB` | Bordes, divisores y outlines neutrales. |
| `text` | `#1F2A37` | Texto principal en fondos claros. |
| `text-muted` | `#4B5B6C` | Texto secundario, descripciones y soporte. |

### Colores derivados frecuentes

| Variante | Valor aproximado | Uso recomendado |
| --- | --- | --- |
| `blue/10` | `rgba(60, 157, 255, 0.10)` | Badges suaves y fondos de tag. |
| `blue/15` | `rgba(60, 157, 255, 0.15)` | Pills sobre hero oscuro. |
| `blue/20` | `rgba(60, 157, 255, 0.20)` | Chips, indicadores, fondos de icono. |
| `white/10` | `rgba(255, 255, 255, 0.10)` | Inputs sobre fondo oscuro. |
| `white/40-70` | `rgba(255, 255, 255, 0.40-0.70)` | Texto secundario en dark sections. |

## 2. Logica de uso del color

- Base visual: combinar `white` y `surface` para dar limpieza y respiracion.
- Marca: usar `deep` como ancla visual y `blue` como energia/acento.
- Jerarquia: `deep` para bloques estructurales; `blue` para interaccion y foco.
- Contraste: sobre fondos oscuros, el texto principal va en `white` y el secundario en opacidades de blanco.
- Separacion: los bordes casi siempre son sutiles, con `gray-light` o blanco translucido.

## 3. Gradientes y fondos

### Gradiente principal

Usar un gradiente azul oscuro para heroes, formularios CTA y paneles destacados:

```css
background: linear-gradient(135deg, #0a3d62 0%, #0d4f7e 60%, #0a3558 100%);
```

### Capas atmosfericas

- Superponer halos radiales azules suaves sobre fondos oscuros.
- Agregar grillas o patrones muy sutiles con opacidad baja.
- Mantener el efecto decorativo en segundo plano, nunca competir con el contenido.

Ejemplo de halo:

```css
background: radial-gradient(ellipse 70% 70% at 80% 50%, rgba(60, 157, 255, 0.15) 0%, transparent 70%);
```

## 4. Superficies

### Secciones claras

- Fondo `white` o `surface`.
- Titulos en `deep`.
- Texto secundario en `text-muted`.
- Bordes suaves en `gray-light`.

### Secciones oscuras

- Fondo `deep`, `gray-dark` o gradiente azul oscuro.
- Titulos en `white`.
- Texto secundario en `white/60` o `white/70`.
- Acentos en `blue`.

### Superficie premium o destacada

- Fondo `deep`.
- Elementos secundarios en `blue/20` o `blue/25`.
- Sombras mas profundas.
- CTA principal siempre en `blue`.

## 5. Radios y forma

| Token | Valor | Uso |
| --- | --- | --- |
| `radius` | `16px` | Cards, contenedores, paneles principales. |
| `radius-sm` | `8px` | Inputs simples, detalles compactos. |
| `full` | `9999px` | Botones, pills, badges, toggles. |
| `24px` | `24px` | Modales y bloques visuales protagonistas. |

La marca favorece formas redondeadas, amables y tecnicas a la vez. Casi nunca usa esquinas duras.

## 6. Sombras y profundidad

### Cards sobre fondo claro

```css
box-shadow: 0 24px 60px rgba(10, 61, 98, 0.12);
```

### CTA hover

```css
box-shadow: 0 10px 30px rgba(60, 157, 255, 0.35);
```

### Cards premium / dark

```css
box-shadow: 0 20px 50px rgba(10, 61, 98, 0.25);
```

Regla general:

- La profundidad aparece sobre todo en hover o en piezas destacadas.
- No abusar de sombras permanentes muy fuertes en toda la interfaz.

## 7. Componentes visuales

### Boton primario

- Fondo `blue`.
- Texto `white`.
- Forma pill.
- Hover con azul mas claro (`#5AAEFF` aprox), ligera elevacion y sombra azul.

### Boton secundario sobre dark

- Fondo transparente.
- Borde `white/30`.
- Texto `white`.
- Hover: borde y texto en `blue`.

### Boton outline sobre claro

- Fondo blanco o transparente.
- Borde `blue`.
- Texto `blue`.
- Hover: fondo `blue`, texto `white`.

### Cards

- Padding generoso.
- Borde sutil.
- Hover con desplazamiento vertical pequeno.
- En algunos casos, una linea superior en gradiente `deep -> blue` como detalle de interaccion.

### Badges y pills

- Uso frecuente para etiquetas de seccion, estado o categoria.
- Fondo suave en `blue/10` a `blue/20`.
- Texto en `blue`.
- Rounded full.
- Tracking amplio y uppercase cuando actuan como label de seccion.

### Inputs en fondos oscuros

- Fondo `white/10`.
- Borde `white/20`.
- Texto `white`.
- Placeholder `white/40`.
- Focus en `blue`.

### Modales

- Fondo blanco.
- Radio amplio (`24px`).
- Overlay oscuro con blur suave.
- Tag superior en `blue/10` + `blue`.
- CTA final en `blue`.

## 8. Composicion y layout

- Mucho aire lateral: uso recurrente de `5%` en padding horizontal de seccion.
- Secciones amplias: espaciado vertical cercano a `80px-100px`.
- Titulos compactos y fuertes; descripciones con line-height relajado.
- Alternancia clara/oscura entre bloques para marcar ritmo.
- Grids de cards con `gap` medio, sin saturacion visual.

## 9. Tono visual

- Tecnologico, consultivo y premium.
- Limpio, claro y muy enfocado en confianza.
- El azul no es decorativo: funciona como senal de accion, precision y modernidad.
- Los fondos oscuros se usan para momentos de impacto, no para toda la experiencia.

## 10. Reglas rapidas para reutilizar en otros productos

1. Mantener `deep` como base de marca y `blue` como unico acento principal.
2. Alternar secciones `white` y `surface` para evitar una UI plana.
3. Reservar gradientes oscuros para hero, CTA y bloques premium.
4. Usar botones pill y cards con radio suave para conservar la identidad.
5. Aplicar hover con pequena elevacion, nunca animaciones agresivas.
6. Mantener los textos secundarios en tonos muteados, no en negro puro.
7. Si un producto necesita nuevos colores, usarlos como apoyo, no compitiendo con `blue`.

## 11. Tokens sugeridos

```css
:root {
  --color-deep: #0A3D62;
  --color-blue: #3C9DFF;
  --color-gray-dark: #1F2A37;
  --color-gray-light: #E5E7EB;
  --color-white: #FFFFFF;
  --color-surface: #F0F4FA;
  --color-surface2: #E8EFF8;
  --color-text: #1F2A37;
  --color-text-muted: #4B5B6C;

  --radius-md: 16px;
  --radius-sm: 8px;
  --radius-lg: 24px;
  --radius-pill: 9999px;
}
```

## 12. Fuente de referencia en el proyecto

- Tokens globales: `src/style.css`
- Hero y atmosfera: `src/components/HomeSections/Hero.vue`
- Cards de servicios: `src/components/HomeSections/Services.vue`
- CTA/form oscuro: `src/components/HomeSections/Register.vue`
- Cards de packs: `src/components/HomeSections/Packs.vue`
- Seccion dark de retainers: `src/components/HomeSections/Retainers.vue`
- Metodologia y bloques claros: `src/components/HomeSections/Methodology.vue`
- Modal base: `src/components/modals/Modal.vue`
- Navegacion y footer: `src/components/layout/Nav.vue`, `src/components/layout/Footer.vue`
