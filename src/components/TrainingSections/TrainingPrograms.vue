<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

type ProgramId = 'a' | 'b'
type BandId = 1 | 2 | 3

const program = defineModel<ProgramId>('program', { default: 'a' })
const band = ref<BandId>(1)

watch(program, () => {
  band.value = 1
})

const audienceA = ['train.a.aud1', 'train.a.aud2', 'train.a.aud3', 'train.a.aud4', 'train.a.aud5'] as const
const audienceB = ['train.b.aud1', 'train.b.aud2', 'train.b.aud3', 'train.b.aud4', 'train.b.aud5'] as const

const delA = ['train.a.del1', 'train.a.del2', 'train.a.del3', 'train.a.del4', 'train.a.del5'] as const
const delB = ['train.b.del1', 'train.b.del2', 'train.b.del3', 'train.b.del4', 'train.b.del5'] as const

function selectProgram(id: ProgramId) {
  program.value = id
}

function selectBand(id: BandId) {
  band.value = id
}

function cardPickClass(active: boolean) {
  return [
    'rounded-radius border-2 p-6 md:p-7 text-left cursor-pointer transition-all',
    active ? 'border-blue bg-blue/[0.06] shadow-[0_8px_30px_rgba(60,157,255,0.12)]' : 'border-gray-light/80 bg-white hover:border-blue/30',
  ]
}

function bandClass(selected: boolean) {
  return [
    'rounded-radius border-2 p-5 text-left cursor-pointer transition-all w-full',
    selected
      ? 'border-blue bg-blue/[0.08] ring-2 ring-blue/25 shadow-[0_8px_24px_rgba(31,42,55,0.08)]'
      : 'border-gray-light/80 bg-white hover:border-blue/35',
  ]
}
</script>

