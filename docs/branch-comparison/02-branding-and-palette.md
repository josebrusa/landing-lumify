# Branding and palette

## Contract (`main` + design system)

Canonical tokens live in `src/style.css` (`@theme`) and are documented in [../design-system.md](../design-system.md). They are **identical** on this branch and on `main`.

| Token | Hex | Role |
| --- | --- | --- |
| `deep` | `#0A3D62` | Brand anchor, heroes, dark structure |
| `blue` | `#3C9DFF` | Only primary accent: CTAs, links, badges, focus |
| `gray-dark` | `#1F2A37` | Secondary dark / strong text |
| `white` | `#FFFFFF` | Base surface / text on dark |
| `surface` / `surface2` | `#F0F4FA` / `#E8EFF8` | Light section rhythm |
| `text` / `text-muted` | `#1F2A37` / `#4B5B6C` | Body hierarchy |

Rules that this branch breaks on new pages:

1. `deep` is the brand base; `blue` is the only primary accent.
2. Alternate `white` and `surface` on long pages so the UI is not a flat dark slab.
3. Dark gradients are for hero, CTA, and premium blocks — not the entire Group/Logistics experience.
4. New hues (if any) are support only and must not compete with `blue`.
5. Primary buttons: pill, `blue` fill, `white` text, hover ≈ `#5AAEFF`.

Reference implementations that still match the contract (because they match `main`): `Hero.vue`, `Services.vue` (visual classes), `Register.vue` (visual classes), `Packs.vue`, `Retainers.vue`, `Nav.vue` chrome (`bg-deep/97`, `border-blue/15`).

## What this branch did not change

- Font pairing (Syne + DM Sans in `index.html` / `style.css`).
- Tech landing section styling inside `HomeSections/*` (class names for color).
- Modal / pricing modal visuals.

The Nav logo PNG (base64 + `filter:brightness(0) invert(1)`) is already on `main`. Restoring branding does **not** mean swapping that asset unless product later extracts it to a file.

## Off-brand usage on this branch

### `GroupHome.vue`

| Location | Current | Should follow |
| --- | --- | --- |
| Page / nav / divisions section | `bg-[#060E14]`, `bg-[#0C1420]`, footer `bg-[#040A10]` | `deep` / `gray-dark` / documented dark gradient; avoid one-off near-black hex |
| “Active” badges | `emerald-500` / `emerald-400` | `blue/15` + `blue` text (pill on dark) |
| Logistics card accent | `amber-400` borders, icons, CTA, hover shadow `rgba(245,158,11,…)` | `blue` like the Tech card |
| Studio card | `violet-400` | `blue` at reduced opacity, or muted `white/40` for “coming soon” |
| Legal card | `teal-400` | Same as Studio — muted brand, not a fourth hue |
| Hero halo | `rgba(60,157,255,…)` | Keep (this part is on-brand) |

Group hero CTA (`bg-blue`, hover `#5aaeff`) is already on-brand. The division **grid** is where palette discipline fails: each business line got its own rainbow accent.

### `LogisticsHome.vue`

Almost the entire page treats **amber** as the brand:

- Wordmark: `Lumify` + `text-amber-400`
- Language switcher active: `bg-amber-400 text-[#060E14]`
- Hero halo / grid: `rgba(245,158,11,…)`
- Eyebrow, section labels, icons, cards, contact hover: `amber-400`
- Primary CTA: `bg-amber-400 text-[#060E14]` instead of `bg-blue text-white`

The contact band still uses the official dark blue gradient (`#0a3d62` → `#0d4f7e` → `#0a3558`) but overlays an amber radial. Restore the halo to `rgba(60, 157, 255, 0.15)` per the design system.

## Composition vs `main` Tech landing

`main` home rhythm: dark hero (`deep`) → light sections (`white` / `surface`) → dark retainers → light methodology/about → dark CTA form.

Group + Logistics on this branch: **full-page near-black**, no `surface` rest, no light cards. That is a tone shift (all-dark holding site) even where hex values are close to brand navy.

D1/D2 are closed: Group and Logistics stay. Recolor them; do not delete them.

Default restore (do not re-open routing):

- Keep Group/Logistics as public pages.
- Use the same section alternation and `blue` accent as Tech (`Home`): dark hero → light `surface` / `white` sections → dark CTA bands.
- Competing accents per division are forbidden (no emerald / amber / violet / teal).

A darker holding shell is allowed only as a later visual tweak, and only with `deep` / `blue` / translucent white.

## SEO / naming in `index.html`

| | `main` | This branch |
| --- | --- | --- |
| Title | Lumify — PIM & Data Governance Consultancy | Lumify Group — Soluciones para particulares y empresas |
| Description | PIM / data governance consultancy | Family business, multiple lines |

This is a **positioning** change, not a color token change. With D1, Group metadata in `index.html` is correct for `/`. Do not overwrite it with the old Tech consultancy copy. Per-route head tags for `/tech` are optional later work (today the SPA has a single `index.html`).

## Footer / Nav chrome

On-brand classes (`text-blue` hover, `bg-deep`) remain. Off-contract items:

- Extra “← Lumify Group” links in muted white (keep; they match D1).
- Training link removed (site structure / D3, not color).
- Footer brand link points to `/tech` instead of `/` (keep; Tech chrome should not send users back to Group via the wordmark).

## Later restore (do not implement in this pass)

1. Replace emerald/amber/violet/teal utilities with `blue` / `white` opacity scales.
2. Prefer Tailwind tokens (`bg-deep`, `bg-blue`, `text-text-muted`) over raw `#060E14` / `#0C1420`.
3. Reintroduce light `surface` / `white` sections on Group and Logistics.
4. Keep Tech section components as they are visually; they already match `main`.
