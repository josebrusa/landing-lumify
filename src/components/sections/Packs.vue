<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'

const { t } = useI18n()
const { openModal } = useModals()

const packs = [
  { key: 'pack-datos' as const, tagKey: 'pt1.tag', durKey: 'pt1.dur', titleKey: 'pt1.title', descKey: 'pt1.desc', featureKeys: ['pt1.f1', 'pt1.f2', 'pt1.f3'], featured: false },
  { key: 'pack-omni' as const, tagKey: 'pt2.tag', durKey: 'pt2.dur', titleKey: 'pt2.title', descKey: 'pt2.desc', featureKeys: ['pt2.f1', 'pt2.f2', 'pt2.f3'], featured: false },
  { key: 'pack-health' as const, tagKey: 'pt4.tag', durKey: 'pt4.dur', titleKey: 'pt4.title', descKey: 'pt4.desc', featureKeys: ['pt4.f1', 'pt4.f2', 'pt4.f3'], featured: false },
  { key: 'pack-beauty' as const, tagKey: 'pt3.tag', durKey: 'pt3.dur', titleKey: 'pt3.title', descKey: 'pt3.desc', featureKeys: ['pt3.f1', 'pt3.f2', 'pt3.f3'], featured: true },
]
</script>

<template>
  <section id="packs" class="py-[100px] px-[5%] bg-white">
    <div class="mb-16 text-center reveal">
      <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('packs.label') }}</div>
      <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px]">
        {{ t('packs.title') }}
      </h2>
      <p class="text-base text-text-muted leading-[1.75] max-w-[560px] mt-4 mx-auto">
        {{ t('packs.desc') }}
      </p>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
      <div
        v-for="p in packs"
        :key="p.key"
        class="reveal rounded-radius p-9 py-8 transition-all duration-300 cursor-pointer border"
        :class="p.featured
          ? 'bg-deep border-transparent text-white shadow-[0_20px_50px_rgba(10,61,98,0.25)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(10,61,98,0.35)]'
          : 'bg-white border-gray-light hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(60,157,255,0.15)] hover:border-blue'"
        @click="openModal(p.key)"
      >
        <span
          class="inline-block py-1 px-3 rounded-full text-[0.72rem] font-bold uppercase tracking-wider mb-5"
          :class="p.featured ? 'bg-blue/25 text-[#7cc4ff]' : 'bg-blue/10 text-blue'"
        >
          {{ t(p.tagKey) }}
        </span>
        <div
          class="text-[0.8rem] font-semibold py-1.5 px-3.5 rounded-full inline-block mb-5"
          :class="p.featured ? 'bg-blue/20 text-[#7cc4ff]' : 'bg-surface text-text-muted'"
        >
          {{ t(p.durKey) }}
        </div>
        <h3
          class="text-[1.25rem] font-bold mb-3 tracking-[-0.3px]"
          :class="p.featured ? 'text-white' : 'text-deep'"
        >
          {{ t(p.titleKey) }}
        </h3>
        <p
          class="text-[0.93rem] leading-[1.65] mb-5"
          :class="p.featured ? 'text-white/70' : 'text-text-muted'"
        >
          {{ t(p.descKey) }}
        </p>
        <ul class="list-none mb-7">
          <li
            v-for="fk in p.featureKeys"
            :key="fk"
            class="text-[0.88rem] py-1.5 flex items-start gap-2"
            :class="p.featured ? 'text-white/75' : 'text-text-muted'"
          >
            <span class="shrink-0 font-bold mt-0.5" :class="p.featured ? 'text-[#7cc4ff]' : 'text-blue'">✓</span>
            {{ t(fk) }}
          </li>
        </ul>
        <a
          href="#"
          class="block text-center py-3.5 rounded-full font-semibold text-[0.9rem] transition-all no-underline"
          :class="p.featured
            ? 'bg-blue text-white hover:bg-[#5aaeff] hover:-translate-y-0.5'
            : 'border-[1.5px] border-blue text-blue hover:bg-blue hover:text-white'"
          @click.prevent="openModal(p.key)"
        >
          {{ t('pack.cta') }}
        </a>
      </div>
    </div>
  </section>
</template>
