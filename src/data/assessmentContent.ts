import type { Lang } from './translations'

export type AssessmentAreaId = 'pim' | 'dam' | 'seo' | 'ux' | 'compliance'
export type ReviewType = 'instant' | 'detailed'
export type FindingLevel = 'ok' | 'risk' | 'warn'

export interface LocalizedText {
  es: string
  ca: string
  en: string
}

export interface AssessmentQuestion {
  text: LocalizedText
  opts: [LocalizedText, LocalizedText, LocalizedText]
  pts: [number, number, number]
}

export interface AreaDefinition {
  id: AssessmentAreaId
  labelKey: string
  subKey: string
  highlight?: boolean
}

export interface MicrolinkSiteData {
  title?: string
  description?: string
  lang?: string
  url?: string
  image?: { url?: string; width?: number; height?: number }
  logo?: { url?: string }
}

export interface Finding {
  type: FindingLevel
  key: string
  params?: Record<string, string | number>
}

export const AREA_IDS: AssessmentAreaId[] = ['pim', 'dam', 'seo', 'ux', 'compliance']

export const AREA_DEFS: AreaDefinition[] = [
  { id: 'pim', labelKey: 'assess.area.pim', subKey: 'assess.area.pim.sub' },
  { id: 'dam', labelKey: 'assess.area.dam', subKey: 'assess.area.dam.sub' },
  { id: 'seo', labelKey: 'assess.area.seo', subKey: 'assess.area.seo.sub' },
  { id: 'ux', labelKey: 'assess.area.ux', subKey: 'assess.area.ux.sub' },
  {
    id: 'compliance',
    labelKey: 'assess.area.compliance',
    subKey: 'assess.area.compliance.sub',
    highlight: true,
  },
]

