<script setup lang="ts">
import { computed } from 'vue'
import {
  AREA_DEFS,
  QUESTION_DB,
  loc,
  type AssessmentAreaId,
} from '@/data/assessmentContent'
import { useI18n } from '@/composables/useI18n'
import { useLocaleStore } from '@/stores/locale'
import type { LeadAssessmentAnalysis } from '@/types/api'

const props = defineProps<{
  analysis: LeadAssessmentAnalysis
}>()

const { t } = useI18n()
const localeStore = useLocaleStore()

const AREA_ORDER: AssessmentAreaId[] = ['pim', 'dam', 'seo', 'ux', 'compliance']

const evidence = computed(() => props.analysis.evidence)

const screenshotItems = computed(() => props.analysis.screenshots ?? [])

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
  return 'text-emerald-700 bg-emerald-50 border-emerald-100'
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

    <!-- Screenshots -->
    <template v-if="screenshotItems.length">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
        {{ t('admin.assessment.screenshots') }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <a
          v-for="shot in screenshotItems"
          :key="shot.key"
          :href="shot.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-radius border border-gray-light overflow-hidden bg-surface/40 hover:border-blue/40 transition-colors"
        >
          <img
            :src="shot.url"
            :alt="shot.label"
            class="w-full h-40 object-cover object-top bg-gray-light"
            loading="lazy"
          />
          <p class="text-xs font-semibold text-text px-2.5 py-2 capitalize">
            {{
              shot.label === 'mobile'
                ? t('admin.assessment.screenshot_mobile')
                : t('admin.assessment.screenshot_desktop')
            }}
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
