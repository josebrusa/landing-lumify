<script setup lang="ts">
import { computed } from 'vue'
import AppNav from '../components/layout/AppNav.vue'
import AssessmentStepSetup from '../components/AssessmentSections/AssessmentStepSetup.vue'
import AssessmentLoading from '../components/AssessmentSections/AssessmentLoading.vue'
import AssessmentResults from '../components/AssessmentSections/AssessmentResults.vue'
import AssessmentQuestions from '../components/AssessmentSections/AssessmentQuestions.vue'
import AssessmentEmailGate from '../components/AssessmentSections/AssessmentEmailGate.vue'
import AssessmentConfirm from '../components/AssessmentSections/AssessmentConfirm.vue'
import { useAssessmentFlow } from '../composables/useAssessmentFlow'
import { useI18n } from '../composables/useI18n'
import { AREA_DEFS } from '../data/assessmentContent'

const { t } = useI18n()
const {
  step,
  url,
  reviewType,
  selectedAreas,
  answers,
  email,
  scores,
  globalScore,
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
} = useAssessmentFlow()

const areasLabel = computed(() =>
  AREA_DEFS.filter((a) => selectedAreas.value.has(a.id))
    .map((a) => t(a.labelKey))
    .join(', '),
)

const dots = computed(() => {
  const max = showDetailedDots.value ? 4 : 2
  return Array.from({ length: max }, (_, i) => i + 1)
})
</script>

<template>
  <div class="min-h-screen bg-surface pt-[73px]">
    <AppNav />

    <div
      class="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-light"
    >
      <div class="max-w-[740px] mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <p class="font-heading font-extrabold text-[15px] text-deep">
          Lumify <span class="text-blue">Tech</span>
        </p>
        <span
          class="text-[11px] font-semibold tracking-[0.06em] px-2.5 py-1 rounded-full bg-blue/10 text-blue border border-blue/25"
        >
          {{ t('assess.badge') }}
        </span>
      </div>
      <div class="h-0.5 bg-gray-light" :aria-label="t('assess.progress')">
        <div
          class="h-full bg-linear-to-r from-deep to-blue transition-[width] duration-500 ease-out"
          :style="{ width: `${progressPct}%` }"
        />
      </div>
    </div>

    <main class="max-w-[740px] mx-auto px-5 pt-6 pb-16">
      <div class="flex items-center justify-center gap-1.5 mb-2">
        <template v-for="n in dots" :key="n">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-[1.5px] transition-all"
            :class="
              n < activeDot
                ? 'bg-blue border-blue text-white'
                : n === activeDot
                  ? 'border-blue bg-blue/15 text-deep'
                  : 'border-gray-light text-text-muted'
            "
          >
            {{ n }}
          </div>
          <div
            v-if="n < dots.length"
            class="w-8 h-0.5 rounded-full transition-colors"
            :class="n < activeDot ? 'bg-blue' : 'bg-gray-light'"
          />
        </template>
      </div>

      <AssessmentStepSetup
        v-if="step === 'setup'"
        :url="url"
        :review-type="reviewType"
        :selected-areas="selectedAreas"
        :setup-error="setupError"
        :setup-valid="setupValid"
        @update:url="url = $event"
        @select-type="selectType"
        @toggle-area="toggleArea"
        @start="start"
      />

      <AssessmentLoading
        v-else-if="step === 'loading'"
        :url="url"
        :loading-index="loadingIndex"
        :loading-done="loadingDone"
      />

      <AssessmentResults
        v-else-if="step === 'results'"
        :url="url"
        :global-score="globalScore"
        :scores="scores"
        :selected-areas="selectedAreaList"
        :findings="findings"
        @upgrade="switchToDetailed"
      />

      <AssessmentQuestions
        v-else-if="step === 'questions'"
        :selected-areas="selectedAreaList"
        :answers="answers"
        :questions-error="questionsError"
        @answer="setAnswer"
        @continue="goEmail"
      />

      <AssessmentEmailGate
        v-else-if="step === 'email'"
        :email="email"
        :email-valid="emailValid"
        :email-error="emailError"
        :submitting="submitting"
        @update:email="email = $event"
        @submit="submitDetailed"
      />

      <AssessmentConfirm
        v-else-if="step === 'confirm'"
        :url="url"
        :areas-label="areasLabel"
        :email="email"
      />
    </main>
  </div>
</template>
