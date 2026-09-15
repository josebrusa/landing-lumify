# Restoration checklist

Use this in the **build** phase. Status key: `todo` | `blocked` | `done`.

## Decision gate

| ID | Status | Decision |
| --- | --- | --- |
| D1 | **Closed** | Group at `/`, Tech at `/tech`. Do not restore `main` homepage routing. |
| D2 | **Closed** | Keep `/logistics` and `LogisticsHome.vue`. Align UI to the design system. |
| D3 | **Closed** | Keep Training hidden (no route, no nav/footer links). |
| D4 | **Closed** | Logistics: tel + mailto **and** lead funnel (`logistics_service`). Backend brief: [07-backend-logistics-leads.md](./07-backend-logistics-leads.md). |
| SEO | **Closed** | Option A — Group metadata in `index.html`. No per-route head. |
| Tech forms | **Closed** | Modal + `createLead` from `main`. No scroll to `#registro`. |

P0 Tech forms and palette are unblocked. Logistics funnel E2E is blocked on backend `logistics_service` for ack email; front can ship UI earlier.

## P0 — Commercial email funnel (Tech)

Must match `main` behaviour, not only look like it.

- [x] Revert `src/components/HomeSections/Register.vue` submit to `leads.createLead`.
- [x] Remove Netlify hidden form from `index.html` (keep Group SEO metadata).
- [x] Restore `Hero.vue` secondary CTA → `openPricingModal()`.
- [x] Restore `Packs.vue` → `openModal(packKey)` after `registerIntent`.
- [x] Restore `Services.vue` → `openModal(serviceKey)` after `registerIntent`.
- [x] Restore `Retainers.vue` → `openModal(retainerKey)` after `registerIntent`.
- [x] Confirm `Home.vue` still mounts `Modal` + `PricingModal` (already true).
- [x] Do **not** restore user signup (`pages/Register.vue`); that stays deleted on `main`.

**Verify later (against staging API):** create a lead from `#registro` and from a pack modal; admin shows the row; `emailDelivery` is queued/sent; UI success copy still matches an actual email.

## P0 — Palette on new surfaces

- [x] `GroupHome.vue`: remove `emerald-*`, `amber-*`, `violet-*`, `teal-*`.
- [x] `GroupHome.vue`: badges and CTAs use `blue` / `blue/15` / `white`.
- [x] `LogisticsHome.vue`: replace amber with `blue` (wordmark, CTA, icons, halo).
- [x] Prefer `bg-deep`, `bg-blue`, `text-white/70` over one-off `#060E14` / `#0C1420` where the design system already has a token.
- [x] Prefer design-system rhythm: add light `surface` / `white` sections so Group/Logistics are not all-dark.

Contract: [../design-system.md](../design-system.md). Do not run generic frontend-design exploration.

## P1 — Logistics lead funnel (D4)

- [x] Extend `LeadInterestType` with `logistics_service`.
- [x] Extend leads store `sourcePage` with `'logistics'`.
- [x] Add contact modal on `LogisticsHome.vue` (company + email → `createLead`).
- [x] Keep `tel:+34679818935` and `mailto:logistics@lumify.es`.
- [x] Admin filter option + i18n for Logistics.
- [ ] Coordinate backend per [07-backend-logistics-leads.md](./07-backend-logistics-leads.md) — share brief; E2E ack email blocked until API ships.

## P1 — Site structure and SEO

- [x] Keep current `/`, `/tech`, `/logistics` map (D1/D2). Do not revert the router homepage to `main`.
- [x] Do **not** restore `/training` (D3).
- [x] Keep Nav/Footer Tech hashes as `/tech#…`. Keep Group back-links.
- [x] Keep `logout()` → `/` (Group) and admin-without-role → `group-home`.
- [x] Keep Group metadata in `index.html` for `/` (SEO Option A).

## P1 — `vite.config.ts`

- [x] Restore Netlify `VITE_API_BASE_URL` build guard from `main`.
- [x] Restore Docker polling `server` / `preview` from `main`.

## P2 — Maintainability (optional, after visual + funnel)

- [x] Move Group/Logistics strings into `src/data/translations.ts` (via `groupTranslations.ts` / `logisticsTranslations.ts`).
- [ ] Extract Nav logo from base64 to a static file (same visual, both branches).
- [ ] Share Group/Logistics chrome with existing `Nav`/`Footer` if product wants one system.

## Explicitly out of scope unless they drift

- Restyling `HomeSections` that already match `main`.
- Rewriting Pinia leads store or admin lead screens beyond Logistics filter.
- Changing OTP / invite email copy.
- Restoring Training.
- Per-route SEO / prerender.

## Suggested implementation order

1. P0 forms (`Register` + four CTA files + `index.html` form removal).
2. P0 palette (`GroupHome`, `LogisticsHome`) — pages stay; colors change.
3. P1 Logistics funnel (front) + share backend brief.
4. `vite.config.ts`.
5. P2 cleanup (optional).

## Rollback

For each restored Tech file, `git show main:<path>` is the behaviour oracle. New pages have no `main` version — rollback means keep the file but drop off-brand classes, or delete the route.

## Communication

Commercial copy already promises an email. Shipping UI restore without API submit will keep breaking that promise. Coordinate with whoever operates the leads backend before calling Logistics funnel “done”.
