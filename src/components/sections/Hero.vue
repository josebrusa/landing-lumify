<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'

const { t } = useI18n()
const { openPricingModal } = useModals()
</script>

<template>
  <section
    id="inicio"
    class="min-h-screen bg-deep relative overflow-hidden flex flex-col justify-center px-[5%] pt-[120px] pb-20 gap-10 md:flex-row md:items-center md:justify-between md:gap-12"
  >
    <div
      class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(60,157,255,0.18)_0%,transparent_65%),radial-gradient(ellipse_50%_80%_at_10%_80%,rgba(60,157,255,0.10)_0%,transparent_60%)]"
    />
    <div
      class="absolute inset-0 z-0 opacity-[0.07] bg-size-[60px_60px] bg-[linear-gradient(rgba(60,157,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(60,157,255,0.5)_1px,transparent_1px)]"
    />
    <div class="relative z-10 max-w-[700px] w-full md:w-auto md:max-w-[700px]">
      <div
        class="inline-flex items-center gap-2 bg-blue/15 border border-blue/35 text-blue py-1.5 px-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-7 animate-[fadeUp_0.8s_ease_both]"
      >
        <span class="w-1.5 h-1.5 bg-blue rounded-full animate-[pulse_2s_infinite]" />
        {{ t('hero.eyebrow') }}
      </div>
      <h1
        class="font-heading text-[1.75rem] leading-tight sm:text-[2.25rem] md:text-[clamp(2.6rem,6vw,4.2rem)] md:leading-[1.08] font-extrabold text-white tracking-[-0.5px] md:tracking-[-1.5px] mb-6 animate-[fadeUp_0.8s_0.1s_ease_both] wrap-break-word [&_em]:text-white [&_em]:font-extrabold"
        v-html="t('hero.title')"
      />
      <p
        class="text-lg text-white/70 leading-[1.7] max-w-[560px] mb-11 font-light animate-[fadeUp_0.8s_0.2s_ease_both]"
      >
        {{ t('hero.desc') }}
      </p>
      <div class="flex gap-4 flex-wrap animate-[fadeUp_0.8s_0.3s_ease_both]">
        <a
          href="#servicios"
          class="inline-flex items-center gap-2.5 bg-blue text-white py-4 px-8 rounded-full font-semibold text-base no-underline transition-all duration-[0.25s] hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.4)]"
        >
          {{ t('hero.cta1') }}
        </a>
        <button
          type="button"
          class="inline-flex items-center gap-2.5 border border-white/30 text-white py-4 px-8 rounded-full font-medium text-base transition-all duration-[0.25s] cursor-pointer font-sans hover:border-blue hover:text-blue hover:-translate-y-0.5"
          @click="openPricingModal()"
        >
          {{ t('hero.cta2') }}
        </button>
      </div>
    </div>
    <div
      class="relative z-10 w-full flex flex-wrap justify-start gap-6 sm:gap-8 md:mt-0 md:w-auto md:shrink-0 md:gap-7 animate-[fadeUp_0.8s_0.4s_ease_both]"
    >
      <div class="text-center">
        <div class="font-heading text-[2.2rem] font-extrabold text-white leading-none">
          +6<span class="text-blue">y</span>
        </div>
        <div class="text-xs text-white/50 mt-1 tracking-wider uppercase">{{ t('hero.stat1') }}</div>
      </div>
      <div class="text-center">
        <div class="font-heading text-[2.2rem] font-extrabold text-white leading-none">
          4<span class="text-blue">+</span>
        </div>
        <div class="text-xs text-white/50 mt-1 tracking-wider uppercase">{{ t('hero.stat2') }}</div>
      </div>
      <div class="text-center">
        <div class="font-heading text-[2.2rem] font-extrabold text-white leading-none">
          360<span class="text-blue">°</span>
        </div>
        <div class="text-xs text-white/50 mt-1 tracking-wider uppercase">{{ t('hero.stat3') }}</div>
      </div>
    </div>
  </section>
</template>
