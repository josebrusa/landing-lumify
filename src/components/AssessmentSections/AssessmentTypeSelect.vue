<script setup lang="ts">
import { PhCheck, PhLightning, PhListChecks } from '@phosphor-icons/vue'
import type { ReviewType } from '../../data/assessmentContent'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  reviewType: ReviewType | ''
  typeError: boolean
  analyzeError: string | null
}>()

const emit = defineEmits<{
  selectType: [type: ReviewType]
  start: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="pt-8 pb-4 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.type.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.5rem,4vw,2.3rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-3"
    >
      {{ t('assess.type.title') }}
    </h1>
    <p class="text-base text-text-muted leading-[1.75] max-w-[52ch] mx-auto">
      {{ t('assess.type.desc') }}
    </p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 mt-6">
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
        class="absolute top-3 right-3 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center"
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
        :class="reviewType === 'instant' ? 'bg-blue/15 text-blue' : 'bg-surface text-text-muted'"
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
        class="absolute top-3 right-3 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center"
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

  <p
    v-if="typeError"
    class="mb-3 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{ t('assess.type.error') }}
  </p>
  <p
    v-if="analyzeError"
    class="mb-3 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{ analyzeError }}
  </p>

  <button
    type="button"
    class="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue text-white font-semibold text-sm transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 disabled:opacity-45"
    :disabled="!reviewType"
    @click="emit('start')"
  >
    {{ t('assess.setup.cta') }}
  </button>
</template>
