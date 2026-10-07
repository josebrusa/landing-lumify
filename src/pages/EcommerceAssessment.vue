<script setup lang="ts">
import { computed } from 'vue'
import AppNav from '../components/layout/AppNav.vue'
import AssessmentStepSetup from '../components/AssessmentSections/AssessmentStepSetup.vue'
import AssessmentTypeSelect from '../components/AssessmentSections/AssessmentTypeSelect.vue'
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
  name,
  company,
  phone,
  gdprConsent,
  honeypot,
  scores,
  globalScore,
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
  urlAreasValid,
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
} = useAssessmentFlow()

const areasLabel = computed(() =>
  AREA_DEFS.filter((a) => selectedAreas.value.has(a.id))
    .map((a) => t(a.labelKey))
    .join(', '),
)

const dots = computed(() => {
  const max = showDetailedDots.value ? 3 : 2
  return Array.from({ length: max }, (_, i) => i + 1)
})

const displayUrl = computed(() => analyzedUrl.value || url.value)
</script>

<template>
  <div class="min-h-screen bg-surface pt-[90px]">
    <AppNav />

    <div
      class="sticky top-[90px] z-40 bg-surface/95 backdrop-blur-md border-b border-gray-light"
    >
      <div class="h-0.5 bg-gray-light" :aria-label="t('assess.progress')">
        <div
          class="h-full bg-linear-to-r from-deep to-blue transition-[width] duration-500 ease-out"
          :style="{ width: `${progressPct}%` }"
        />
      </div>
      <div
        v-if="step !== 'confirm'"
        class="flex items-center justify-center gap-1.5 py-3 px-[5%]"
        role="list"
        :aria-label="t('assess.progress')"
      >
        <template v-for="n in dots" :key="n">
          <div
            role="listitem"
            class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-[1.5px] transition-all"
            :class="
              n < activeDot
                ? 'bg-blue border-blue text-white'
                : n === activeDot
                  ? 'border-blue bg-blue/15 text-deep'
                  : 'border-gray-light text-text-muted'
            "
            :aria-current="n === activeDot ? 'step' : undefined"
          >
            {{ n }}
          </div>
          <div
            v-if="n < dots.length"
            class="w-8 h-0.5 rounded-full transition-colors"
            :class="n < activeDot ? 'bg-blue' : 'bg-gray-light'"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>

    <main class="max-w-[740px] mx-auto px-[5%] pt-4 pb-16">
      <AssessmentStepSetup
        v-if="step === 'urlAreas'"
        :url="url"
        :selected-areas="selectedAreas"
        :setup-error="setupError"
        :url-areas-valid="urlAreasValid"
        @update:url="url = $event"
        @toggle-area="toggleArea"
        @continue="continueFromUrlAreas"
      />

      <AssessmentTypeSelect
        v-else-if="step === 'type'"
        :review-type="reviewType"
        :type-error="typeError"
        :analyze-error="analyzeError"
        @select-type="selectType"
        @start="startFromType"
      />

      <AssessmentLoading
        v-else-if="step === 'loading'"
        :url="url"
        :loading-index="loadingIndex"
        :loading-done="loadingDone"
      />

      <AssessmentResults
        v-else-if="step === 'results'"
        :url="displayUrl"
        :global-score="globalScore"
        :scores="scores"
        :selected-areas="selectedAreaList"
        :findings="findings"
        @unlock="goEmailFromResults"
        @upgrade="switchToDetailed"
      />

      <AssessmentQuestions
        v-else-if="step === 'questions'"
        :selected-areas="selectedAreaList"
        :answers="answers"
        :questions-error="questionsError"
        @answer="setAnswer"
        @continue="goEmailFromQuestions"
      />

      <AssessmentEmailGate
        v-else-if="step === 'email'"
        :review-type="reviewType"
        :email="email"
        :name="name"
        :company="company"
        :phone="phone"
        :gdpr-consent="gdprConsent"
        :honeypot="honeypot"
        :contact-valid="contactValid"
        :email-error="emailError"
        :submit-error="submitError"
        :submitting="submitting"
        @update:email="email = $event"
        @update:name="name = $event"
        @update:company="company = $event"
        @update:phone="phone = $event"
        @update:gdpr-consent="gdprConsent = $event"
        @update:honeypot="honeypot = $event"
        @submit="submitContact"
      />

      <AssessmentConfirm
        v-else-if="step === 'confirm'"
        :url="displayUrl"
        :areas-label="areasLabel"
        :email="email"
      />
    </main>
  </div>
</template>
