<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const serviceItems = ['foot.s1l1', 'foot.s1l2', 'foot.s1l3', 'foot.s1l4'] as const
const packItems = ['foot.s2l1', 'foot.s2l2', 'foot.s2l3', 'foot.s2l4'] as const

const linkClass =
  'min-h-[44px] flex items-center text-white/45 no-underline text-sm transition-colors hover:text-blue'
</script>

<template>
  <footer class="bg-[#060E14] text-white/50 py-[60px] px-[5%] pb-9 flex flex-col gap-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-8">
      <div>
        <RouterLink to="/" class="font-heading text-[1.3rem] font-extrabold text-white no-underline">
          <span class="text-blue">Lumify</span>
        </RouterLink>
        <p class="mt-3 text-sm max-w-[280px] leading-relaxed">{{ t('foot.desc') }}</p>
      </div>

      <div>
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.divisions') }}</h5>
        <ul class="list-none">
          <li class="mb-2">
            <RouterLink to="/tech" :class="linkClass">{{ t('nav.tech') }}</RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/logistics" :class="linkClass">{{ t('nav.logistics') }}</RouterLink>
          </li>
          <li class="mb-2">
            <span class="min-h-[44px] flex items-center gap-2 text-white/25 text-sm">
              {{ t('foot.studio') }}
              <span class="text-[10px] uppercase tracking-wider">{{ t('foot.soon') }}</span>
            </span>
          </li>
          <li class="mb-2">
            <span class="min-h-[44px] flex items-center gap-2 text-white/25 text-sm">
              {{ t('foot.legal') }}
              <span class="text-[10px] uppercase tracking-wider">{{ t('foot.soon') }}</span>
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s1') }}</h5>
        <ul class="list-none">
          <li v-for="label in serviceItems" :key="label" class="mb-2">
            <RouterLink :to="{ path: '/tech', hash: '#servicios' }" :class="linkClass">
              {{ t(label) }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s2') }}</h5>
        <ul class="list-none">
          <li v-for="label in packItems" :key="label" class="mb-2">
            <RouterLink :to="{ path: '/tech', hash: '#packs' }" :class="linkClass">
              {{ t(label) }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h5 class="text-white text-sm font-semibold mb-3.5 tracking-wide">{{ t('foot.s3') }}</h5>
        <ul class="list-none">
          <li class="mb-2">
            <RouterLink :to="{ path: '/tech', hash: '#nosaltres' }" :class="linkClass">
              {{ t('foot.s3l1') }}
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink :to="{ path: '/tech', hash: '#registro' }" :class="linkClass">
              {{ t('foot.contactTech') }}
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink :to="{ path: '/logistics', hash: '#contacto' }" :class="linkClass">
              {{ t('foot.contactLogistics') }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 pt-6 text-xs flex justify-between flex-wrap gap-3">
      <span>{{ t('foot.copy') }}</span>
      <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Legal">
        <RouterLink to="/privacy" class="text-white/45 no-underline hover:text-blue">
          {{ t('foot.privacy') }}
        </RouterLink>
        <RouterLink to="/terms" class="text-white/45 no-underline hover:text-blue">
          {{ t('foot.terms') }}
        </RouterLink>
        <RouterLink to="/cookies" class="text-white/45 no-underline hover:text-blue">
          {{ t('foot.cookies') }}
        </RouterLink>
      </nav>
    </div>
  </footer>
</template>
