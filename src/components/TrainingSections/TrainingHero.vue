<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section
    id="formacion-inicio"
    class="min-h-screen bg-deep relative overflow-hidden flex flex-col justify-center px-[5%] pt-[120px] pb-20"
  >
    <!-- Match Home `Hero.vue` atmosphere -->
    <div
      class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(60,157,255,0.18)_0%,transparent_65%),radial-gradient(ellipse_50%_80%_at_10%_80%,rgba(60,157,255,0.10)_0%,transparent_60%)]"
    />
    <div
      class="absolute inset-0 z-0 opacity-[0.07] bg-size-[60px_60px] bg-[linear-gradient(rgba(60,157,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(60,157,255,0.5)_1px,transparent_1px)]"
    />
    <div
      class="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[rgba(60,157,255,0.12)] z-[1]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[rgba(60,157,255,0.08)] z-[1]"
      aria-hidden="true"
    />

    <div class="relative z-10 max-w-[800px] w-full reveal">
      <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
        {{ t('train.hero.label') }}
      </p>
      <h1
        class="font-heading text-[1.75rem] sm:text-[2rem] md:text-[clamp(2rem,5vw,3rem)] font-extrabold text-white leading-[1.12] tracking-[-0.6px] mb-5 md:mb-6"
      >
        {{ t('train.hero.title') }}
      </h1>
      <p class="text-lg text-white/70 leading-[1.75] max-w-[640px] font-light">
        {{ t('train.hero.desc') }}
      </p>
      <a
        href="#programas-formacion"
        class="inline-flex items-center gap-2 mt-10 bg-blue text-white py-4 px-8 rounded-full font-semibold text-base no-underline transition-all duration-[0.25s] hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.4)]"
      >
        {{ t('train.hero.cta') }}
      </a>
    </div>
  </section>
</template>
