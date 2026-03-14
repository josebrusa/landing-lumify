<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'
import { PhMagnifyingGlass, PhFolder, PhGear, PhRocketLaunch } from '@phosphor-icons/vue'

const { t } = useI18n()
const { openModal } = useModals()

const services = [
  { key: 'assessment' as const, icon: PhMagnifyingGlass, titleKey: 's1.title', descKey: 's1.desc', linkKey: 's1.link' },
  { key: 'modelo' as const, icon: PhFolder, titleKey: 's2.title', descKey: 's2.desc', linkKey: 's2.link' },
  { key: 'implementacion' as const, icon: PhGear, titleKey: 's3.title', descKey: 's3.desc', linkKey: 's3.link' },
  { key: 'migracion' as const, icon: PhRocketLaunch, titleKey: 's4.title', descKey: 's4.desc', linkKey: 's4.link' },
]
</script>

<template>
  <section id="servicios" class="py-[100px] px-[5%] bg-surface">
    <div class="mb-16 reveal">
      <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('serv.label') }}</div>
      <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px]">
        {{ t('serv.title') }}
      </h2>
      <p class="text-base text-text-muted leading-[1.75] max-w-[560px] mt-4">
        {{ t('serv.desc') }}
      </p>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      <div
        v-for="s in services"
        :key="s.key"
        class="reveal bg-white rounded-radius p-9 py-8 border border-gray-light transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(10,61,98,0.12)] hover:border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-linear-to-r before:from-deep before:to-blue before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
        @click="openModal(s.key)"
      >
        <div
          class="w-[52px] h-[52px] bg-linear-to-br from-deep to-blue rounded-[14px] flex items-center justify-center mb-5 text-2xl text-white"
        >
          <component :is="s.icon" :size="28" weight="regular" />
        </div>
        <h3 class="text-xl font-bold text-deep mb-2.5 tracking-[-0.3px]">
          {{ t(s.titleKey) }}
        </h3>
        <p class="text-[0.93rem] text-text-muted leading-[1.65]">
          {{ t(s.descKey) }}
        </p>
        <a
          href="#"
          class="inline-flex items-center gap-1.5 text-blue text-[0.87rem] font-semibold mt-5 no-underline transition-[gap] hover:gap-2.5"
          @click.prevent="openModal(s.key)"
        >
          {{ t(s.linkKey) }}
        </a>
      </div>
    </div>
  </section>
</template>
