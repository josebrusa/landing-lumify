<script setup lang="ts">
import {
  PhChartBar,
  PhGearSix,
  PhImage,
  PhMagnifyingGlass,
  PhScales,
  PhShoppingCart,
} from '@phosphor-icons/vue'
import { computed } from 'vue'
import {
  AREA_DEFS,
  CONTEXT_QUESTIONS,
  QUESTION_DB,
  loc,
  type AssessmentAreaId,
} from '../../data/assessmentContent'
import { useI18n } from '../../composables/useI18n'
import type { Lang } from '../../data/translations'

const props = defineProps<{
  selectedAreas: AssessmentAreaId[]
  answers: Record<string, number>
  questionsError: boolean
}>()

const emit = defineEmits<{
  answer: [area: AssessmentAreaId | 'context', qi: number, oi: number]
  continue: []
}>()

const { t, locale } = useI18n()

const areaIcons = {
  pim: PhChartBar,
  dam: PhImage,
  seo: PhMagnifyingGlass,
  ux: PhShoppingCart,
  compliance: PhScales,
} as const

const sections = computed(() =>
  AREA_DEFS.filter((a) => props.selectedAreas.includes(a.id)).map((a) => ({
    ...a,
    qs: QUESTION_DB[a.id],
  })),
)

function lang(): Lang {
  return locale.value
}

function isSelected(area: AssessmentAreaId | 'context', qi: number, oi: number) {
  return props.answers[`${area}-${qi}`] === oi
}
</script>

<template>
  <div class="pt-8 pb-4 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.q.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.5rem,4vw,2.3rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-3"
    >
      {{ t('assess.q.title') }}
    </h1>
    <p class="text-base text-text-muted leading-[1.75] max-w-[52ch] mx-auto">
      {{ t('assess.q.desc') }}
    </p>
  </div>

  <div class="space-y-7 mt-2">
    <section>
      <div
        class="flex items-center gap-2.5 font-heading font-bold text-[15px] text-deep mb-3.5 pb-2.5 border-b border-gray-light"
      >
        <span
          class="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-blue/15 text-blue"
        >
          <PhGearSix :size="15" weight="regular" />
        </span>
        {{ t('assess.q.context') }}
      </div>

      <div v-for="(q, qi) in CONTEXT_QUESTIONS" :key="`context-${qi}`" class="mb-4">
        <p class="text-sm font-medium text-deep mb-2 leading-[1.4]">
          {{ loc(q.text, lang()) }}
        </p>
        <div class="flex flex-col gap-1.5">
          <button
            v-for="(opt, oi) in q.opts"
            :key="oi"
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-radius-sm bg-white border-[1.5px] text-left text-[13px] text-deep transition-all cursor-pointer"
            :class="
              isSelected('context', qi, oi)
                ? 'border-blue bg-blue/10'
                : 'border-gray-light hover:border-blue/40'
            "
            @click="emit('answer', 'context', qi, oi)"
          >
            <span
              class="w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0"
              :class="isSelected('context', qi, oi) ? 'border-blue bg-blue' : 'border-gray-light'"
            />
            {{ loc(opt, lang()) }}
          </button>
        </div>
      </div>
    </section>

    <section v-for="sec in sections" :key="sec.id">
      <div
        class="flex items-center gap-2.5 font-heading font-bold text-[15px] text-deep mb-3.5 pb-2.5 border-b border-gray-light"
      >
        <span
          class="w-[30px] h-[30px] rounded-lg flex items-center justify-center bg-blue/15 text-blue"
        >
          <component :is="areaIcons[sec.id]" :size="15" weight="regular" />
        </span>
        {{ t(sec.labelKey) }}
      </div>

      <div v-for="(q, qi) in sec.qs" :key="qi" class="mb-4">
        <p class="text-sm font-medium text-deep mb-2 leading-[1.4]">
          {{ loc(q.text, lang()) }}
        </p>
        <div class="flex flex-col gap-1.5">
          <button
            v-for="(opt, oi) in q.opts"
            :key="oi"
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-radius-sm bg-white border-[1.5px] text-left text-[13px] text-deep transition-all cursor-pointer"
            :class="
              isSelected(sec.id, qi, oi)
                ? 'border-blue bg-blue/10'
                : 'border-gray-light hover:border-blue/40'
            "
            @click="emit('answer', sec.id, qi, oi)"
          >
            <span
              class="w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0"
              :class="isSelected(sec.id, qi, oi) ? 'border-blue bg-blue' : 'border-gray-light'"
            />
            {{ loc(opt, lang()) }}
          </button>
        </div>
      </div>
    </section>
  </div>

  <p v-if="questionsError" class="text-sm text-red-600 mt-4 text-center">
    {{ t('assess.q.error') }}
  </p>

  <div class="mt-8 flex justify-center">
    <button
      type="button"
      class="min-h-[48px] px-8 rounded-radius bg-deep text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      @click="emit('continue')"
    >
      {{ t('assess.q.cta') }}
    </button>
  </div>
</template>
