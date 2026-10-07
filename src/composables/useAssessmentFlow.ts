import { computed, reactive, ref } from 'vue'
import {
  AREA_DEFS,
  QUESTION_DB,
  computeQuestionScores,
  loc,
  type AssessmentAreaId,
  type ReviewType,
} from '../data/assessmentContent'
import {
  analyzeAssessment,
  type AnalyzeFinding,
  type MaturityBand,
} from '../services/assessment.service'
import { useLeadsStore } from '../stores/leads'
import { useLocaleStore } from '../stores/locale'
import { getApiErrorMessage } from '../utils/api-error'

export type AssessmentStep =
  | 'urlAreas'
  | 'type'
  | 'loading'
  | 'results'
  | 'questions'
  | 'email'
  | 'confirm'

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function buildAnalysisMessage(input: {
  url: string
  reviewType: ReviewType
  areas: AssessmentAreaId[]
  globalScore: number
  scores: Partial<Record<AssessmentAreaId, number>>
  findings: AnalyzeFinding[]
  answers: Record<string, number>
  lang: 'es' | 'ca' | 'en'
}): string {
  const areaLabels = input.areas
    .map((id) => AREA_DEFS.find((a) => a.id === id)?.labelKey ?? id)
    .join(', ')
  const scoreLines = input.areas
    .map((id) => `  - ${id}: ${input.scores[id] ?? '—'}/100`)
    .join('\n')
  const critical = input.findings
    .filter((f) => f.severity === 'error')
    .map((f) => `  - [${f.area}] ${f.code}: ${f.message}`)
    .join('\n')

  let answersBlock = ''
  if (input.reviewType === 'detailed') {
    const parts: string[] = []
    for (const area of input.areas) {
      QUESTION_DB[area].forEach((q, qi) => {
        const oi = input.answers[`${area}-${qi}`]
        if (oi === undefined) return
        parts.push(
          `  - [${area}] ${loc(q.text, input.lang)}\n    → ${loc(q.opts[oi], input.lang)}`,
        )
      })
    }
    answersBlock = parts.length ? `\nQuestionnaire:\n${parts.join('\n')}` : ''
  }

  return [
    'Ecommerce Assessment',
    `Type: ${input.reviewType}`,
    `URL: ${input.url}`,
    `Areas keys: ${areaLabels}`,
    `Global score: ${input.globalScore}/100`,
    `Scores:\n${scoreLines}`,
    critical ? `Critical findings:\n${critical}` : 'Critical findings: none',
    answersBlock,
  ]
    .filter(Boolean)
    .join('\n')
}

