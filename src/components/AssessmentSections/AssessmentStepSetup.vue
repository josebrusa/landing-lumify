<script setup lang="ts">
import {
  PhChartBar,
  PhCheck,
  PhImage,
  PhLightning,
  PhListChecks,
  PhMagnifyingGlass,
  PhScales,
  PhShoppingCart,
} from '@phosphor-icons/vue'
import { AREA_DEFS, type AssessmentAreaId, type ReviewType } from '../../data/assessmentContent'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  url: string
  reviewType: ReviewType | ''
  selectedAreas: Set<AssessmentAreaId>
  setupError: boolean
  setupValid: boolean
}>()

const emit = defineEmits<{
  'update:url': [value: string]
  selectType: [type: ReviewType]
  toggleArea: [id: AssessmentAreaId]
  start: []
}>()

const { t } = useI18n()

const areaIcons = {
  pim: PhChartBar,
  dam: PhImage,
  seo: PhMagnifyingGlass,
  ux: PhShoppingCart,
  compliance: PhScales,
} as const

function isSelected(id: AssessmentAreaId) {
  return props.selectedAreas.has(id)
}
</script>

<template>
  <div class="pt-8 pb-4 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.setup.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.5rem,4vw,2.3rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-3"
    >
      {{ t('assess.setup.title') }}
    </h1>
    <p class="text-base text-text-muted leading-[1.75] max-w-[52ch] mx-auto">
      {{ t('assess.setup.desc') }}
    </p>
  </div>

  <div class="relative mt-6 mb-5">
    <span
      class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted pointer-events-none"
    >
      https://
    </span>
    <input
      :value="url"
      type="text"
      autocomplete="off"
      :placeholder="t('assess.setup.url_ph')"
      class="w-full min-h-[52px] pl-20 pr-4 py-3.5 bg-white border-[1.5px] border-gray-light rounded-radius text-[0.95rem] text-deep outline-none transition-[border-color] focus:border-blue placeholder:text-text-muted/40"
      @input="emit('update:url', ($event.target as HTMLInputElement).value)"
    />
  </div>

  <span
    class="block text-xs font-semibold tracking-[0.07em] uppercase text-text-muted mb-2.5"
  >
    {{ t('assess.setup.type_label') }}
  </span>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
    <button
      type="button"
      class="relative text-left bg-white border-[1.5px] rounded-radius p-4 transition-all cursor-pointer"
      :class="
        reviewType === 'instant'
          ? 'border-blue bg-blue/10'
          : 'border-gray-light hover:border-blue/40'
      "
      @click="emit('selectType', 'instant')"
    >
      <span
        class="absolute top-3 right-3 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px]"
        :class="
          reviewType === 'instant'
            ? 'bg-blue border-blue text-white'
            : 'border-gray-light text-transparent'
        "
      >
        <PhCheck v-if="reviewType === 'instant'" :size="10" weight="bold" />
      </span>
      <div class="flex items-center gap-2 mb-1.5">
        <PhLightning :size="18" class="text-blue" weight="fill" />
        <span class="font-heading font-bold text-sm text-deep">{{
          t('assess.setup.instant_name')
        }}</span>
      </div>
      <p class="text-xs text-text-muted leading-[1.4] pr-5">
        {{ t('assess.setup.instant_desc') }}
      </p>
      <span
        class="inline-block mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full"
        :class="
          reviewType === 'instant' ? 'bg-blue/15 text-blue' : 'bg-surface text-text-muted'
        "
      >
        {{ t('assess.setup.instant_pill') }}
      </span>
    </button>

    <button
      type="button"
      class="relative text-left bg-white border-[1.5px] rounded-radius p-4 transition-all cursor-pointer"
      :class="
        reviewType === 'detailed'
          ? 'border-blue bg-blue/10'
          : 'border-gray-light hover:border-blue/40'
      "
      @click="emit('selectType', 'detailed')"
    >
      <span
        class="absolute top-3 right-3 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px]"
        :class="
          reviewType === 'detailed'
            ? 'bg-blue border-blue text-white'
            : 'border-gray-light text-transparent'
        "
      >
        <PhCheck v-if="reviewType === 'detailed'" :size="10" weight="bold" />
      </span>
      <div class="flex items-center gap-2 mb-1.5">
        <PhListChecks :size="18" class="text-blue" weight="fill" />
        <span class="font-heading font-bold text-sm text-deep">{{
          t('assess.setup.detailed_name')
        }}</span>
      </div>
      <p class="text-xs text-text-muted leading-[1.4] pr-5">
        {{ t('assess.setup.detailed_desc') }}
      </p>
      <span
        class="inline-block mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full"
        :class="
          reviewType === 'detailed' ? 'bg-blue/15 text-blue' : 'bg-surface text-text-muted'
        "
      >
        {{ t('assess.setup.detailed_pill') }}
      </span>
    </button>
  </div>

  <span
    class="block text-xs font-semibold tracking-[0.07em] uppercase text-text-muted mb-2.5"
  >
    {{ t('assess.setup.areas_label') }}
  </span>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
    <button
      v-for="area in AREA_DEFS"
      :key="area.id"
      type="button"
      class="relative text-left bg-white border-[1.5px] rounded-radius p-4 transition-all cursor-pointer"
      :class="[
        area.highlight ? 'sm:col-span-2' : '',
        isSelected(area.id)
          ? 'border-blue bg-blue/10'
          : 'border-gray-light hover:border-blue/40',
      ]"
      @click="emit('toggleArea', area.id)"
    >
      <span
        v-if="area.highlight"
        class="absolute top-3 left-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue/15 text-blue border border-blue/30"
      >
        {{ t('assess.area.compliance.new') }}
      </span>
      <span
        class="absolute top-3 right-3 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center"
        :class="
          isSelected(area.id)
            ? 'bg-blue border-blue text-white'
            : 'border-gray-light text-transparent'
        "
      >
        <PhCheck v-if="isSelected(area.id)" :size="10" weight="bold" />
      </span>
      <div
        class="w-8 h-8 rounded-[9px] flex items-center justify-center mb-2 text-deep"
        :class="isSelected(area.id) ? 'bg-blue/20 text-blue' : 'bg-surface'"
      >
        <component :is="areaIcons[area.id]" :size="16" weight="regular" />
      </div>
      <div
        class="font-heading font-bold text-[13px] text-deep mb-1"
        :class="area.highlight ? 'mt-4' : ''"
      >
        {{ t(area.labelKey) }}
      </div>
      <p class="text-[11px] text-text-muted leading-[1.4] pr-5">{{ t(area.subKey) }}</p>
    </button>
  </div>

  <p
    v-if="setupError"
    class="mb-3 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{ t('assess.setup.error') }}
  </p>

  <button
    type="button"
    class="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue text-white font-semibold text-sm transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.35)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    :disabled="!setupValid"
    @click="emit('start')"
  >
    {{ t('assess.setup.cta') }}
  </button>
</template>
