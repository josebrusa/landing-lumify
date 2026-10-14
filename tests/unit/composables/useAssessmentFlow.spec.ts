import { createApp, h } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAssessmentFlow } from '@/composables/useAssessmentFlow'
import * as assessmentService from '@/services/assessment.service'
import { useLeadsStore } from '@/stores/leads'
import { translations } from '@/data/translations'

jest.mock('@/services/assessment.service', () => ({
  analyzeAssessment: jest.fn(),
  emptyEvidence: jest.requireActual('@/services/assessment.service').emptyEvidence,
}))

const mockAnalyzeResult = {
  url: 'https://shop.example.com/p/1',
  globalScore: 72,
  scores: { seo: 72 },
  findings: [
    { area: 'seo' as const, severity: 'error' as const, code: 'SEO_TITLE', message: 'Title issue' },
  ],
  maturity: 'good' as const,
  source: 'html' as const,
  evidence: {
    title: 'Product title',
    metaDescription: 'Meta',
    h1: 'H1',
    canonical: 'https://shop.example.com/p/1',
    ogTitle: '',
    ogImage: '',
    lang: 'es',
    https: true,
    hasJsonLdProduct: false,
    hasGtin: false,
    hasSku: false,
    hasBrand: false,
    hasVariantsHint: false,
    hasSpecsHint: false,
    imageCount: 1,
    imagesWithAlt: 1,
    hasPdfLink: false,
    hasVideo: false,
    hasBuyButton: true,
    hasPrice: true,
    hasReturns: false,
    hasReviews: false,
    hasIva: false,
    hasVendor: false,
    hasGpsr: false,
    hasCe: false,
    hasCookies: false,
    bodyTextLength: 200,
  },
  screenshots: [
    {
      label: 'desktop' as const,
      key: 'assessments/abc/desktop.png',
      url: 'https://pub.example.com/assessments/abc/desktop.png',
    },
  ],
}

function withSetup<T>(composable: () => T): T {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => h('div')
    },
  })
  app.use(createPinia())
  app.mount(document.createElement('div'))
  return result
}

describe('useAssessmentFlow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true })
  })

  it('starts on urlAreas and blocks continue without URL/areas', () => {
    const flow = withSetup(useAssessmentFlow)
    expect(flow.step.value).toBe('urlAreas')
    flow.continueFromUrlAreas()
    expect(flow.setupError.value).toBe(true)
    expect(flow.step.value).toBe('urlAreas')
  })

  it('advances to type after valid URL and areas', () => {
    const flow = withSetup(useAssessmentFlow)
    flow.url.value = 'https://shop.example.com/p/1'
    flow.toggleArea('seo')
    flow.continueFromUrlAreas()
    expect(flow.setupError.value).toBe(false)
    expect(flow.step.value).toBe('type')
  })

  it('keeps findings in memory after analyze but stays on gated results', async () => {
    const analyze = assessmentService.analyzeAssessment as jest.Mock
    analyze.mockResolvedValue(mockAnalyzeResult)

    const flow = withSetup(useAssessmentFlow)
    flow.url.value = 'shop.example.com/p/1'
    flow.toggleArea('seo')
    flow.continueFromUrlAreas()
    flow.selectType('instant')
    await flow.startFromType()

    expect(flow.step.value).toBe('results')
    expect(flow.globalScore.value).toBe(72)
    expect(flow.findings.value).toHaveLength(1)
    expect(flow.findings.value[0]?.code).toBe('SEO_TITLE')
  })

  it('submits structured analysis with the lead', async () => {
    const analyze = assessmentService.analyzeAssessment as jest.Mock
    analyze.mockResolvedValue(mockAnalyzeResult)

    const flow = withSetup(useAssessmentFlow)
    const leads = useLeadsStore()
    const createLead = jest.spyOn(leads, 'createLead').mockResolvedValue({
      id: 'lead-1',
      status: 'new',
      createdAt: new Date().toISOString(),
    })

    flow.url.value = 'shop.example.com/p/1'
    flow.toggleArea('seo')
    flow.continueFromUrlAreas()
    flow.selectType('instant')
    await flow.startFromType()
    flow.goEmailFromResults()
    flow.email.value = 'user@example.com'
    flow.gdprConsent.value = true
    await flow.submitContact()

    expect(createLead).toHaveBeenCalled()
    const payload = createLead.mock.calls[0]?.[0]
    expect(payload.analysis).toMatchObject({
      url: 'https://shop.example.com/p/1',
      reviewType: 'instant',
      areas: ['seo'],
      globalScore: 72,
      source: 'html',
      evidence: expect.objectContaining({ title: 'Product title' }),
      screenshots: [
        expect.objectContaining({
          label: 'desktop',
          url: 'https://pub.example.com/assessments/abc/desktop.png',
        }),
      ],
    })
    expect(flow.step.value).toBe('confirm')
  })

  it('honeypot skips lead create and goes to confirm', async () => {
    const flow = withSetup(useAssessmentFlow)
    flow.reviewType.value = 'instant'
    flow.email.value = 'user@example.com'
    flow.gdprConsent.value = true
    flow.honeypot.value = 'bot-filled'
    await flow.submitContact()
    expect(flow.step.value).toBe('confirm')
  })

  it('exposes Hero/Services assessment CTA copy in ES/CA/EN', () => {
    for (const lang of ['es', 'ca', 'en'] as const) {
      expect(translations[lang]['hero.cta_assessment']).toBeTruthy()
      expect(translations[lang]['serv.cta_assessment']).toBeTruthy()
      expect(translations[lang]['lead.interest.ecommerce_assessment']).toBeTruthy()
    }
  })
})

