# Overview

## Audience

Engineers implementing the restoration of branding, design, forms, and commercial email on this branch.

## Problem

`refactor/upstream-main-changes` introduced a Lumify Group site structure (`/`, `/tech`, `/logistics`) and rewired several CTAs. The new pages stay. The work did not keep the brand palette or the commercial-email strategy already shipped on `main`.

The global token file is **not** the problem. `src/style.css` matches `main`. The breaks are in **new pages**, **CTA wiring**, and **how `Register.vue` submits**.

## Git facts

| Item | Detail |
| --- | --- |
| Current branch | `refactor/upstream-main-changes` |
| Compared `main` | `91cb34d` — Merge pull request #13 from `josebrusa/feature/new-functions` |
| Remotes | `origin` = `josebrusa/landing-lumify`; `upstream` = `lumify7/landing-lumify` |
| Merge base | None — unrelated histories. Use `git diff main HEAD`, not `main...HEAD`. |
| Diff size | 12 files, +674 / −119 (Nav looks huge because of an inlined PNG that already exists on `main`) |

### Files only on this branch

- `src/pages/GroupHome.vue`
- `src/pages/LogisticsHome.vue`

### Files only on `main`

None at the file-tree level. This branch still contains Training page/components; they are **unrouted** (D3: keep hidden).

### Unique commits on `main` that matter for product (not in this branch’s history)

`main` includes lead-admin work, Netlify `VITE_API_BASE_URL` enforcement, and commit `9462360` *Remove registration functionality*. That commit removed **user signup** (`src/pages/Register.vue` + auth), **not** the commercial lead form `src/components/HomeSections/Register.vue`. Do not treat “remove registration” as permission to drop the tariff-email funnel.

## What is identical to `main`

These files match `main` at the compared tips. Do not “restore” them unless a later change drifts:

- `src/style.css`
- `src/pages/Home.vue`
- `src/components/modals/PricingModal.vue`
- `src/components/modals/Modal.vue`
- `src/data/translations.ts`
- `src/stores/leads.ts`
- `src/App.vue`

`Home.vue` still mounts `Register`, `Modal`, and `PricingModal`. The modal stack is present; this branch mostly **stops opening it**.

## Differing files

| Path | Kind |
| --- | --- |
| `index.html` | SEO copy + hidden Netlify form |
| `src/router/index.ts` | Group / Tech / Logistics; Training removed |
| `src/components/HomeSections/Hero.vue` | CTA → scroll instead of pricing modal |
| `src/components/HomeSections/Packs.vue` | Same |
| `src/components/HomeSections/Services.vue` | Same |
| `src/components/HomeSections/Retainers.vue` | Same |
| `src/components/HomeSections/Register.vue` | Netlify Forms instead of `leads.createLead` |
| `src/components/layout/Nav.vue` | `/tech` links; Training replaced by Group |
| `src/components/layout/Footer.vue` | Same pattern |
| `src/pages/GroupHome.vue` | Added |
| `src/pages/LogisticsHome.vue` | Added |
| `vite.config.ts` | Lost Netlify env guard and Docker server config |

## Locked decisions

| ID | Decision |
| --- | --- |
| **D1** | Keep Group at `/` and Tech at `/tech`. Do not restore `main` homepage routing. |
| **D2** | Keep `/logistics` and `LogisticsHome.vue`. Align the UI to [../design-system.md](../design-system.md). |
| **D3** | Keep Training hidden (no route, no nav/footer links). |
| **D4** | Logistics: tel + mailto **and** lead funnel (modal → `createLead` → admin + ack email). Needs backend `logistics_service` — see [07-backend-logistics-leads.md](./07-backend-logistics-leads.md). |
| **Tech forms** | Restore modal + `createLead` from `main`. No scroll-to-section on Hero/Packs/Services/Retainers. |
| **SEO** | Option A: Group metadata in `index.html` stays. No per-route head in this build. |

## Goals

1. Restore the commercial lead + email funnel defined on `main` (Tech CTAs and `Register.vue`).
2. Align new views (`GroupHome.vue`, `LogisticsHome.vue`) to Lumify tokens (`deep` + `blue` only as primary accent).
3. Keep the new site structure (D1/D2). Do not delete Group or Logistics.
4. Add Logistics lead funnel (D4); coordinate backend via doc 07.
5. Leave Training hidden (D3).

## Non-goals

- Dropping Group or Logistics to “match `main` routes”.
- Restoring `/training`.
- Inventing a new visual language or competing per-division hues.
- Replacing Vue skills with React refactor skills.
- Treating Netlify Forms as an equivalent of `POST /leads/inquiries`.
- Per-route SEO / prerender (future).

## Constraints

- Visual contract: [../design-system.md](../design-system.md).
- Lead pipeline: `leadsService.createPublicLead` → `POST /leads/inquiries` with `interestType` and source metadata.
- Copy already in `translations.ts` (`reg.*`, `pm.*`) assumes **email delivery of tariffs / proposal**, not a generic contact dump.
- Netlify production still needs `VITE_API_BASE_URL` (`main` `vite.config.ts` fails the build if it is missing).

## Assumptions

- Assumption: Tech “emails” means the **commercial tariff / proposal emails** triggered by public leads, not OTP / 2FA admin mail.
- Logistics ack email is a **separate** template from Tech pricing (backend brief).
- Closed: Group stays `/`; Logistics stays; Training stays hidden; SEO Option A.
