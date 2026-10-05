<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { PhCheck, PhWarning } from '@phosphor-icons/vue'
import {
  AREA_DEFS,
  maturityBadgeKey,
  maturityLevel,
  maturityTitleKey,
  type AssessmentAreaId,
  type Finding,
} from '../../data/assessmentContent'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  url: string
  globalScore: number
  scores: Partial<Record<AssessmentAreaId, number>>
  selectedAreas: AssessmentAreaId[]
  findings: Finding[]
}>()

const emit = defineEmits<{ upgrade: [] }>()

const { t } = useI18n()

const CIRC = 295.3
const displayScore = ref(0)
const ringOffset = ref(CIRC)
const barsReady = ref(false)

const level = computed(() => maturityLevel(props.globalScore))
const titleKey = computed(() => maturityTitleKey(props.globalScore))
const badgeKey = computed(() => maturityBadgeKey(props.globalScore))

const areaCards = computed(() =>
  AREA_DEFS.filter((a) => props.selectedAreas.includes(a.id)).map((a) => ({
    ...a,
    score: props.scores[a.id] ?? 0,
  })),
)

const badgeClass = computed(() => {
  if (level.value === 'high') return 'bg-emerald-50 text-emerald-700'
  if (level.value === 'mid') return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
})

function findingDotClass(type: Finding['type']) {
  if (type === 'ok') return 'bg-emerald-50 text-emerald-600'
  if (type === 'risk') return 'bg-amber-50 text-amber-600'
  return 'bg-red-50 text-red-600'
}

function animateScore() {
  displayScore.value = 0
  ringOffset.value = CIRC
  barsReady.value = false
  window.setTimeout(() => {
    ringOffset.value = CIRC - (props.globalScore / 100) * CIRC
    const iv = window.setInterval(() => {
      displayScore.value = Math.min(displayScore.value + 2, props.globalScore)
      if (displayScore.value >= props.globalScore) window.clearInterval(iv)
    }, 18)
    barsReady.value = true
  }, 200)
}

onMounted(animateScore)
watch(() => props.globalScore, animateScore)
</script>

<template>
  <div class="pt-6 pb-2 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.results.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.4rem,3.5vw,2rem)] font-extrabold text-deep leading-[1.15] tracking-[-0.6px] mb-2"
    >
      {{ t(titleKey) }}
    </h1>
    <p class="text-sm text-text-muted mb-2">
      {{ t('assess.results.of') }}
      <strong class="text-blue font-semibold">https://{{ url }}</strong>
    </p>
  </div>

  <div class="flex flex-col items-center py-6">
    <div class="relative w-[110px] h-[110px]">
      <svg viewBox="0 0 110 110" width="110" height="110" class="-rotate-90">
        <circle cx="55" cy="55" r="47" fill="none" stroke-width="8" class="stroke-gray-light" />
        <circle
          cx="55"
          cy="55"
          r="47"
          fill="none"
          stroke-width="8"
          stroke-linecap="round"
          class="stroke-blue transition-[stroke-dashoffset] duration-[1500ms] ease-out"
          :stroke-dasharray="CIRC"
          :stroke-dashoffset="ringOffset"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="font-heading text-[30px] font-extrabold text-deep leading-none">
          {{ displayScore }}
        </div>
        <div class="text-[11px] text-text-muted">/100</div>
      </div>
    </div>
    <div class="mt-2.5 text-sm font-semibold px-3.5 py-1 rounded-full" :class="badgeClass">
      {{ t(badgeKey) }}
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
    <div
      v-for="card in areaCards"
      :key="card.id"
      class="bg-white border border-gray-light rounded-radius p-3.5"
    >
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-semibold text-text-muted">{{ t(card.labelKey) }}</span>
        <span class="font-heading text-lg font-bold text-blue">{{ card.score }}</span>
      </div>
      <div class="h-[3px] bg-gray-light rounded-full overflow-hidden">
        <div
          class="h-full rounded-full bg-linear-to-r from-deep to-blue transition-[width] duration-[1200ms] ease-out"
          :style="{ width: barsReady ? `${card.score}%` : '0%' }"
        />
      </div>
    </div>
  </div>

  <p class="text-xs font-semibold tracking-[0.07em] uppercase text-text-muted mt-4 mb-2.5">
    {{ t('assess.results.findings') }}
  </p>
  <div class="space-y-2 mb-5">
    <div
      v-for="(f, i) in findings"
      :key="i"
      class="flex gap-2.5 p-3 bg-white border border-gray-light rounded-radius"
    >
      <span
        class="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
        :class="findingDotClass(f.type)"
      >
        <PhCheck v-if="f.type === 'ok'" :size="10" weight="bold" />
        <PhWarning v-else :size="10" weight="bold" />
      </span>
      <p class="text-[13px] text-text-muted leading-[1.5]">
        {{ t(f.key, f.params) }}
      </p>
    </div>
  </div>

  <div
    class="bg-blue/5 border-[1.5px] border-dashed border-blue/30 rounded-radius p-5 text-center mb-4"
  >
    <h3 class="font-heading text-base font-bold text-deep mb-2">
      {{ t('assess.results.upgrade_title') }}
    </h3>
    <p class="text-[13px] text-text-muted mb-4">{{ t('assess.results.upgrade_desc') }}</p>
    <button
      type="button"
      class="inline-flex items-center justify-center py-2.5 px-5 rounded-full bg-blue text-white text-sm font-semibold transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5"
      @click="emit('upgrade')"
    >
      {{ t('assess.results.upgrade_cta') }}
    </button>
  </div>
</template>
