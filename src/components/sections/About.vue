<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const values = [
  { titleKey: 'ab.v1t', descKey: 'ab.v1d' },
  { titleKey: 'ab.v2t', descKey: 'ab.v2d' },
  { titleKey: 'ab.v3t', descKey: 'ab.v3d' },
  { titleKey: 'ab.v4t', descKey: 'ab.v4d' },
]
const bullets = ['ab.e1', 'ab.e2', 'ab.e3', 'ab.e4', 'ab.e5']
</script>

<template>
  <section id="nosaltres" class="bg-white py-[100px] px-[5%]">
    <div class="about-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center max-w-[1200px] mx-auto">
      <!-- Columna izquierda: about-visual -->
      <div class="about-visual reveal relative overflow-hidden rounded-[24px] p-10 md:p-12 bg-linear-to-br from-deep to-[#0d5a8e] before:content-[''] before:absolute before:top-[-40px] before:right-[-40px] before:w-[200px] before:h-[200px] before:rounded-full before:bg-[rgba(60,157,255,0.2)] after:content-[''] after:absolute after:bottom-[-20px] after:left-[-20px] after:w-[120px] after:h-[120px] after:rounded-full after:bg-[rgba(60,157,255,0.1)]">
        <div class="about-tag relative z-1 inline-flex items-center gap-2 bg-[rgba(60,157,255,0.2)] text-[#7cc4ff] py-1.5 px-3.5 rounded-full text-[0.78rem] font-semibold tracking-wide mb-5">
          Lumify
        </div>
        <h3 class="relative z-1 text-[1.7rem] font-extrabold text-white leading-[1.15] mb-4">
          {{ t('ab.title') }}
        </h3>
        <p class="relative z-1 text-[0.92rem] text-white/65 leading-[1.7]">
          {{ t('ab.desc') }}
        </p>
        <div class="about-values grid grid-cols-2 gap-4 mt-7 relative z-1 min-w-0">
          <div
            v-for="v in values"
            :key="v.titleKey"
            class="value-chip bg-white/8 border border-white/12 rounded-xl p-4 min-w-0 overflow-hidden"
          >
            <strong class="block text-[0.85rem] font-bold text-white mb-1">{{ t(v.titleKey) }}</strong>
            <span class="text-[0.78rem] text-white/45">{{ t(v.descKey) }}</span>
          </div>
        </div>
      </div>
      <!-- Columna derecha: about-text -->
      <div class="about-text reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('ab.label') }}</div>
        <h2 class="font-heading section-title text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-4">
          {{ t('ab.sttitle') }}
        </h2>
        <p class="section-desc text-base text-text-muted leading-[1.75] max-w-full">
          {{ t('ab.stDesc') }}
        </p>
        <ul class="expertise-list list-none mt-7 space-y-0">
          <li
            v-for="bk in bullets"
            :key="bk"
            class="flex items-center gap-3 py-3 border-b border-gray-light text-[0.95rem] text-text-muted last:border-b-0 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-blue before:shrink-0"
          >
            {{ t(bk) }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
