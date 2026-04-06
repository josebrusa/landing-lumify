<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import {
  PhBookOpen,
  PhChartBar,
  PhFlowArrow,
  PhGear,
  PhGlobe,
  PhImage,
  PhPlugs,
  PhTreeStructure,
} from '@phosphor-icons/vue'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  program: 'a' | 'b'
}>()

const { t } = useI18n()

const syllabusIcons: Component[] = [
  PhBookOpen,
  PhTreeStructure,
  PhFlowArrow,
  PhGear,
  PhGlobe,
  PhImage,
  PhPlugs,
  PhChartBar,
]

const syllabusCardClass =
  'bg-white rounded-radius p-7 sm:p-8 border border-gray-light transition-all duration-300 relative overflow-hidden ' +
  'hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(10,61,98,0.12)] hover:border-transparent ' +
  "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] " +
  'before:bg-linear-to-r before:from-deep before:to-blue before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100'

const syllabusA: { titleKey: string; descKey: string }[] = [
  { titleKey: 'train.a.syl1t', descKey: 'train.a.syl1d' },
  { titleKey: 'train.a.syl2t', descKey: 'train.a.syl2d' },
  { titleKey: 'train.a.syl3t', descKey: 'train.a.syl3d' },
  { titleKey: 'train.a.syl4t', descKey: 'train.a.syl4d' },
  { titleKey: 'train.a.syl5t', descKey: 'train.a.syl5d' },
  { titleKey: 'train.a.syl6t', descKey: 'train.a.syl6d' },
  { titleKey: 'train.a.syl7t', descKey: 'train.a.syl7d' },
  { titleKey: 'train.a.syl8t', descKey: 'train.a.syl8d' },
]

const syllabusB: { titleKey: string; descKey: string }[] = [
  { titleKey: 'train.b.syl1t', descKey: 'train.b.syl1d' },
  { titleKey: 'train.b.syl2t', descKey: 'train.b.syl2d' },
  { titleKey: 'train.b.syl3t', descKey: 'train.b.syl3d' },
  { titleKey: 'train.b.syl4t', descKey: 'train.b.syl4d' },
  { titleKey: 'train.b.syl5t', descKey: 'train.b.syl5d' },
  { titleKey: 'train.b.syl6t', descKey: 'train.b.syl6d' },
]

const rows = computed(() => (props.program === 'a' ? syllabusA : syllabusB))

const gridClass = computed(() =>
  props.program === 'a'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6',
)
</script>

<template>
  <section id="temario-formacion" class="py-[72px] px-[5%] bg-white border-t border-gray-light/80">
    <div class="max-w-[1100px] mx-auto reveal">
      <div class="mb-10 md:mb-12">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('train.syl.label') }}</div>
        <h2
          class="font-heading text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.6px] mb-4"
        >
          {{ t('train.syl.title') }}
        </h2>
        <p class="text-base text-text-muted leading-[1.75] max-w-[680px]">
          {{ t('train.syl.lead') }}
        </p>
      </div>
      <div :class="gridClass">
        <article v-for="(row, idx) in rows" :key="row.titleKey" :class="syllabusCardClass">
          <div
            class="w-[52px] h-[52px] bg-linear-to-br from-deep to-blue rounded-[14px] flex items-center justify-center mb-4 text-white"
          >
            <component :is="syllabusIcons[idx] ?? PhBookOpen" :size="28" weight="regular" />
          </div>
          <p class="text-[0.7rem] font-bold text-gray-light tabular-nums mb-1">{{ String(idx + 1).padStart(2, '0') }}</p>
          <h3 class="text-[1.05rem] font-bold text-deep mb-2.5 leading-snug tracking-[-0.2px]">
            {{ t(row.titleKey) }}
          </h3>
          <p class="text-[0.88rem] text-text-muted leading-[1.6]">{{ t(row.descKey) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
