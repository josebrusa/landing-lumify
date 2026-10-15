<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AREA_DEFS,
  CONTEXT_QUESTIONS,
  QUESTION_DB,
  loc,
  type AssessmentAreaId,
} from '@/data/assessmentContent'
import { useI18n } from '@/composables/useI18n'
import { useLocaleStore } from '@/stores/locale'
import { useLeadsStore } from '@/stores/leads'
import type { AuditPackKey, LeadAssessmentAnalysis } from '@/types/api'

const props = defineProps<{
  analysis: LeadAssessmentAnalysis
  leadId?: string
}>()

const { t } = useI18n()
const localeStore = useLocaleStore()
const leadsStore = useLeadsStore()

const AREA_ORDER: AssessmentAreaId[] = ['pim', 'dam', 'seo', 'ux', 'compliance']

const PACK_LABEL_KEYS: Record<AuditPackKey, string> = {
  'pack-health': 'admin.assessment.pack_health',
  'pack-datos': 'admin.assessment.pack_datos',
  'pack-omni': 'admin.assessment.pack_omni',
  'pack-beauty': 'admin.assessment.pack_beauty',
}

const report = computed(() => props.analysis.report)
const regenerating = ref(false)
const regenerateError = ref<string | null>(null)
const copyDone = ref(false)

const evidence = computed(() => props.analysis.evidence)

const screenshotItems = computed(() => props.analysis.screenshots ?? [])

const evidenceShots = computed(() =>
  screenshotItems.value.filter(
    (s) => s.role === 'evidence' || (s.focus && s.focus !== 'pdp'),
  ),
)

const contextShots = computed(() =>
  screenshotItems.value.filter(
    (s) =>
      s.role === 'context' ||
      s.label === 'desktop' ||
      s.label === 'mobile' ||
      (!s.role && !s.focus),
  ),
)

function screenshotLabel(shot: (typeof screenshotItems.value)[number]): string {
  const key = `admin.assessment.screenshot_${shot.label}` as const
  const translated = t(key)
  return translated === key ? shot.label : translated
}

const orderedAreas = computed(() => {
  const selected = new Set(props.analysis.areas)
  return AREA_ORDER.filter((id) => selected.has(id)).map((id) => ({
    id,
    label: t(AREA_DEFS.find((a) => a.id === id)?.labelKey ?? id),
    score: props.analysis.scores[id] ?? 0,
    primary: id === 'pim' || id === 'dam',
  }))
})

const maturityLabel = computed(() => {
  const m = props.analysis.maturity
  if (m === 'excellent') return t('assess.results.badge_excellent')
  if (m === 'good') return t('assess.results.badge_good')
  if (m === 'improvable') return t('assess.results.badge_improvable')
  return t('assess.results.badge_critical')
})

const reviewLabel = computed(() =>
  props.analysis.reviewType === 'detailed'
    ? t('admin.assessment.review_detailed')
    : t('admin.assessment.review_instant'),
)

const findingsByArea = computed(() => {
  const groups: { id: AssessmentAreaId; label: string; items: typeof props.analysis.findings }[] =
    []
  for (const id of AREA_ORDER) {
    const items = props.analysis.findings.filter((f) => f.area === id)
    if (!items.length) continue
    groups.push({
      id,
      label: t(AREA_DEFS.find((a) => a.id === id)?.labelKey ?? id),
      items,
    })
  }
  return groups
})

const questionnaireRows = computed(() => {
  if (props.analysis.reviewType !== 'detailed' || !props.analysis.answers) return []
  const lang = localeStore.lang
  const rows: { area: string; question: string; answer: string }[] = []
  CONTEXT_QUESTIONS.forEach((q, qi) => {
    const oi = props.analysis.answers?.[`context-${qi}`]
    if (oi === undefined) return
    rows.push({
      area: t('assess.q.context'),
      question: loc(q.text, lang),
      answer: loc(q.opts[oi], lang),
    })
  })
  for (const area of AREA_ORDER) {
    if (!props.analysis.areas.includes(area)) continue
    QUESTION_DB[area].forEach((q, qi) => {
      const oi = props.analysis.answers?.[`${area}-${qi}`]
      if (oi === undefined) return
      rows.push({
        area: t(AREA_DEFS.find((a) => a.id === area)?.labelKey ?? area),
        question: loc(q.text, lang),
        answer: loc(q.opts[oi], lang),
      })
    })
  }
  return rows
})

