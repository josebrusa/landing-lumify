<script setup lang="ts">
import { PhCheckCircle } from '@phosphor-icons/vue'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  url: string
  areasLabel: string
  email: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="py-10 text-center">
    <PhCheckCircle :size="48" class="text-emerald-500 mx-auto mb-4" weight="fill" />
    <h1
      class="font-heading text-[clamp(1.4rem,3.5vw,2rem)] font-extrabold text-deep mb-2.5"
    >
      {{ t('assess.confirm.title') }}
    </h1>
    <p class="text-sm text-text-muted max-w-[44ch] mx-auto mb-6">
      {{ t('assess.confirm.desc') }}
    </p>

    <div
      class="bg-white border border-gray-light rounded-radius p-5 text-left max-w-md mx-auto"
    >
      <p
        class="text-[11px] font-semibold tracking-[0.07em] uppercase text-text-muted mb-3"
      >
        {{ t('assess.confirm.summary') }}
      </p>
      <div
        class="flex gap-2.5 py-2 border-b border-gray-light text-[13px] last:border-b-0"
      >
        <span class="text-text-muted min-w-[90px] shrink-0">{{
          t('assess.confirm.url')
        }}</span>
        <span class="text-deep font-medium break-all">https://{{ url }}</span>
      </div>
      <div
        class="flex gap-2.5 py-2 border-b border-gray-light text-[13px] last:border-b-0"
      >
        <span class="text-text-muted min-w-[90px] shrink-0">{{
          t('assess.confirm.areas')
        }}</span>
        <span class="text-deep font-medium">{{ areasLabel }}</span>
      </div>
      <div class="flex gap-2.5 py-2 text-[13px]">
        <span class="text-text-muted min-w-[90px] shrink-0">{{
          t('assess.confirm.email')
        }}</span>
        <span class="text-deep font-medium break-all">{{ email }}</span>
      </div>
    </div>

    <p class="text-[13px] text-text-muted/70 mt-4">
      {{ t('assess.confirm.help') }}
      <a href="mailto:info@lumify.es" class="text-blue hover:underline">info@lumify.es</a>
    </p>
  </div>
</template>
