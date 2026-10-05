import { computed, reactive, ref } from 'vue'
import {
  AREA_DEFS,
  QUESTION_DB,
  buildRealFindings,
  computeQuestionScores,
  computeRealScores,
  type AssessmentAreaId,
  type Finding,
  type MicrolinkSiteData,
  type ReviewType,
} from '../data/assessmentContent'

export type AssessmentStep =
  | 'setup'
  | 'loading'
  | 'results'
  | 'questions'
  | 'email'
  | 'confirm'

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function useAssessmentFlow() {
  const step = ref<AssessmentStep>('setup')
  const url = ref('')
  const reviewType = ref<ReviewType | ''>('')
  const selectedAreas = ref<Set<AssessmentAreaId>>(new Set())
  const answers = reactive<Record<string, number>>({})
  const email = ref('')
  const scores = reactive<Partial<Record<AssessmentAreaId, number>>>({})
  const globalScore = ref(0)
  const siteData = ref<MicrolinkSiteData | null>(null)
  const findings = ref<Finding[]>([])
  const setupError = ref(false)
  const questionsError = ref(false)
  const emailError = ref(false)
  const submitting = ref(false)
  const loadingIndex = ref(-1)
  const loadingDone = ref<Set<number>>(new Set())
  const progressPct = ref(0)
  const activeDot = ref(1)
  const showDetailedDots = ref(true)

  const urlValid = computed(() => {
    const u = url.value.trim()
    return u.length > 3 && u.includes('.')
  })

  const setupValid = computed(
    () => urlValid.value && !!reviewType.value && selectedAreas.value.size > 0,
  )

  const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

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
    setupError.value = false
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

  async function start() {
    if (!setupValid.value) {
      setupError.value = true
      return
    }
    setupError.value = false
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
    loadingIndex.value = -1
    loadingDone.value = new Set()
    goTo('loading', { dot: 2, pct: 40, detailedDots: false })

    let data: MicrolinkSiteData = {}
    await markLoading(0)
    try {
      const res = await fetch(
        `https://api.microlink.io/?url=https://${url.value.trim()}&meta=true`,
      )
      const json = (await res.json()) as { data?: MicrolinkSiteData }
      data = json.data || {}
      siteData.value = data
    } catch {
      // Microlink may fail; scoring still runs on empty metadata.
    }
    await finishLoading(0, 300)

    await markLoading(1)
    await finishLoading(1, 900)
    await markLoading(2)
    await finishLoading(2, 800)
    await markLoading(3)
    await finishLoading(3, 600)

    await markLoading(4)
    const result = computeRealScores(selectedAreas.value, data)
    Object.keys(scores).forEach((k) => delete scores[k as AssessmentAreaId])
    Object.assign(scores, result.scores)
    globalScore.value = result.global
    findings.value = buildRealFindings(selectedAreas.value, data)
    await finishLoading(4, 500)

    await delay(400)
    goTo('results', { dot: 2, pct: 100, detailedDots: false })
  }

  function runDetailed() {
    goTo('questions', { dot: 2, pct: 35, detailedDots: true })
  }

  function switchToDetailed() {
    reviewType.value = 'detailed'
    runDetailed()
  }

  function goEmail() {
    if (!allQuestionsAnswered()) {
      questionsError.value = true
      return
    }
    questionsError.value = false
    const result = computeQuestionScores(selectedAreas.value, answers)
    Object.keys(scores).forEach((k) => delete scores[k as AssessmentAreaId])
    Object.assign(scores, result.scores)
    globalScore.value = result.global
    goTo('email', { dot: 3, pct: 70, detailedDots: true })
  }

  /** Mock submit for demo; lead API / gated report land in a later iteration. */
  async function submitDetailed() {
    if (!emailValid.value) {
      emailError.value = true
      return
    }
    emailError.value = false
    submitting.value = true
    await delay(600)
    submitting.value = false
    goTo('confirm', { dot: 4, pct: 100, detailedDots: true })
  }

  return {
    step,
    url,
    reviewType,
    selectedAreas,
    answers,
    email,
    scores,
    globalScore,
    siteData,
    findings,
    setupError,
    questionsError,
    emailError,
    submitting,
    loadingIndex,
    loadingDone,
    progressPct,
    activeDot,
    showDetailedDots,
    urlValid,
    setupValid,
    emailValid,
    selectedAreaList,
    toggleArea,
    selectType,
    setAnswer,
    start,
    switchToDetailed,
    goEmail,
    submitDetailed,
  }
}