function flag(v: boolean | undefined) {
  return v ? t('admin.assessment.yes') : t('admin.assessment.no')
}

function severityClass(severity: string) {
  if (severity === 'error') return 'text-red-700 bg-red-50 border-red-100'
  if (severity === 'warn') return 'text-orange-700 bg-orange-50 border-orange-100'
  if (severity === 'info') return 'text-slate-700 bg-slate-50 border-slate-100'
  return 'text-emerald-700 bg-emerald-50 border-emerald-100'
}

function packLabel(key: AuditPackKey) {
  return t(PACK_LABEL_KEYS[key])
}

async function copyDraft() {
  const text = report.value?.clientEmailDraft
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copyDone.value = true
    window.setTimeout(() => {
      copyDone.value = false
    }, 2000)
  } catch {
    copyDone.value = false
  }
}

async function regenerate() {
  if (!props.leadId) return
  regenerating.value = true
  regenerateError.value = null
  try {
    await leadsStore.regenerateLeadReport(props.leadId)
  } catch (e) {
    regenerateError.value = e instanceof Error ? e.message : t('admin.assessment.regenerate_error')
  } finally {
    regenerating.value = false
  }
}
</script>

<template>
  <section class="rounded-radius border border-gray-light bg-white p-5 mb-4">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <h2 class="text-sm font-semibold text-text">{{ t('admin.assessment.title') }}</h2>
        <p class="text-xs text-text-muted mt-1">{{ t('admin.assessment.subtitle') }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          class="inline-flex rounded-full bg-blue/15 px-2.5 py-1 text-xs font-semibold text-deep"
        >
          {{ reviewLabel }}
        </span>
        <span
          class="inline-flex rounded-full bg-gray-light/80 px-2.5 py-1 text-xs font-semibold text-text"
        >
          {{ maturityLabel }} · {{ analysis.globalScore }}/100
        </span>
        <span
          class="inline-flex rounded-full border border-gray-light px-2.5 py-1 text-xs font-medium text-text-muted"
        >
          {{ t('admin.assessment.source') }}: {{ analysis.source }}
        </span>
      </div>
    </div>

    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
      <div>
        <dt class="text-text-muted">{{ t('admin.assessment.url') }}</dt>
        <dd class="font-medium text-deep break-all">
          <a :href="analysis.url" target="_blank" rel="noopener noreferrer" class="underline">
            {{ analysis.url }}
          </a>
        </dd>
      </div>
      <div>
        <dt class="text-text-muted">{{ t('admin.assessment.analyzed_at') }}</dt>
        <dd class="text-text font-medium">
          {{ new Date(analysis.analyzedAt).toLocaleString() }}
        </dd>
      </div>
    </dl>

    <!-- Audit report (commercial) -->
    <div
      v-if="report"
      class="rounded-radius border border-blue/30 bg-blue/5 p-4 mb-5 space-y-4"
    >
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-wide text-blue mb-1">
            {{ t('admin.assessment.report_title') }}
          </h3>
          <p class="text-xs text-text-muted">
            {{
              report.confidence === 'full'
                ? t('admin.assessment.confidence_full')
                : t('admin.assessment.confidence_partial')
            }}
          </p>
        </div>
        <button
          v-if="leadId"
          type="button"
          class="text-xs font-semibold text-deep underline disabled:opacity-50"
          :disabled="regenerating"
          @click="regenerate"
        >
          {{ regenerating ? t('admin.assessment.regenerating') : t('admin.assessment.regenerate') }}
        </button>
      </div>
      <p v-if="regenerateError" class="text-xs text-red-600">{{ regenerateError }}</p>

      <div>
        <p class="font-heading text-base font-bold text-deep">{{ report.verdict.headline }}</p>
        <p class="text-sm text-text mt-1 leading-relaxed">{{ report.verdict.summary }}</p>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          {{ t('admin.assessment.proposal') }}
        </h4>
        <p class="text-sm font-semibold text-deep">
          {{ packLabel(report.proposal.primaryPack) }}
          <span
            v-if="report.proposal.discoveryCall"
            class="ml-2 text-[11px] font-medium text-orange-700 bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5"
          >
            {{ t('admin.assessment.discovery_call') }}
          </span>
        </p>
        <p class="text-sm text-text mt-1">{{ report.proposal.rationale }}</p>
        <ul
          v-if="report.proposal.secondaryPacks.length"
          class="mt-2 text-xs text-text-muted list-disc pl-4"
        >
          <li v-for="p in report.proposal.secondaryPacks" :key="p">
            {{ t('admin.assessment.secondary') }}: {{ packLabel(p) }}
          </li>
        </ul>
        <ul class="mt-2 space-y-1">
          <li
            v-for="(tp, i) in report.proposal.talkingPoints"
            :key="i"
            class="text-xs text-text border border-gray-light rounded-radius px-2.5 py-2 bg-white"
          >
            {{ tp }}
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          {{ t('admin.assessment.gaps') }}
        </h4>
        <ul class="space-y-1.5">
          <li
            v-for="g in report.gaps"
            :key="g.id"
            class="text-xs border rounded-radius px-2.5 py-2"
            :class="severityClass(g.severity)"
          >
            <p class="font-semibold">{{ g.title }}</p>
            <p class="mt-0.5 opacity-90">{{ g.impact }}</p>
            <p class="mt-1 text-[11px] opacity-70">
              {{ g.source }} · {{ g.evidenceNote }}
            </p>
          </li>
        </ul>
      </div>

      <div v-if="evidenceShots.length">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          {{ t('admin.assessment.visual_evidence') }}
        </h4>
        <p class="text-[11px] text-text-muted mb-2">
          {{ t('admin.assessment.visual_evidence_hint') }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            v-for="shot in evidenceShots"
            :key="shot.key"
            :href="shot.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-radius border border-blue/30 overflow-hidden bg-white hover:border-blue/60 transition-colors"
          >
            <img
              :src="shot.url"
              :alt="screenshotLabel(shot)"
              class="w-full h-44 object-cover object-top bg-gray-light"
              loading="lazy"
            />
            <div class="px-2.5 py-2">
              <p class="text-xs font-semibold text-deep">{{ screenshotLabel(shot) }}</p>
              <p v-if="shot.note" class="text-[11px] text-text-muted mt-0.5">{{ shot.note }}</p>
              <p
                v-if="shot.relatedFindingCodes?.length"
                class="text-[10px] text-blue mt-1"
              >
                {{ shot.relatedFindingCodes.join(' · ') }}
              </p>
            </div>
          </a>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          {{ t('admin.assessment.dimensions') }}
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="d in report.dimensionScores"
            :key="d.id"
            class="rounded-radius border border-gray-light bg-white p-2.5"
          >
            <div class="flex justify-between text-xs font-semibold text-deep mb-1">
              <span>{{ d.label }}</span>
              <span>{{ d.score }}</span>
            </div>
            <p class="text-[11px] text-text-muted">{{ d.note }}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
          {{ t('admin.assessment.roadmap') }}
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="border border-gray-light rounded-radius p-2.5 bg-white">
            <p class="font-semibold text-deep mb-1">{{ t('admin.assessment.quick_wins') }}</p>
            <ul class="list-disc pl-4 space-y-0.5 text-text">
              <li v-for="(x, i) in report.roadmap.quickWins" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div class="border border-gray-light rounded-radius p-2.5 bg-white">
            <p class="font-semibold text-deep mb-1">30</p>
            <ul class="list-disc pl-4 space-y-0.5 text-text">
              <li v-for="(x, i) in report.roadmap.days30" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div class="border border-gray-light rounded-radius p-2.5 bg-white">
            <p class="font-semibold text-deep mb-1">60</p>
            <ul class="list-disc pl-4 space-y-0.5 text-text">
              <li v-for="(x, i) in report.roadmap.days60" :key="i">{{ x }}</li>
            </ul>
          </div>
          <div class="border border-gray-light rounded-radius p-2.5 bg-white">
            <p class="font-semibold text-deep mb-1">90</p>
            <ul class="list-disc pl-4 space-y-0.5 text-text">
              <li v-for="(x, i) in report.roadmap.days90" :key="i">{{ x }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <h4 class="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {{ t('admin.assessment.email_draft') }}
          </h4>
          <button
            type="button"
            class="text-xs font-semibold px-2.5 py-1 rounded-radius bg-deep text-white"
            @click="copyDraft"
          >
            {{ copyDone ? t('admin.assessment.copied') : t('admin.assessment.copy_draft') }}
          </button>
        </div>
        <pre
          class="text-[11px] whitespace-pre-wrap break-words border border-gray-light rounded-radius p-3 bg-white text-text max-h-56 overflow-auto"
          >{{ report.clientEmailDraft }}</pre
        >
      </div>
    </div>

    <div
      v-else-if="leadId"
      class="rounded-radius border border-dashed border-gray-light p-4 mb-5 text-sm"
    >
      <p class="text-text-muted mb-2">{{ t('admin.assessment.no_report') }}</p>
      <button
        type="button"
        class="text-xs font-semibold px-3 py-1.5 rounded-radius bg-deep text-white disabled:opacity-50"
        :disabled="regenerating"
        @click="regenerate"
      >
        {{ regenerating ? t('admin.assessment.regenerating') : t('admin.assessment.generate_report') }}
      </button>
      <p v-if="regenerateError" class="text-xs text-red-600 mt-2">{{ regenerateError }}</p>
    </div>

    <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
      {{ t('admin.assessment.technical_annex') }}
    </h3>

    <!-- Context screenshots (full PDP) -->
    <template v-if="contextShots.length">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
        {{ t('admin.assessment.screenshots_context') }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <a
          v-for="shot in contextShots"
          :key="shot.key"
          :href="shot.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-radius border border-gray-light overflow-hidden bg-surface/40 hover:border-blue/40 transition-colors"
        >
          <img
            :src="shot.url"
            :alt="screenshotLabel(shot)"
            class="w-full h-40 object-cover object-top bg-gray-light"
            loading="lazy"
          />
          <p class="text-xs font-semibold text-text px-2.5 py-2">
            {{ screenshotLabel(shot) }}
          </p>
        </a>
      </div>
    </template>

    <!-- Scores — PIM/DAM first -->
    <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
      {{ t('admin.assessment.scores') }}
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
      <div
        v-for="area in orderedAreas"
        :key="area.id"
        class="rounded-radius border p-3"
        :class="area.primary ? 'border-blue/40 bg-blue/5' : 'border-gray-light bg-white'"
      >
        <div class="flex justify-between items-center mb-1.5">
          <span class="text-xs font-semibold text-text">
            {{ area.label }}
            <span v-if="area.primary" class="text-blue font-normal">
              · {{ t('admin.assessment.core') }}
            </span>
          </span>
          <span class="font-heading text-base font-bold text-deep">{{ area.score }}</span>
        </div>
        <div class="h-1.5 bg-gray-light rounded-full overflow-hidden">
          <div
            class="h-full rounded-full bg-linear-to-r from-deep to-blue"
            :style="{ width: `${area.score}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Evidence -->
    <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
      {{ t('admin.assessment.evidence') }}
    </h3>
    <div class="rounded-radius border border-gray-light bg-surface/40 p-3 mb-5 text-sm space-y-2">
      <div>
        <span class="text-text-muted">Title:</span>
        <span class="text-text ml-1">{{ evidence.title || '—' }}</span>
      </div>
      <div>
        <span class="text-text-muted">Meta:</span>
        <span class="text-text ml-1">{{ evidence.metaDescription || '—' }}</span>
      </div>
      <div>
        <span class="text-text-muted">H1:</span>
        <span class="text-text ml-1">{{ evidence.h1 || '—' }}</span>
      </div>
      <div>
        <span class="text-text-muted">Canonical:</span>
        <span class="text-text ml-1 break-all">{{ evidence.canonical || '—' }}</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-light/80">
        <div>
          <span class="text-text-muted">JSON-LD Product</span>
          <div class="font-medium">{{ flag(evidence.hasJsonLdProduct) }}</div>
        </div>
        <div>
          <span class="text-text-muted">GTIN</span>
          <div class="font-medium">{{ flag(evidence.hasGtin) }}</div>
        </div>
        <div>
          <span class="text-text-muted">SKU</span>
          <div class="font-medium">{{ flag(evidence.hasSku) }}</div>
        </div>
        <div>
          <span class="text-text-muted">Brand</span>
          <div class="font-medium">{{ flag(evidence.hasBrand) }}</div>
        </div>
        <div>
          <span class="text-text-muted">{{ t('admin.assessment.images') }}</span>
          <div class="font-medium">
            {{ evidence.imageCount ?? 0 }}
            <span class="text-text-muted font-normal">
              (alt {{ evidence.imagesWithAlt ?? 0 }})
            </span>
          </div>
        </div>
        <div>
          <span class="text-text-muted">PDF / docs</span>
          <div class="font-medium">{{ flag(evidence.hasPdfLink) }}</div>
        </div>
        <div>
          <span class="text-text-muted">Video</span>
          <div class="font-medium">{{ flag(evidence.hasVideo) }}</div>
        </div>
        <div>
          <span class="text-text-muted">CTA / price</span>
          <div class="font-medium">
            {{ flag(evidence.hasBuyButton) }} / {{ flag(evidence.hasPrice) }}
          </div>
        </div>
        <div>
          <span class="text-text-muted">IVA / GPSR / CE</span>
          <div class="font-medium">
            {{ flag(evidence.hasIva) }} / {{ flag(evidence.hasGpsr) }} /
            {{ flag(evidence.hasCe) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Findings -->
    <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
      {{ t('admin.assessment.findings') }}
    </h3>
    <div class="space-y-3 mb-5">
      <div v-for="group in findingsByArea" :key="group.id">
        <p class="text-xs font-semibold text-text mb-1.5">{{ group.label }}</p>
        <ul class="space-y-1.5">
          <li
            v-for="(f, i) in group.items"
            :key="`${f.code}-${i}`"
            class="text-xs border rounded-radius px-2.5 py-2"
            :class="severityClass(f.severity)"
          >
            <span class="font-semibold uppercase tracking-wide">{{ f.severity }}</span>
            · {{ f.code }} — {{ f.message }}
          </li>
        </ul>
      </div>
      <p v-if="!findingsByArea.length" class="text-sm text-text-muted">
        {{ t('admin.assessment.no_findings') }}
      </p>
    </div>

    <!-- Questionnaire -->
    <template v-if="questionnaireRows.length">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
        {{ t('admin.assessment.questionnaire') }}
      </h3>
      <ul class="space-y-2">
        <li
          v-for="(row, i) in questionnaireRows"
          :key="i"
          class="text-sm border border-gray-light rounded-radius p-3"
        >
          <p class="text-[11px] font-semibold text-blue uppercase tracking-wide mb-1">
            {{ row.area }}
          </p>
          <p class="text-text-muted mb-1">{{ row.question }}</p>
          <p class="text-text font-medium">→ {{ row.answer }}</p>
        </li>
      </ul>
    </template>
  </section>
</template>
