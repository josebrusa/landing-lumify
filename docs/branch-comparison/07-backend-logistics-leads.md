# Backend brief: Logistics public leads

**From:** landing-lumify (frontend)  
**Date:** 2026-09-15  
**Status:** Requested for D4 — Logistics contact funnel  
**Related endpoint (existing):** `POST /api/leads/inquiries`

## Goal

Extend the existing commercial lead pipeline so `/logistics` can submit leads the same way as Tech (`pim_service`) and Training (`pim_training`):

1. Visitor opens a modal (company + email).
2. Frontend calls `POST /api/leads/inquiries`.
3. Lead appears in the admin dashboard.
4. Visitor receives an acknowledgement email.
5. Admin can see delivery status (`emailDelivery`: `queued` | `sent` | `failed`).

Phone (`tel:`) and `mailto:` stay as secondary contact actions on the page. They do **not** replace this funnel.

## What already works (do not redesign)

Public create body (camelCase), mirrored in frontend `CreateLeadBody`:

| Field | Required | Notes |
| --- | --- | --- |
| `email` | yes | |
| `company` | no | Frontend sends when non-empty |
| `name` | no | Not used by Logistics modal (same as Tech) |
| `phone` | no | Not used by this modal |
| `message` | no | Not used by this modal |
| `interestType` | yes | Enum — **needs extension** |
| `sourcePage` | yes | Free string today from API POV; frontend will send `logistics` |
| `sourceSection` | yes | e.g. `logistics_contact` |
| `sourceCardId` | yes | e.g. `contact_cta` |
| `sourceCta` | yes | e.g. `open_contact_modal` / `contact_modal_submit` |

Existing interest types:

- `pim_service`
- `pim_training`

Admin list/filter/KPIs already group by `interestType`. Frontend admin labels exist only for those two until this change.

## Backend changes required

### 1. New `interestType` value

Add:

```text
logistics_service
```

Rationale: same naming pattern as `pim_service` / `pim_training`. Distinguishes Logistics leads in inbox, filters, and KPIs.

Please update:

- Validation / DTO enum for `POST /leads/inquiries`
- Persistence (DB check constraint / enum / column validation)
- Admin list filter query param `interestType`
- Summary / KPIs / timeseries aggregations that bucket by `interestType`
- Any OpenAPI / Swagger docs

Reject unknown values with the same 400 shape as today.

### 2. Accept `sourcePage: "logistics"`

No new endpoint. Persist `sourcePage`, `sourceSection`, `sourceCardId`, `sourceCta` as today.

Example payload the frontend will send:

```json
{
  "company": "Acme SL",
  "email": "ops@acme.example",
  "interestType": "logistics_service",
  "sourcePage": "logistics",
  "sourceSection": "logistics_contact",
  "sourceCardId": "contact_cta",
  "sourceCta": "contact_modal_submit"
}
```

### 3. Acknowledgement email for `logistics_service`

Do **not** reuse the Tech “pricing / proposal / tariffs” template.

Required behaviour:

- On successful create for `interestType = logistics_service`, enqueue/send an acknowledgement email to the visitor.
- Expose the same delivery tracking the admin already uses (`emailDelivery` on the ack / answer flow, consistent with existing Tech leads).
- Copy intent (product, localize as you already do for other mails):

  - Subject suggestion: “We received your Logistics request — Lumify”
  - Body intent: we received your request; the Logistics team will contact you shortly; optional company + contact email echoed.

Tech (`pim_service`) and Training (`pim_training`) templates stay unchanged.

### 4. Admin visibility

- New leads with `logistics_service` must appear in the existing admin inbox (`GET /admin/leads/inquiries`).
- Filtering by `interestType=logistics_service` must work.
- KPIs / summary buckets should include the new type (prefer a real bucket, not a silent “other”).

Frontend will add an admin filter label (“Logistics”) once the API accepts the enum.

## Out of scope for backend

- Netlify Forms
- Changing Tech/Training create contract
- Restoring `/training` (product decision: stays hidden on the landing)
- WhatsApp / SMS
- Changing `tel:` / `mailto:` behaviour (frontend-only)

## Frontend plan (for coordination)

After backend ships `logistics_service` + mail:

1. Extend `LeadInterestType` with `logistics_service`.
2. Allow `sourcePage: 'logistics'` in the leads store intent type.
3. On `LogisticsHome.vue`: keep phone + mailto; add CTA → modal → `createLead` with `fallbackInterest: 'logistics_service'`.
4. Add admin i18n option for the new interest filter.
5. Recolor Logistics to Lumify tokens (`deep` / `blue`) in the same build wave.

Frontend can ship the UI before mail templates are ready, but **end-to-end “done”** requires the acknowledgement email.

## Acceptance criteria

- [ ] `POST /api/leads/inquiries` with `interestType: "logistics_service"` returns 2xx and creates a lead.
- [ ] Invalid / old clients sending unknown types still get 400.
- [ ] Lead is visible in admin inbox and filterable as Logistics.
- [ ] Visitor receives acknowledgement email (not the PIM pricing template).
- [ ] Delivery status is visible to admin (`queued` / `sent` / `failed`) like other leads.
- [ ] `pim_service` and `pim_training` behaviour unchanged.

## Questions for backend (reply in thread)

1. Confirm enum value name: `logistics_service` OK, or do you prefer another slug?
2. ETA for enum + persistence + ack email template?
3. Will staging have the new type before frontend ships Logistics modal?

## Contact / owners

- Frontend: landing-lumify restore plan (branch `refactor/upstream-main-changes`)
- Product decisions locked: Group at `/`, Tech at `/tech`, Logistics kept, Training hidden
