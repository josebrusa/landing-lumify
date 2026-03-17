<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'

const { t } = useI18n()
const { openModal } = useModals()

const retainers = [
  { key: 'ret-lite' as const, tier: 'Lite', titleKey: 'rl.title', hoursKey: 'rl.hours', features: ['rl.f1', 'rl.f2', 'rl.f3'], best: false },
  { key: 'ret-std' as const, tier: 'Standard', titleKey: 'rs.title', hoursKey: 'rs.hours', features: ['rs.f1', 'rs.f2', 'rs.f3', 'rs.f4'], best: true },
  { key: 'ret-plus' as const, tier: 'Plus', titleKey: 'rp.title', hoursKey: 'rp.hours', features: ['rp.f1', 'rp.f2', 'rp.f3', 'rp.f4'], best: false },
]
</script>

<template>
  <section id="retainers" class="py-16 sm:py-20 lg:py-[100px] px-[5%] bg-gray-dark">
    <div class="mb-12 sm:mb-16 reveal">
      <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('ret.label') }}</div>
      <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-white leading-[1.1] tracking-[-0.8px]">
        {{ t('ret.title') }}
      </h2>
      <p class="text-base text-white/60 leading-[1.75] max-w-[560px] mt-4">
        {{ t('ret.desc') }}
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      <div
        v-for="r in retainers"
        :key="r.key"
        class="reveal rounded-radius p-9 py-8 border transition-all duration-300 relative flex flex-col"
        :class="r.best
          ? 'bg-blue/10 border-blue after:content-[attr(data-label)] after:absolute after:top-[-12px] after:left-1/2 after:-translate-x-1/2 after:bg-blue after:text-white after:text-[0.72rem] after:font-bold after:uppercase after:py-1 after:px-3.5 after:rounded-full after:tracking-wider after:whitespace-nowrap'
          : 'bg-white/5 border-white/10 hover:-translate-y-1 hover:border-blue hover:bg-blue/10'"
        :data-label="r.best ? t('ret.popular') : undefined"
        @click="openModal(r.key)"
      >
        <div class="flex-1 flex flex-col">
          <div class="font-heading text-[0.75rem] font-bold tracking-[2px] uppercase text-blue mb-2.5">{{ r.tier }}</div>
          <h3 class="font-heading text-[1.3rem] font-bold text-white mb-1.5">{{ t(r.titleKey) }}</h3>
          <p class="text-[0.87rem] text-white/45 mb-6">{{ t(r.hoursKey) }}</p>
          <ul class="list-none mb-7 flex-1">
            <li
              v-for="fk in r.features"
              :key="fk"
              class="text-white/65 text-[0.9rem] py-1.5 flex items-start gap-2.5 border-b border-white/10 last:border-0"
            >
              <span class="text-blue shrink-0">→</span>
              {{ t(fk) }}
            </li>
          </ul>
        </div>
        <button
          type="button"
          class="block w-full min-h-[44px] flex items-center justify-center text-center py-3 rounded-full font-semibold text-[0.87rem] border transition-colors no-underline bg-transparent cursor-pointer font-inherit"
          :class="r.best ? 'border-blue text-blue' : 'border-white/20 text-white/70 hover:border-blue hover:text-blue hover:bg-blue/10'"
          @click="openModal(r.key)"
        >
          {{ t('ret.cta') }}
        </button>
      </div>
    </div>
  </section>
</template>