export function useAssessmentFlow() {
  const leads = useLeadsStore()
  const localeStore = useLocaleStore()

  const step = ref<AssessmentStep>('urlAreas')
  const url = ref('')
  const reviewType = ref<ReviewType | ''>('')
  const selectedAreas = ref<Set<AssessmentAreaId>>(new Set())
  const answers = reactive<Record<string, number>>({})
  const email = ref('')
  const name = ref('')
  const company = ref('')
  const phone = ref('')
  const gdprConsent = ref(false)
  const honeypot = ref('')
  const scores = reactive<Partial<Record<AssessmentAreaId, number>>>({})
  const globalScore = ref(0)
  const maturity = ref<MaturityBand>('critical')
  const findings = ref<AnalyzeFinding[]>([])
  const analyzedUrl = ref('')
  const setupError = ref(false)
  const typeError = ref(false)
  const questionsError = ref(false)
  const emailError = ref(false)
  const analyzeError = ref<string | null>(null)
  const submitError = ref<string | null>(null)
  const submitting = ref(false)
  const loadingIndex = ref(-1)
  const loadingDone = ref<Set<number>>(new Set())
  const progressPct = ref(0)
  const activeDot = ref(1)
  const showDetailedDots = ref(false)

  const urlValid = computed(() => {
    const u = url.value.trim()
    return u.length > 3 && u.includes('.')
  })

  const urlAreasValid = computed(() => urlValid.value && selectedAreas.value.size > 0)

  const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

  const contactValid = computed(() => {
    if (!emailValid.value || !gdprConsent.value) return false
    if (reviewType.value === 'detailed') {
      return name.value.trim().length > 1 && company.value.trim().length > 1
    }
    return true
  })

  const selectedAreaList = computed(() =>
    AREA_DEFS.filter((a) => selectedAreas.value.has(a.id)).map((a) => a.id),
  )

  function toggleArea(id: AssessmentAreaId) {
    const next = new Set(selectedAreas.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selectedAreas.value = next
    setupError.value = false
  }

  function selectType(type: ReviewType) {
    reviewType.value = type
    typeError.value = false
  }

  function setAnswer(area: AssessmentAreaId, qi: number, oi: number) {
    answers[`${area}-${qi}`] = oi
    questionsError.value = false
  }

  function allQuestionsAnswered() {
    for (const area of selectedAreas.value) {
      for (let i = 0; i < QUESTION_DB[area].length; i++) {
        if (answers[`${area}-${i}`] === undefined) return false
      }
    }
    return true
  }

  function goTo(
    next: AssessmentStep,
    opts: { dot: number; pct: number; detailedDots?: boolean },
  ) {
    step.value = next
    activeDot.value = opts.dot
    progressPct.value = opts.pct
    if (opts.detailedDots !== undefined) showDetailedDots.value = opts.detailedDots
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function continueFromUrlAreas() {
    if (!urlAreasValid.value) {
      setupError.value = true
      return
    }
    setupError.value = false
    goTo('type', { dot: 2, pct: 25, detailedDots: false })
  }

  async function startFromType() {
    if (!reviewType.value) {
      typeError.value = true
      return
    }
    typeError.value = false
    if (reviewType.value === 'instant') await runInstant()
    else runDetailed()
  }

  async function markLoading(idx: number) {
    loadingIndex.value = idx
  }

  async function finishLoading(idx: number, waitMs: number) {
    await delay(waitMs)
    loadingDone.value = new Set([...loadingDone.value, idx])
  }

  async function runInstant() {
    analyzeError.value = null
    loadingIndex.value = -1
    loadingDone.value = new Set()
    goTo('loading', { dot: 2, pct: 45, detailedDots: false })

    await markLoading(0)
    let result
    try {
      const analyzePromise = analyzeAssessment({
        url: url.value.trim(),
        areas: selectedAreaList.value,
      })
      await finishLoading(0, 400)
      await markLoading(1)
      await finishLoading(1, 500)
      await markLoading(2)
      result = await analyzePromise
      await finishLoading(2, 300)
    } catch (e) {
      analyzeError.value = getApiErrorMessage(e) || 'Analysis failed'
      goTo('type', { dot: 2, pct: 25, detailedDots: false })
      return
    }

    await markLoading(3)
    Object.keys(scores).forEach((k) => delete scores[k as AssessmentAreaId])
    Object.assign(scores, result.scores)
    globalScore.value = result.globalScore
    maturity.value = result.maturity
    findings.value = result.findings
    analyzedUrl.value = result.url
    await finishLoading(3, 400)
    await markLoading(4)
    await finishLoading(4, 300)

    goTo('results', { dot: 2, pct: 70, detailedDots: false })
  }

  function runDetailed() {
    goTo('questions', { dot: 2, pct: 40, detailedDots: true })
  }

  function switchToDetailed() {
    reviewType.value = 'detailed'
    runDetailed()
  }

  function goEmailFromResults() {
    goTo('email', { dot: 3, pct: 85, detailedDots: false })
  }

  function goEmailFromQuestions() {
    if (!allQuestionsAnswered()) {
      questionsError.value = true
      return
    }
    questionsError.value = false
    const result = computeQuestionScores(selectedAreas.value, answers)
    Object.keys(scores).forEach((k) => delete scores[k as AssessmentAreaId])
    Object.assign(scores, result.scores)
    globalScore.value = result.global
    maturity.value =
      result.global >= 81
        ? 'excellent'
        : result.global >= 66
          ? 'good'
          : result.global >= 41
            ? 'improvable'
            : 'critical'
    goTo('email', { dot: 3, pct: 75, detailedDots: true })
  }

  async function submitContact() {
    if (honeypot.value.trim()) {
      goTo('confirm', { dot: 4, pct: 100, detailedDots: reviewType.value === 'detailed' })
      return
    }
    if (!contactValid.value) {
      emailError.value = true
      return
    }
    emailError.value = false
    submitError.value = null
    submitting.value = true

    const fullUrl =
      analyzedUrl.value ||
      (url.value.trim().startsWith('http')
        ? url.value.trim()
        : `https://${url.value.trim()}`)

    const message = buildAnalysisMessage({
      url: fullUrl,
      reviewType: (reviewType.value || 'instant') as ReviewType,
      areas: selectedAreaList.value,
      globalScore: globalScore.value,
      scores: { ...scores },
      findings: findings.value,
      answers: { ...answers },
      lang: localeStore.lang,
    })

    try {
      leads.registerIntent({
        interestType: 'ecommerce_assessment',
        sourcePage: 'home',
        sourceSection: 'ecommerce_assessment',
        sourceCardId:
          reviewType.value === 'detailed' ? 'detailed_review' : 'instant_review',
        sourceCta: 'assessment_submit',
      })
      await leads.createLead({
        email: email.value,
        company: company.value,
        name: name.value,
        phone: phone.value,
        message,
        fallbackInterest: 'ecommerce_assessment',
        fallbackContext: {
          sourcePage: 'home',
          sourceSection: 'ecommerce_assessment',
          sourceCardId:
            reviewType.value === 'detailed' ? 'detailed_review' : 'instant_review',
          sourceCta: 'assessment_submit',
        },
      })
      goTo('confirm', {
        dot: 4,
        pct: 100,
        detailedDots: reviewType.value === 'detailed',
      })
    } catch {
      submitError.value = leads.createLeadError || 'Submit failed'
    } finally {
      submitting.value = false
    }
  }

  return {
    step,
    url,
    reviewType,
    selectedAreas,
    answers,
    email,
    name,
    company,
    phone,
    gdprConsent,
    honeypot,
    scores,
    globalScore,
    maturity,
    findings,
    analyzedUrl,
    setupError,
    typeError,
    questionsError,
    emailError,
    analyzeError,
    submitError,
    submitting,
    loadingIndex,
    loadingDone,
    progressPct,
    activeDot,
    showDetailedDots,
    urlValid,
    urlAreasValid,
    emailValid,
    contactValid,
    selectedAreaList,
    toggleArea,
    selectType,
    setAnswer,
    continueFromUrlAreas,
    startFromType,
    switchToDetailed,
    goEmailFromResults,
    goEmailFromQuestions,
    submitContact,
  }
}
