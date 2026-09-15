<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const links = [
  { href: '/tech#servicios', key: 'nav.services' },
  { href: '/tech#packs', key: 'nav.packs' },
  { href: '/tech#retainers', key: 'nav.retainers' },
  { href: '/tech#metodologia', key: 'nav.method' },
  { href: '/tech#nosaltres', key: 'nav.about' },
] as const
</script>

<template>
  <div
    class="hidden lg:grid grid-rows-[0fr] opacity-0 -translate-y-1
           transition-[grid-template-rows,opacity,transform] duration-300 ease-out
           group-hover/chrome:grid-rows-[1fr] group-hover/chrome:opacity-100 group-hover/chrome:translate-y-0
           group-focus-within/chrome:grid-rows-[1fr] group-focus-within/chrome:opacity-100 group-focus-within/chrome:translate-y-0"
  >
    <div class="overflow-hidden min-h-0">
      <nav
        aria-label="Tech sections"
        class="flex items-center justify-center gap-9 px-[5%] py-3 bg-deep/95 backdrop-blur-md border-b border-blue/10"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-white/70 no-underline text-sm font-medium tracking-[0.3px] transition-colors hover:text-blue"
        >
          {{ t(link.key) }}
        </a>
      </nav>
    </div>
  </div>
</template>