export const QUESTION_DB: Record<AssessmentAreaId, AssessmentQuestion[]> = {
  pim: [
    {
      text: {
        es: '¿Cuántos SKUs gestiona tu catálogo actualmente?',
        ca: 'Quants SKUs gestiona el teu catàleg actualment?',
        en: 'How many SKUs does your catalog currently manage?',
      },
      opts: [
        { es: 'Menos de 500', ca: 'Menys de 500', en: 'Fewer than 500' },
        { es: 'Entre 500 y 5.000', ca: 'Entre 500 i 5.000', en: 'Between 500 and 5,000' },
        { es: 'Más de 5.000', ca: 'Més de 5.000', en: 'More than 5,000' },
      ],
      pts: [10, 7, 5],
    },
    {
      text: {
        es: '¿Tu taxonomía de categorías sigue un estándar normalizado (GPC, ETIM, UNSPSC u otro de tu sector)?',
        ca: 'La teva taxonomia de categories segueix un estàndard normalitzat (GPC, ETIM, UNSPSC o un altre del teu sector)?',
        en: 'Does your category taxonomy follow a normalized standard (GPC, ETIM, UNSPSC or another for your sector)?',
      },
      opts: [
        {
          es: 'Sí, estándar definido y aplicado',
          ca: 'Sí, estàndard definit i aplicat',
          en: 'Yes, defined and applied standard',
        },
        {
          es: 'Estructura propia sin estándar externo',
          ca: 'Estructura pròpia sense estàndard extern',
          en: 'Own structure without external standard',
        },
        {
          es: 'Sin taxonomía definida',
          ca: 'Sense taxonomia definida',
          en: 'No defined taxonomy',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿Los atributos de producto incluyen campos de compliance UE obligatorios por familia (marcado CE, país de origen, responsable autorizado, REACH/RoHS si aplica)?',
        ca: 'Els atributs de producte inclouen camps de compliance UE obligatoris per família (marcat CE, país d’origen, responsable autoritzat, REACH/RoHS si escau)?',
        en: 'Do product attributes include mandatory EU compliance fields by family (CE marking, country of origin, authorized representative, REACH/RoHS if applicable)?',
      },
      opts: [
        {
          es: 'Sí, modelados por familia de producto',
          ca: 'Sí, modelats per família de producte',
          en: 'Yes, modeled by product family',
        },
        {
          es: 'Parcialmente, hay familias sin cubrir',
          ca: 'Parcialment, hi ha famílies sense cobrir',
          en: 'Partially; some families are uncovered',
        },
        {
          es: 'No se han modelado los campos normativos',
          ca: 'No s’han modelat els camps normatius',
          en: 'Regulatory fields have not been modeled',
        },
      ],
      pts: [10, 5, 1],
    },
  ],
  dam: [
    {
      text: {
        es: '¿Tienes repositorio centralizado de assets digitales (imágenes, vídeos, documentos)?',
        ca: 'Tens un repositori centralitzat d’assets digitals (imatges, vídeos, documents)?',
        en: 'Do you have a centralized repository for digital assets (images, videos, documents)?',
      },
      opts: [
        {
          es: 'Sí, centralizado y accesible',
          ca: 'Sí, centralitzat i accessible',
          en: 'Yes, centralized and accessible',
        },
        {
          es: 'Distribuido en carpetas o drives',
          ca: 'Distribuït en carpetes o drives',
          en: 'Distributed across folders or drives',
        },
        { es: 'No, sin centralizar', ca: 'No, sense centralitzar', en: 'No, not centralized' },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿Cada producto tiene asociados los documentos normativos correspondientes (declaración CE, ficha técnica, manual de usuario, SDS si aplica)?',
        ca: 'Cada producte té associats els documents normatius corresponents (declaració CE, fitxa tècnica, manual d’usuari, SDS si escau)?',
        en: 'Does each product have the corresponding regulatory documents linked (CE declaration, datasheet, user manual, SDS if applicable)?',
      },
      opts: [
        {
          es: 'Sí, vinculados al registro de producto en el PIM',
          ca: 'Sí, vinculats al registre de producte al PIM',
          en: 'Yes, linked to the product record in the PIM',
        },
        {
          es: 'Algunos productos sí, no todos',
          ca: 'Alguns productes sí, no tots',
          en: 'Some products yes, not all',
        },
        {
          es: 'No están documentados de forma estructurada',
          ca: 'No estan documentats de forma estructurada',
          en: 'Not documented in a structured way',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿Los documentos normativos son accesibles desde la ficha de producto en el ecommerce (PDP)?',
        ca: 'Els documents normatius són accessibles des de la fitxa de producte a l’ecommerce (PDP)?',
        en: 'Are regulatory documents accessible from the product detail page (PDP) in the ecommerce?',
      },
      opts: [
        {
          es: 'Sí, enlazados directamente en la PDP',
          ca: 'Sí, enllaçats directament a la PDP',
          en: 'Yes, linked directly on the PDP',
        },
        {
          es: 'Disponibles en el site pero no vinculados en la ficha',
          ca: 'Disponibles al site però no vinculats a la fitxa',
          en: 'Available on the site but not linked on the PDP',
        },
        {
          es: 'No están disponibles en el ecommerce',
          ca: 'No estan disponibles a l’ecommerce',
          en: 'Not available in the ecommerce',
        },
      ],
      pts: [10, 5, 1],
    },
  ],
  seo: [
    {
      text: {
        es: '¿Las URLs de producto y categoría son descriptivas y limpias?',
        ca: 'Les URLs de producte i categoria són descriptives i netes?',
        en: 'Are product and category URLs descriptive and clean?',
      },
      opts: [
        {
          es: 'Sí, con palabras clave relevantes',
          ca: 'Sí, amb paraules clau rellevants',
          en: 'Yes, with relevant keywords',
        },
        {
          es: 'Parcialmente, mezcla de URLs limpias y técnicas',
          ca: 'Parcialment, barreja d’URLs netes i tècniques',
          en: 'Partially; mix of clean and technical URLs',
        },
        {
          es: 'No, son técnicas o generadas automáticamente',
          ca: 'No, són tècniques o generades automàticament',
          en: 'No; they are technical or auto-generated',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿Cada ficha de producto tiene meta title y description únicos y optimizados?',
        ca: 'Cada fitxa de producte té meta title i description únics i optimitzats?',
        en: 'Does each product page have unique, optimized meta title and description?',
      },
      opts: [
        {
          es: 'Sí, revisados manualmente o con reglas por familia',
          ca: 'Sí, revisats manualment o amb regles per família',
          en: 'Yes, reviewed manually or with family rules',
        },
        {
          es: 'Generados automáticamente de forma genérica',
          ca: 'Generats automàticament de forma genèrica',
          en: 'Generated automatically in a generic way',
        },
        {
          es: 'No están definidos o están vacíos',
          ca: 'No estan definits o estan buits',
          en: 'Not defined or empty',
        },
      ],
      pts: [10, 5, 1],
    },
  ],
  ux: [
    {
      text: {
        es: '¿Los filtros de navegación reflejan los atributos reales del catálogo (por familia de producto)?',
        ca: 'Els filtres de navegació reflecteixen els atributs reals del catàleg (per família de producte)?',
        en: 'Do navigation filters reflect real catalog attributes (by product family)?',
      },
      opts: [
        {
          es: 'Sí, filtros precisos y útiles por categoría',
          ca: 'Sí, filtres precisos i útils per categoria',
          en: 'Yes, precise and useful filters per category',
        },
        {
          es: 'Filtros básicos que no siempre encajan con el catálogo',
          ca: 'Filtres bàsics que no sempre encaixen amb el catàleg',
          en: 'Basic filters that do not always match the catalog',
        },
        {
          es: 'Casi sin filtros o muy genéricos',
          ca: 'Gairebé sense filtres o molt genèrics',
          en: 'Almost no filters or very generic ones',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿El proceso de compra es fluido desde la ficha de producto hasta el pago?',
        ca: 'El procés de compra és fluid des de la fitxa de producte fins al pagament?',
        en: 'Is the purchase flow smooth from product page to payment?',
      },
      opts: [
        {
          es: 'Sí, sin fricciones visibles',
          ca: 'Sí, sense friccions visibles',
          en: 'Yes, without visible friction',
        },
        {
          es: 'Hay algún paso confuso o lento',
          ca: 'Hi ha algun pas confús o lent',
          en: 'There is a confusing or slow step',
        },
        {
          es: 'Hay abandono claro antes de completar la compra',
          ca: 'Hi ha abandonament clar abans de completar la compra',
          en: 'Clear drop-off before completing purchase',
        },
      ],
      pts: [10, 5, 1],
    },
  ],
  compliance: [
    {
      text: {
        es: '¿La ficha de producto (PDP) muestra el precio con IVA incluido y cualquier cargo adicional de forma clara?',
        ca: 'La fitxa de producte (PDP) mostra el preu amb IVA inclòs i qualsevol càrrec addicional de forma clara?',
        en: 'Does the product page (PDP) clearly show price including VAT and any additional charges?',
      },
      opts: [
        {
          es: 'Sí, siempre visible y desglosado',
          ca: 'Sí, sempre visible i desglossat',
          en: 'Yes, always visible and itemized',
        },
        {
          es: 'A veces o de forma ambigua',
          ca: 'De vegades o de forma ambigua',
          en: 'Sometimes or ambiguously',
        },
        {
          es: 'No siempre es claro o no se muestra',
          ca: 'No sempre és clar o no es mostra',
          en: 'Not always clear or not shown',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿La PDP incluye información sobre política de devoluciones y garantía legal (mínimo 14 días según Directiva EU)?',
        ca: 'La PDP inclou informació sobre política de devolucions i garantia legal (mínim 14 dies segons la Directiva UE)?',
        en: 'Does the PDP include returns policy and legal warranty info (minimum 14 days under the EU Directive)?',
      },
      opts: [
        {
          es: 'Sí, visible y con plazos claros',
          ca: 'Sí, visible i amb terminis clars',
          en: 'Yes, visible with clear deadlines',
        },
        {
          es: 'Existe pero es difícil de encontrar',
          ca: 'Existeix però és difícil de trobar',
          en: 'It exists but is hard to find',
        },
        {
          es: 'No está o no especifica plazos',
          ca: 'No hi és o no especifica terminis',
          en: 'Missing or without deadlines',
        },
      ],
      pts: [10, 5, 1],
    },
    {
      text: {
        es: '¿La ficha de producto muestra la identificación del vendedor y/o el responsable autorizado en la UE (obligatorio bajo GPSR desde dic. 2024)?',
        ca: 'La fitxa de producte mostra la identificació del venedor i/o el responsable autoritzat a la UE (obligatori sota GPSR des de des. 2024)?',
        en: 'Does the product page show seller identification and/or the EU authorized representative (required under GPSR since Dec 2024)?',
      },
      opts: [
        {
          es: 'Sí, identificación clara y visible',
          ca: 'Sí, identificació clara i visible',
          en: 'Yes, clear and visible identification',
        },
        {
          es: 'Parcialmente (en pie de página o condiciones)',
          ca: 'Parcialment (al peu de pàgina o condicions)',
          en: 'Partially (footer or terms)',
        },
        {
          es: 'No está visible en la ficha de producto',
          ca: 'No és visible a la fitxa de producte',
          en: 'Not visible on the product page',
        },
      ],
      pts: [10, 5, 1],
    },
  ],
}

export function loc(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.es
}

function signalFlags(data: MicrolinkSiteData) {
  const title = data.title || ''
  const desc = data.description || ''
  const keywords = `${title} ${desc}`.toLowerCase()
  return {
    title,
    desc,
    image: data.image?.url || '',
    lang: data.lang || '',
    logo: data.logo?.url || '',
    hasIva: /iva|tax|vat|impuesto/i.test(keywords),
    hasCE: /\bce\b|marcado ce|conformidad|declaraci/i.test(keywords),
    hasReturn: /devoluci|return|14 d[ií]as|garant[ií]/i.test(keywords),
    hasVendor: /vendedor|seller|responsable|empresa|s\.l\.|s\.a\./i.test(keywords),
    hasDocLinks: /pdf|ficha t[eé]cn|manual|certificad|sds|hoja de seguridad/i.test(keywords),
  }
}

export function computeRealScores(
  areas: Iterable<AssessmentAreaId>,
  data: MicrolinkSiteData,
): { scores: Partial<Record<AssessmentAreaId, number>>; global: number } {
  const s = signalFlags(data)
  const scores: Partial<Record<AssessmentAreaId, number>> = {}
  const areaList = [...areas]

  for (const area of areaList) {
    let pts = 0
    if (area === 'seo') {
      if (s.title.length >= 30 && s.title.length <= 65) pts += 35
      else if (s.title.length > 0) pts += 15
      if (s.desc.length >= 50 && s.desc.length <= 160) pts += 35
      else if (s.desc.length > 0) pts += 15
      if (s.lang) pts += 15
      if (!/[?&=%]/.test((data.url || '').split('/')[2] || '')) pts += 15
    } else if (area === 'dam') {
      if (s.image) pts += 35
      if (s.logo) pts += 15
      if (s.hasDocLinks) pts += 30
      if (data.image?.width && data.image?.height) pts += 20
      pts = Math.min(pts, 100)
    } else if (area === 'pim') {
      let base = 40
      if (s.title.length > 10) base += 15
      if (s.desc.length > 50) base += 15
      if (s.image) base += 15
      if (s.hasCE) base += 15
      pts = Math.min(base, 100)
    } else if (area === 'ux') {
      let base = 40
      if (s.title.length > 5) base += 15
      if (s.desc.length > 20) base += 15
      if (s.image) base += 15
      if (s.hasReturn) base += 15
      pts = Math.min(base, 100)
    } else if (area === 'compliance') {
      let base = 10
      if (s.hasIva) base += 22
      if (s.hasCE) base += 22
      if (s.hasReturn) base += 23
      if (s.hasVendor) base += 23
      pts = Math.min(base, 100)
    }
    scores[area] = Math.max(10, Math.min(100, pts))
  }

  const total = areaList.reduce((acc, a) => acc + (scores[a] ?? 0), 0)
  const global = areaList.length ? Math.round(total / areaList.length) : 0
  return { scores, global }
}

export function buildRealFindings(
  areas: Iterable<AssessmentAreaId>,
  data: MicrolinkSiteData,
): Finding[] {
  const s = signalFlags(data)
  const set = new Set(areas)
  const findings: Finding[] = []

  if (set.has('seo')) {
    if (s.title.length >= 30 && s.title.length <= 65) {
      findings.push({ type: 'ok', key: 'assess.find.seo.title_ok', params: { n: s.title.length } })
    } else if (!s.title.length) {
      findings.push({ type: 'warn', key: 'assess.find.seo.title_missing' })
    } else {
      findings.push({ type: 'risk', key: 'assess.find.seo.title_len', params: { n: s.title.length } })
    }
    if (!s.desc.length) {
      findings.push({ type: 'warn', key: 'assess.find.seo.desc_missing' })
    } else if (s.desc.length < 50 || s.desc.length > 160) {
      findings.push({ type: 'risk', key: 'assess.find.seo.desc_len', params: { n: s.desc.length } })
    }
  }

  if (set.has('dam')) {
    findings.push({
      type: s.image ? 'ok' : 'warn',
      key: s.image ? 'assess.find.dam.image_ok' : 'assess.find.dam.image_missing',
    })
    findings.push({
      type: s.hasDocLinks ? 'ok' : 'risk',
      key: s.hasDocLinks ? 'assess.find.dam.docs_ok' : 'assess.find.dam.docs_missing',
    })
  }

  if (set.has('pim')) {
    findings.push({
      type: s.hasCE ? 'ok' : 'risk',
      key: s.hasCE ? 'assess.find.pim.ce_ok' : 'assess.find.pim.ce_missing',
    })
  }

  if (set.has('ux')) {
    findings.push({
      type: s.hasReturn ? 'ok' : 'risk',
      key: s.hasReturn ? 'assess.find.ux.return_ok' : 'assess.find.ux.return_missing',
    })
  }

  if (set.has('compliance')) {
    findings.push({
      type: s.hasIva ? 'ok' : 'warn',
      key: s.hasIva ? 'assess.find.comp.iva_ok' : 'assess.find.comp.iva_missing',
    })
    if (!s.hasVendor) {
      findings.push({ type: 'warn', key: 'assess.find.comp.vendor_missing' })
    }
    if (!s.hasCE && !s.hasDocLinks) {
      findings.push({ type: 'risk', key: 'assess.find.comp.ce_docs_missing' })
    }
  }

  return findings.slice(0, 6)
}

export function computeQuestionScores(
  areas: Iterable<AssessmentAreaId>,
  answers: Record<string, number>,
): { scores: Partial<Record<AssessmentAreaId, number>>; global: number } {
  const scores: Partial<Record<AssessmentAreaId, number>> = {}
  let totalPts = 0
  let maxTotal = 0

  for (const area of areas) {
    let pts = 0
    let max = 0
    QUESTION_DB[area].forEach((q, qi) => {
      const oi = answers[`${area}-${qi}`] ?? 0
      pts += q.pts[oi] ?? 0
      max += q.pts[0]
    })
    scores[area] = max ? Math.round((pts / max) * 100) : 0
    totalPts += pts
    maxTotal += max
  }

  return {
    scores,
    global: maxTotal ? Math.round((totalPts / maxTotal) * 100) : 0,
  }
}

export function maturityTitleKey(global: number): string {
  if (global >= 75) return 'assess.results.title_high'
  if (global >= 50) return 'assess.results.title_mid'
  return 'assess.results.title_low'
}

export function maturityBadgeKey(global: number): string {
  if (global >= 75) return 'assess.results.badge_high'
  if (global >= 50) return 'assess.results.badge_mid'
  return 'assess.results.badge_low'
}

export function maturityLevel(global: number): 'high' | 'mid' | 'low' {
  if (global >= 75) return 'high'
  if (global >= 50) return 'mid'
  return 'low'
}