<template>
  <section id="programas-formacion" class="py-[72px] px-[5%] bg-surface">
    <div class="max-w-[1100px] mx-auto">
      <!-- Intro -->
      <div class="mb-10 md:mb-12 reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('train.pick.label') }}</div>
        <h2
          class="font-heading text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.6px] mb-4"
        >
          {{ t('train.pick.title') }}
        </h2>
        <p class="text-base text-text-muted leading-[1.75] max-w-[720px]">
          {{ t('train.pick.lead') }}
        </p>
      </div>

      <!-- Two choice cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 reveal">
        <button type="button" :class="cardPickClass(program === 'a')" @click="selectProgram('a')">
          <span class="text-xs font-bold tracking-[2px] uppercase text-blue block mb-2">{{ t('train.tab.premium') }}</span>
          <p class="text-sm text-text-muted leading-relaxed">{{ t('train.pick.hintPremium') }}</p>
        </button>
        <button type="button" :class="cardPickClass(program === 'b')" @click="selectProgram('b')">
          <span class="text-xs font-bold tracking-[2px] uppercase text-blue block mb-2">{{ t('train.tab.practical') }}</span>
          <p class="text-sm text-text-muted leading-relaxed">{{ t('train.pick.hintPractical') }}</p>
        </button>
      </div>

      <!-- Programme A -->
      <div v-show="program === 'a'" class="reveal space-y-10">
        <header>
          <h3 class="font-heading text-[1.65rem] md:text-[1.85rem] font-extrabold text-deep leading-tight mb-2">
            {{ t('train.a.name') }}
          </h3>
          <p class="text-lg text-blue font-semibold mb-6">{{ t('train.a.tagline') }}</p>
          <p class="text-base text-text-muted leading-[1.75]">{{ t('train.a.desc') }}</p>
        </header>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-2">{{ t('train.sec.value') }}</h4>
          <p class="text-[0.95rem] text-text-muted leading-[1.7]">{{ t('train.a.value') }}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-2">{{ t('train.sec.duration') }}</h4>
          <p class="text-[0.95rem] text-deep font-medium">{{ t('train.a.duration') }}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.a.audienceTitle') }}</h4>
          <ul class="list-none space-y-2">
            <li
              v-for="key in audienceA"
              :key="key"
              class="flex items-center gap-2 text-[0.95rem] text-text-muted before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue before:shrink-0"
            >
              {{ t(key) }}
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.a.delTitle') }}</h4>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="key in delA"
              :key="key"
              class="text-xs font-medium text-deep bg-white border border-gray-light/80 px-3 py-1.5 rounded-full"
            >
              {{ t(key) }}
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.price.pick') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button type="button" :class="bandClass(band === 1)" @click="selectBand(1)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.a.p1name') }}</p>
              <p class="text-sm font-bold text-deep">{{ t('train.a.p1range') }}</p>
            </button>
            <button type="button" :class="bandClass(band === 2)" @click="selectBand(2)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.a.p2name') }}</p>
              <p class="text-sm font-bold text-deep">{{ t('train.a.p2range') }}</p>
            </button>
            <button type="button" :class="bandClass(band === 3)" @click="selectBand(3)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.a.p3name') }}</p>
              <p class="text-xs text-text-muted leading-snug">{{ t('train.a.p3note') }}</p>
            </button>
          </div>
        </div>

        <div class="pt-2">
          <a
            href="#cta-formacion"
            class="inline-flex min-h-[48px] items-center justify-center bg-blue text-white py-3 px-8 rounded-full text-sm font-semibold no-underline transition-all hover:bg-[#5aaeff] hover:-translate-y-px"
          >
            {{ t('train.a.cta') }}
          </a>
        </div>
      </div>

      <!-- Programme B -->
      <div v-show="program === 'b'" class="reveal space-y-10">
        <header>
          <h3 class="font-heading text-[1.65rem] md:text-[1.85rem] font-extrabold text-deep leading-tight mb-2">
            {{ t('train.b.name') }}
          </h3>
          <p class="text-lg text-blue font-semibold mb-6">{{ t('train.b.tagline') }}</p>
          <p class="text-base text-text-muted leading-[1.75]">{{ t('train.b.desc') }}</p>
        </header>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-2">{{ t('train.sec.value') }}</h4>
          <p class="text-[0.95rem] text-text-muted leading-[1.7]">{{ t('train.b.value') }}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-2">{{ t('train.sec.duration') }}</h4>
          <p class="text-[0.95rem] text-deep font-medium">{{ t('train.b.duration') }}</p>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.b.audienceTitle') }}</h4>
          <ul class="list-none space-y-2">
            <li
              v-for="key in audienceB"
              :key="key"
              class="flex items-center gap-2 text-[0.95rem] text-text-muted before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue before:shrink-0"
            >
              {{ t(key) }}
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.b.delTitle') }}</h4>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="key in delB"
              :key="key"
              class="text-xs font-medium text-deep bg-white border border-gray-light/80 px-3 py-1.5 rounded-full"
            >
              {{ t(key) }}
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('train.price.pick') }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button type="button" :class="bandClass(band === 1)" @click="selectBand(1)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.b.p1name') }}</p>
              <p class="text-sm font-bold text-deep">{{ t('train.b.p1range') }}</p>
            </button>
            <button type="button" :class="bandClass(band === 2)" @click="selectBand(2)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.b.p2name') }}</p>
              <p class="text-sm font-bold text-deep">{{ t('train.b.p2range') }}</p>
            </button>
            <button type="button" :class="bandClass(band === 3)" @click="selectBand(3)">
              <p class="text-[0.7rem] font-bold uppercase tracking-wide text-text-muted mb-1">{{ t('train.b.p3name') }}</p>
              <p class="text-xs text-text-muted leading-snug">{{ t('train.b.p3note') }}</p>
            </button>
          </div>
        </div>

        <div class="pt-2">
          <a
            href="#cta-formacion"
            class="inline-flex min-h-[48px] items-center justify-center bg-blue text-white py-3 px-8 rounded-full text-sm font-semibold no-underline transition-all hover:bg-[#5aaeff] hover:-translate-y-px"
          >
            {{ t('train.b.cta') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
