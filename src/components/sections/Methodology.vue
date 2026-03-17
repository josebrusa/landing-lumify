<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const steps = [
  { num: 1, titleKey: 'm1.title', descKey: 'm1.desc' },
  { num: 2, titleKey: 'm2.title', descKey: 'm2.desc' },
  { num: 3, titleKey: 'm3.title', descKey: 'm3.desc' },
  { num: 4, titleKey: 'm4.title', descKey: 'm4.desc' },
  { num: 5, titleKey: 'm5.title', descKey: 'm5.desc' },
]
</script>

<template>
  <section id="metodologia" class="py-[100px] px-[5%] bg-surface">
    <div class="mb-16 reveal">
      <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('met.label') }}</div>
      <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px]">
        {{ t('met.title') }}
      </h2>
      <p class="text-base text-text-muted leading-[1.75] max-w-[560px] mt-4">
        {{ t('met.desc') }}
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0.5 bg-gray-light rounded-radius overflow-hidden reveal">
      <div
        v-for="s in steps"
        :key="s.num"
        class="bg-white p-9 py-8 transition-colors hover:bg-surface group"
      >
        <div class="font-heading text-[3rem] font-extrabold text-gray-light leading-none mb-4 transition-colors group-hover:text-blue/20">
          {{ String(s.num).padStart(2, '0') }}
        </div>
        <h4 class="text-[1.05rem] font-bold text-deep mb-2.5">{{ t(s.titleKey) }}</h4>
        <p class="text-[0.88rem] text-text-muted leading-[1.6]">{{ t(s.descKey) }}</p>
      </div>
    </div>
  </section>
</template>
