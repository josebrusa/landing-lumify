# File-by-file diff vs `main`

Generated from `git diff main HEAD` on 2026-09-15. Restore column is the **intended** later action, not work done in this documentation pass.

## `index.html`

**Changed:** document title, meta description, Open Graph, Twitter cards. Added hidden Netlify form `contacto-lumify` (`empresa`, `email`, `bot-field`).

**Keep from this branch:** Group title / description / Open Graph (correct for `/` under D1).

**Restore toward `main`:** remove the Netlify form when `Register.vue` uses the API again. Do not put Tech consultancy metadata back on the document head. Per-route tags for `/tech` are optional later work.

## `src/router/index.ts`

**Changed:** `/` → GroupHome; `/tech` → Home; `/logistics` added; `/training` removed. Admin without role → `group-home`. Guest-focused authenticated users → `/tech` instead of `/`.

**Keep (D1/D2):** `/` → GroupHome, `/tech` → Home, `/logistics` → LogisticsHome, guest/admin redirects as they are now.

**Keep (D3):** Training stays unrouted. Do not move `Home.vue` back to `/`.

## `src/components/HomeSections/Hero.vue`

**Changed:** dropped `useModals`; secondary CTA calls `scrollToForm()` → `#registro`.

**Visual:** unchanged vs `main` (still `deep` / `blue` pills).

**Restore:** `openPricingModal()` from `main`.

## `src/components/HomeSections/Packs.vue`

**Changed:** `openModal(packKey)` replaced by scroll to `#registro`. `registerIntent` remains.

**Restore:** `useModals` + `openModal(packKey)` after intent (exact `main` handler).

## `src/components/HomeSections/Services.vue`

Same pattern as Packs (`openModal(serviceKey)` → scroll).

## `src/components/HomeSections/Retainers.vue`

Same pattern as Packs (`openModal(retainerKey)` → scroll).

## `src/components/HomeSections/Register.vue`

**Visual:** still the dark gradient CTA band from the design system (on-brand).

**Behaviour vs `main`:**

- Removed `useLeadsStore`.
- Submit via Netlify `fetch('/')` + `URLSearchParams`.
- Local submitting/error state.
- Extra comments / honeypot input.

**Restore:** entire script submit path from `main` (`leads.createLead`, store error/submitting). Keep the existing template layout unless `main` template differs (it does not, aside from comments and honeypot).

## `src/components/layout/Nav.vue`

**Unchanged vs `main` in spirit:** logo base64, `bg-deep/97`, language switcher, pricing helpers (`openPricingFromNav`, training-aware `registerPricingIntent`).

**Changed:** `RouterLink` / hashes to `/tech`; Training `RouterLink` replaced by `<a href="/">← Grupo</a>` (desktop) and “← Lumify Group” (mobile). Comment that Training is hidden.

**Byte size:** ~70.8 KB on both tips — do not “fix” the PNG unless extracting the asset.

**Keep (D1/D3):** `/tech` hashes, Group back-links, `logout()` → `/` (Group). Training stays hidden.

## `src/components/layout/Footer.vue`

**Changed:** brand link `/` → `/tech`; about hash `/#nosaltres` → `/tech#nosaltres`; Training `RouterLink` removed; extra Group back-link block.

**Unchanged:** service/pack buttons still `openModal` / `openPricingFromFooter` (on-brand funnel).

**Keep (D1/D3):** brand link `/tech`, about hash `/tech#nosaltres`, extra Group back-link. Training stays hidden.

## `src/pages/GroupHome.vue` (added)

Holding landing: own nav, hero, four division cards, footer. Inline i18n. Off-brand accents (emerald / amber / violet / teal). Full-page near-black.

**Keep (D1):** the page and the `/` route.

**Restore:** recolor to the design system; optionally move copy into `translations.ts`; reuse layout primitives instead of a second nav/footer if Tech Nav is the system chrome. Do not delete this file.

## `src/pages/LogisticsHome.vue` (added)

Division landing: amber brand, tel/mailto contact, no lead API (before restore).

**Keep (D2):** the page and the `/logistics` route.

**Restore (D4):** `blue` accent; keep tel + mailto; add contact modal → `createLead` with `logistics_service` ([03-forms-and-email-strategy.md](./03-forms-and-email-strategy.md), [07-backend-logistics-leads.md](./07-backend-logistics-leads.md)). Do not delete this file.

## `vite.config.ts`

**Removed vs `main`:**

- Plugin `netlify-require-vite-api-base-url` (fail Netlify build when `VITE_API_BASE_URL` missing).
- Docker `server` / `preview` when `CHOKIDAR_USEPOLLING === 'true'`.

**Restore:** copy from `main`. This is not visual, but it protects the lead API client on static hosting.

## Intentionally not in the diff (do not rewrite “to match main” unless they drift)

`Home.vue`, `PricingModal.vue`, `Modal.vue`, `style.css`, `translations.ts`, `leads.ts`, `App.vue`, Training components, admin lead UI.

Training is **present** and **unlinked**. D3 keeps it hidden — not a missing feature rewrite.
