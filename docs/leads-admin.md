# Leads admin — source attribution slugs

Frontend handoff for `POST /api/leads/inquiries`. Beside `interestType`, `email`, `company`, and `locale`, every create always sends:

| Field | Meaning |
| --- | --- |
| `sourceSection` | Page block |
| `sourceCardId` | Concrete card |
| `sourceCta` | Button action |

UI modal keys (`assessment`, `pack-datos`, …) stay for content. Analytics use the slugs below via [`src/data/leadAttribution.ts`](../src/data/leadAttribution.ts).

## Sections and cards

| Section | Cards |
| --- | --- |
| `services` | `strategy_discovery`, `data_model_governance`, `implementation_integrations`, `migration_golive` |
| `packs` | `pack_fundamentos`, `pack_omnicanal`, `pack_diagnostico`, `pack_beauty_gdsn` |
| `retainers` | `retainer_lite`, `retainer_standard`, `retainer_plus` |
| `pricing` | `pricing_access` |
| `logistics_contact` | `contact_cta` |

## Typical CTAs

| CTA | Use |
| --- | --- |
| `more_info` | Service cards |
| `pack_card` | Pack cards |
| `consult` | Retainer cards |
| `pricing_access` | Pricing entry (nav / footer / modal fallback) |
| `contact_modal_submit` | Logistics contact form submit |

## ModalKey → slug map

| ModalKey | sourceCardId | sourceCta |
| --- | --- | --- |
| `assessment` | `strategy_discovery` | `more_info` |
| `modelo` | `data_model_governance` | `more_info` |
| `implementacion` | `implementation_integrations` | `more_info` |
| `migracion` | `migration_golive` | `more_info` |
| `pack-datos` | `pack_fundamentos` | `pack_card` |
| `pack-omni` | `pack_omnicanal` | `pack_card` |
| `pack-health` | `pack_diagnostico` | `pack_card` |
| `pack-beauty` | `pack_beauty_gdsn` | `pack_card` |
| `ret-lite` | `retainer_lite` | `consult` |
| `ret-std` | `retainer_standard` | `consult` |
| `ret-plus` | `retainer_plus` | `consult` |

Admin list/detail map these slugs to readable labels (`lead.section.*`, `lead.card.*`, `lead.cta.*`). Unknown (legacy) slugs render as-is.
