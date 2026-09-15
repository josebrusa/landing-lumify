import type { ModalKey } from './modalData'

export type LeadSourceSection =
  | 'services'
  | 'packs'
  | 'retainers'
  | 'pricing'
  | 'logistics_contact'

export interface LeadAttribution {
  sourceSection: LeadSourceSection
  sourceCardId: string
  sourceCta: string
}

/** Maps UI modal keys to handoff analytics slugs (ModalKey stays for content). */
export const attributionByModalKey: Record<ModalKey, LeadAttribution> = {
  assessment: {
    sourceSection: 'services',
    sourceCardId: 'strategy_discovery',
    sourceCta: 'more_info',
  },
  modelo: {
    sourceSection: 'services',
    sourceCardId: 'data_model_governance',
    sourceCta: 'more_info',
  },
  implementacion: {
    sourceSection: 'services',
    sourceCardId: 'implementation_integrations',
    sourceCta: 'more_info',
  },
  migracion: {
    sourceSection: 'services',
    sourceCardId: 'migration_golive',
    sourceCta: 'more_info',
  },
  'pack-datos': {
    sourceSection: 'packs',
    sourceCardId: 'pack_fundamentos',
    sourceCta: 'pack_card',
  },
  'pack-omni': {
    sourceSection: 'packs',
    sourceCardId: 'pack_omnicanal',
    sourceCta: 'pack_card',
  },
  'pack-health': {
    sourceSection: 'packs',
    sourceCardId: 'pack_diagnostico',
    sourceCta: 'pack_card',
  },
  'pack-beauty': {
    sourceSection: 'packs',
    sourceCardId: 'pack_beauty_gdsn',
    sourceCta: 'pack_card',
  },
  'ret-lite': {
    sourceSection: 'retainers',
    sourceCardId: 'retainer_lite',
    sourceCta: 'consult',
  },
  'ret-std': {
    sourceSection: 'retainers',
    sourceCardId: 'retainer_standard',
    sourceCta: 'consult',
  },
  'ret-plus': {
    sourceSection: 'retainers',
    sourceCardId: 'retainer_plus',
    sourceCta: 'consult',
  },
}

export const pricingAttribution = {
  sourceSection: 'pricing',
  sourceCardId: 'pricing_access',
  sourceCta: 'pricing_access',
} as const satisfies LeadAttribution

export const logisticsAttribution = {
  sourceSection: 'logistics_contact',
  sourceCardId: 'contact_cta',
  sourceCta: 'contact_modal_submit',
} as const satisfies LeadAttribution

/** i18n key for a section slug; falls back to raw slug when missing. */
export function leadSectionLabelKey(section: string): string {
  return `lead.section.${section}`
}

export function leadCardLabelKey(cardId: string): string {
  return `lead.card.${cardId}`
}

export function leadCtaLabelKey(cta: string): string {
  return `lead.cta.${cta}`
}

/** Resolve label via i18n; if key missing, return the raw slug. */
export function resolveLeadLabel(t: (key: string) => string, key: string, slug: string): string {
  const label = t(key)
  return label === key ? slug : label
}
