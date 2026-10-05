<script setup lang="ts">
import { PhCheck } from '@phosphor-icons/vue'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  url: string
  loadingIndex: number
  loadingDone: Set<number>
}>()

const { t } = useI18n()

const steps = [
  'assess.loading.s1',
  'assess.loading.s2',
  'assess.loading.s3',
  'assess.loading.s4',
  'assess.loading.s5',
] as const
</script>

<template>
  <div class="py-14 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.loading.label') }}
    </p>
    <p class="text-sm text-text-muted font-mono mb-7">
      https://<span class="text-blue">{{ url }}</span>
    </p>
    <div class="flex flex-col gap-2.5 max-w-[340px] mx-auto">
      <div
        v-for="(key, idx) in steps"
        :key="key"
        class="flex items-center gap-3 bg-white border border-gray-light rounded-radius px-4 py-3 text-sm text-deep transition-opacity"
        :class="
          loadingDone.has(idx) || loadingIndex === idx ? 'opacity-100' : 'opacity-25'
        "
      >
        <span
          v-if="loadingDone.has(idx)"
          class="w-[15px] h-[15px] rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"
        >
          <PhCheck :size="10" weight="bold" />
        </span>
        <span
          v-else
          class="w-[15px] h-[15px] rounded-full border-2 border-gray-light border-t-blue animate-spin shrink-0"
          :class="loadingIndex === idx ? 'opacity-100' : 'opacity-40'"
        />
        <span :class="loadingDone.has(idx) ? 'text-text-muted' : ''">{{ t(key) }}</span>
      </div>
    </div>
  </div>
</template>
