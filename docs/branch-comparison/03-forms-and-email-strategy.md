# Forms and email strategy

This is the P0 product break. Visual tokens can wait; the tariff email funnel cannot.

## Strategy on `main` (restore this for Tech)

Commercial capture is **not** user signup. Signup was removed on `main` (`9462360`). Public visitors request **pricing / proposal by email**. Platform accounts stay invite-only.

### Copy contract (`src/data/translations.ts`)

| Key | Intent |
| --- | --- |
| `reg.label` / `reg.title` | Access to tariffs |
| `reg.desc` | Register to get full prices, suggested proposal, use cases |
| `reg.success` | Check email to access tariffs |
| `reg.lead_disclaimer` | Commercial information request; platform users are invited by `{brand}` |
| `pm.title` / `pm.desc` | Price for **this** service; detailed price + personalised proposal in &lt; 48h |
| `pm.success` | Sent — check email soon |

If the UI still shows this copy but submits to Netlify, the promise is false.

### Runtime funnel on `main` (Tech)

```
card / CTA click
  → leads.registerIntent({ interestType, sourcePage, sourceSection, sourceCardId, sourceCta })
  → openModal(key) or openPricingModal()
  → user submits company + email
  → leads.createLead({ company, email, fallbackInterest, fallbackContext? })
  → POST /api/leads/inquiries  (axios client; VITE_API_BASE_URL)
  → backend queues/sends tariff email
  → admin sees lead + emailDelivery (queued | sent | failed)
```

Intent is stored in `src/stores/leads.ts` (`registerIntent` / `resolveIntent`, max age). If the user opened a pack card then submitted the form, the lead keeps that card’s interest. If intent expired, `fallbackInterest` is used (`pim_service` on home, `pim_training` on training).

Submit surfaces on `main`:

| Surface | Submit path |
| --- | --- |
| `HomeSections/Register.vue` | `leads.createLead` + `fallbackInterest: 'pim_service'` |
| `modals/PricingModal.vue` | `leads.createLead` + context `home_pricing_modal` or `training_pricing_modal` |
| `TrainingSections/TrainingBenefits.vue` | `leads.createLead` + `pim_training` |

Hero, Packs, Services, Retainers on `main` **do not submit**. They register intent and open the modal. Footer / Nav pricing buttons do the same.

### What the API stores

`src/types/api.ts`: `email`, optional `company`, `interestType`, `sourcePage`, `sourceSection`, `sourceCardId`, `sourceCta`. Admin UI tracks acknowledgement `emailDelivery`. Netlify Forms cannot populate this pipeline.

Today `LeadInterestType` is `'pim_service' | 'pim_training'`. Logistics needs `'logistics_service'` — see [07-backend-logistics-leads.md](./07-backend-logistics-leads.md).

## What this branch changed (before restore)

### 1. CTAs no longer open the modal

| File | `main` | This branch (broken) |
| --- | --- | --- |
| `Hero.vue` | `openPricingModal()` | `scrollIntoView('#registro')` |
| `Packs.vue` | `openModal(packKey)` after `registerIntent` | scroll; intent still recorded then unused |
| `Services.vue` | `openModal(serviceKey)` | same break |
| `Retainers.vue` | `openModal(retainerKey)` | same break |

### 2. `Register.vue` left the API

This branch used Netlify Forms (`contacto-lumify`) instead of `leads.createLead`. Effects: no admin lead, no tariff email, false success copy.

### 3. Logistics contact (D4 — closed)

**Decision:** keep tel + mailto **and** add the same lead funnel pattern as Tech.

- CTA opens a modal (company + email).
- Submit via `createLead` with `fallbackInterest: 'logistics_service'`.
- Visitor gets a Logistics acknowledgement email (not the PIM pricing template).
- Lead appears in admin, filterable as Logistics.
- Backend must accept the new enum — [07-backend-logistics-leads.md](./07-backend-logistics-leads.md).

### 4. Training capture is orphaned (D3 — closed)

Training stays hidden. Components remain; route and nav links are not restored.

## What must not be confused

| Topic | Stay / drop |
| --- | --- |
| User registration page + auth signup | Already removed on `main` — keep removed |
| OTP / 2FA / invite-user admin emails | Unchanged — out of scope |
| Commercial lead emails (Tech) | Restore from `main` |
| Logistics lead emails | New type + new ack template (backend) |
| Netlify Forms `contacto-lumify` | Drop when restoring API submit |
| Hidden Netlify form in `index.html` | Drop with the Register restore |

## Restore / build target

1. Revert `Register.vue` to `main` (store `createLead`).
2. Revert Hero / Packs / Services / Retainers click handlers to `main`.
3. Remove the Netlify form from `index.html` (keep Group SEO metadata — SEO Option A).
4. Keep `PricingModal.vue` / `Modal.vue` as they are (already equal to `main`).
5. Do **not** re-expose `/training` (D3).
6. Logistics (D4): tel + mailto + contact modal → `createLead` with `logistics_service`.

## Validation

- Submit from `#registro` creates an admin lead and a queued/sent ack email.
- Click pack “interest” → modal → submit attaches that pack’s `sourceCardId`.
- Hero secondary CTA opens pricing modal, not a silent scroll.
- Logistics contact CTA opens modal → lead with `logistics_service` (after backend ships).
- Failed API shows `reg.lead_submit_error` from the store.
- Netlify deploy still has `VITE_API_BASE_URL`.

## Rollback of a mistaken Netlify-only approach

If production already collected Netlify form posts, they are **not** in the leads admin. Export them manually if needed; do not treat Netlify as source of truth going forward.
