# Routing and information architecture

## Map

| Path | `main` | This branch |
| --- | --- | --- |
| `/` | `Home.vue` (Tech / PIM landing), name `home` | `GroupHome.vue`, name `group-home` |
| `/tech` | — | `Home.vue`, name `home` |
| `/training` | `Training.vue` | **Removed from router** (files still in repo; D3: keep hidden) |
| `/logistics` | — | `LogisticsHome.vue` |
| `/login`, `/verify-otp`, `/admin/*` | Same idea | Same; guest redirect target changed |

## Guard behaviour

| Case | `main` | This branch |
| --- | --- | --- |
| Authenticated non-admin hitting guest routes | `/` (Tech home) | `/tech` |
| Authenticated admin on guest routes | `/admin` | `/admin` |
| Authenticated user without admin on `/admin` | `{ name: 'home' }` → `/` | `{ name: 'group-home' }` → `/` |
| `Nav.vue` `logout()` | `router.push('/')` | still `router.push('/')` — now Group, not Tech |

Hash links in Tech nav/footer:

- `main`: `/#servicios`, `/#packs`, `/#retainers`, `/#metodologia`, `/#nosaltres`
- this branch: `/tech#…`

That is consistent with **D1** (Tech stays at `/tech`). Do not change these hashes back to `/#…`.

## Product structure this branch added

`GroupHome.vue` presents four divisions:

| Card | State | Target |
| --- | --- | --- |
| Lumify Tech | Active | `/tech` |
| Lumify Logistics | Active | `/logistics` |
| Lumify Studio | Coming soon | None |
| Lumify Legal | Coming soon | None |

Translations for this page are **inline** in the SFC (es / ca / en), not `src/data/translations.ts`.

## Locked decisions

**D1 — Homepage and Tech path (closed 2026-09-15)**

Keep Group at `/`, Tech at `/tech`, Logistics at `/logistics`. Do **not** restore `main` where `/` was the PIM landing.

Consequences:

- Keep `/tech#…` hashes in Tech Nav/Footer.
- `logout()` to `/` lands on Group — that matches D1.
- Admin-without-role → `group-home` matches D1.
- Guest authenticated non-admin → `/tech` matches D1.
- Do not move `Home.vue` back to `/`.

**D2 — Logistics (closed 2026-09-15)**

Keep `LogisticsHome.vue` and `/logistics`. Recolor to the design system. Do not drop the route or the Group card that points to it.

**D3 — Training (closed 2026-09-15)**

Keep Training **hidden**. No `/training` route, no Training links in Tech nav/footer. Components may remain in the repo. Do not restore Training in this build.

**D4 — Logistics contact (closed 2026-09-15)**

Keep tel + mailto **and** add lead funnel (modal → API). See [03-forms-and-email-strategy.md](./03-forms-and-email-strategy.md) and [07-backend-logistics-leads.md](./07-backend-logistics-leads.md).

**SEO — Option A (closed 2026-09-15)**

Group metadata in `index.html` is correct for `/`. Do **not** overwrite with Tech consultancy copy. `/tech` and `/logistics` share that static head until a future per-route or prerender change.

## Planning notes (all applied)

- Keep current router map for `/`, `/tech`, `/logistics`.
- Keep Tech Nav/Footer hashes as `/tech#…`.
- Keep Footer Tech wordmark pointing at `/tech`.
- Keep Group back-links to `/`.
- Do not restore Training links.
- Old bookmarks to `/#servicios` already break; they should become `/tech#servicios`.

## Files that encode site structure

- `src/router/index.ts`
- `src/components/layout/Nav.vue`
- `src/components/layout/Footer.vue`
- `src/pages/GroupHome.vue` (new)
- `src/pages/LogisticsHome.vue` (new)
- `index.html`
