# Branch comparison: `refactor/upstream-main-changes` vs `main`

Internal working set for restoring Lumify branding, design tokens, commercial forms, and the email funnel defined on `main`.

| Field | Value |
| --- | --- |
| Status | All decisions locked — ready for build |
| Date | 2026-09-15 |
| Audience | Engineers implementing the restoration |
| Compared tips | `main` (`91cb34d`) vs `HEAD` (`refactor/upstream-main-changes`) |
| Action this pack enables | Restore Tech form behaviour, align new views to Lumify branding, add Logistics lead funnel without undoing the new site structure |

## How to use this pack

1. Read [01-overview.md](./01-overview.md) for scope, git facts, and what is **identical**.
2. Read [03-forms-and-email-strategy.md](./03-forms-and-email-strategy.md) before any form work — this is the P0 product break.
3. Read [02-branding-and-palette.md](./02-branding-and-palette.md) before any UI restyle of Group / Logistics.
4. Share [07-backend-logistics-leads.md](./07-backend-logistics-leads.md) with the API team before Logistics funnel E2E.
5. Use [06-restoration-checklist.md](./06-restoration-checklist.md) as the implementation backlog.

## Documents

| File | Purpose |
| --- | --- |
| [01-overview.md](./01-overview.md) | Git context, file inventory, goals / non-goals |
| [02-branding-and-palette.md](./02-branding-and-palette.md) | Palette contract vs off-brand colors on this branch |
| [03-forms-and-email-strategy.md](./03-forms-and-email-strategy.md) | Lead + email funnel on `main` vs Netlify Forms on this branch |
| [04-routing-and-ia.md](./04-routing-and-ia.md) | Site structure: `/`, `/tech`, `/logistics`, `/training` |
| [05-file-by-file.md](./05-file-by-file.md) | Every differing file and the intended restore |
| [06-restoration-checklist.md](./06-restoration-checklist.md) | Ordered backlog for the build phase |
| [07-backend-logistics-leads.md](./07-backend-logistics-leads.md) | Backend brief: `logistics_service` interest type + ack email |

## Source of truth

- Visual identity: [../design-system.md](../design-system.md) and `src/style.css` (unchanged vs `main`).
- Commercial copy and lead API: `main` — `Register.vue`, `PricingModal.vue`, `src/stores/leads.ts`, `src/services/leads.service.ts`.
- Evidence: `git diff main HEAD` (12 files). Histories are unrelated; compare file contents at the two tips, not `main...HEAD`.

## Locked decisions (do not re-open)

| ID | Decision |
| --- | --- |
| **D1** | Keep the new site structure. `/` = Lumify Group (`GroupHome.vue`). `/tech` = Tech / PIM (`Home.vue`). Do **not** restore `main` where `/` was Tech. |
| **D2** | Keep Logistics as a public page at `/logistics` (`LogisticsHome.vue`). Recolor it to the design system; do not delete it. |
| **D3** | Keep Training **hidden**: no `/training` route, no Training links in Tech nav/footer. Files may remain in the repo. |
| **D4** | Logistics: keep tel + mailto **and** add the same lead funnel as Tech (modal → company + email → API → visitor email + admin lead). Requires backend `logistics_service` — see [07-backend-logistics-leads.md](./07-backend-logistics-leads.md). |
| **Tech forms** | Restore `main` behaviour: CTAs open the modal in place. Do **not** scroll or jump to `#registro`. `Register.vue` submits via `leads.createLead`, not Netlify Forms. |
| **SEO** | Option A: keep Group metadata in `index.html` for `/`. Do not add per-route head tags in this build. |

## Out of scope for this pack

- Installing extra agent skills.
- Backend implementation (only the brief in doc 07).
- Per-route SEO / prerender (future).
