import { createApp, h } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAssessmentFlow } from '@/composables/useAssessmentFlow'
import * as assessmentService from '@/services/assessment.service'
import { translations } from '@/data/translations'

jest.mock('@/services/assessment.service', () => ({
  analyzeAssessment: jest.fn(),
}))

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
    analyze.mockResolvedValue({
      url: 'https://shop.example.com/p/1',
      globalScore: 72,
      scores: { seo: 72 },
      findings: [
        { area: 'seo', severity: 'error', code: 'SEO_TITLE', message: 'Title issue' },
      ],
      maturity: 'good',
      source: 'html',
    })

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

