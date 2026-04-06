<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'

const { t } = useI18n()
const { openModal, openPricingModal } = useModals()
</script>

<template>
  <footer class="bg-[#060E14] text-white/50 py-[60px] px-[5%] pb-9 flex flex-col gap-10">
    <div class="flex justify-between flex-wrap gap-8">
      <div class="footer-brand">
        <RouterLink to="/" class="font-heading text-[1.3rem] font-extrabold text-white no-underline">
          <span class="text-blue">Lumify</span>
        </RouterLink>
        <p class="mt-3 text-sm max-w-[280px] leading-relaxed">{{ t('foot.desc') }}</p>
      </div>
      <div class="footer-links">
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s1') }}</h5>
        <ul class="list-none">
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('assessment')">{{ t('foot.s1l1') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('modelo')">{{ t('foot.s1l2') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('implementacion')">{{ t('foot.s1l3') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('migracion')">{{ t('foot.s1l4') }}</button></li>
        </ul>
      </div>
      <div class="footer-links">
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s2') }}</h5>
        <ul class="list-none">
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('pack-datos')">{{ t('foot.s2l1') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('pack-omni')">{{ t('foot.s2l2') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('pack-beauty')">{{ t('foot.s2l3') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openModal('pack-health')">{{ t('foot.s2l4') }}</button></li>
        </ul>
      </div>
      <div class="footer-links">
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s3') }}</h5>
        <ul class="list-none">
          <li class="mb-2"><a href="/#nosaltres" class="min-h-[44px] flex items-center text-white/45 no-underline text-sm transition-colors hover:text-blue">{{ t('foot.s3l1') }}</a></li>
          <li class="mb-2">
            <RouterLink
              to="/training"
              class="min-h-[44px] flex items-center text-white/45 no-underline text-sm transition-colors hover:text-blue"
            >
              {{ t('foot.training') }}
            </RouterLink>
          </li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit" @click="openPricingModal()">{{ t('foot.s3l2') }}</button></li>
          <li class="mb-2"><button type="button" class="min-h-[44px] flex items-center w-full bg-transparent border-none py-2.5 pr-0 pl-0 text-left text-white/45 no-underline text-sm transition-colors hover:text-blue cursor-pointer font-inherit">{{ t('foot.s3l3') }}</button></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 pt-6 text-xs flex justify-between flex-wrap gap-3">
      <span>{{ t('foot.copy') }}</span>
      <span>Cataluña, España 🇪🇸</span>
    </div>
  </footer>
</template>
