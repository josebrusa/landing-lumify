<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useModals } from '../../composables/useModals'
import { useAuthStore } from '../../stores/auth'
import { useLeadsStore } from '../../stores/leads'
import { PhX } from '@phosphor-icons/vue'
import TechSectionNav from './TechSectionNav.vue'
import { pricingAttribution } from '../../data/leadAttribution'
import type { Lang } from '../../data/translations'

const mobileMenuOpen = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const leads = useLeadsStore()
const { t, locale, setLocale } = useI18n()
const { currentModalKey, isPricingOpen, openPricingModal } = useModals()

const isTech = computed(() => route.path.startsWith('/tech'))
const isLogistics = computed(() => route.path.startsWith('/logistics'))

const contextLabel = computed(() => {
  if (isTech.value) return t('nav.tech')
  if (isLogistics.value) return t('nav.logistics')
  return t('nav.group')
})

function updateBodyScroll() {
  const lock = !!currentModalKey.value || isPricingOpen.value || mobileMenuOpen.value
  document.body.style.overflow = lock ? 'hidden' : ''
}
watch([currentModalKey, isPricingOpen, mobileMenuOpen], updateBodyScroll, { immediate: true })

const langs: { code: Lang; label: string }[] = [
  { code: 'ca', label: 'CA' },
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

function isActiveLang(code: Lang) {
  return locale.value === code
}

function isPrimaryActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function primaryLinkClass(path: string) {
  const active = isPrimaryActive(path)
  return [
    'no-underline text-sm font-medium tracking-[0.3px] transition-colors',
    active ? 'text-blue' : 'text-white/78 hover:text-blue',
  ]
}

function toggleMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
function closeMenu() {
  mobileMenuOpen.value = false
}

function registerPricingIntent(_section: string, _cta: string) {
  leads.registerIntent({
    interestType: 'pim_service',
    sourcePage: 'home',
    sourceSection: pricingAttribution.sourceSection,
    sourceCardId: pricingAttribution.sourceCardId,
    sourceCta: pricingAttribution.sourceCta,
  })
}

function openPricingFromNav() {
  registerPricingIntent('nav', 'nav_pricing')
  openPricingModal()
}

function closeAndPricing() {
  closeMenu()
  registerPricingIntent('mobile_nav', 'mobile_nav_pricing')
  openPricingModal()
}

async function logout() {
  await auth.logout()
  await router.push('/')
  closeMenu()
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-100 group/chrome">
    <nav
      id="navbar"
      class="flex items-center justify-between px-[5%] py-[18px] bg-deep/97 backdrop-blur-md border-b border-blue/15"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-0 font-heading text-xl font-extrabold text-white tracking-[-0.3px] no-underline shrink-0"
      >
        <img
          src="/lumify-logo.png"
          alt="Lumify"
          class="h-9 w-auto"
          style="filter: brightness(0) invert(1)"
        />
        <span class="text-blue -ml-3.5" aria-hidden="true">{{ contextLabel }}</span>
      </RouterLink>

      <ul class="hidden lg:flex items-center gap-8 list-none absolute left-1/2 -translate-x-1/2">
        <li>
          <RouterLink to="/" :class="primaryLinkClass('/')">{{ t('nav.group') }}</RouterLink>
        </li>
        <li>
          <RouterLink to="/tech" :class="primaryLinkClass('/tech')">{{ t('nav.tech') }}</RouterLink>
        </li>
        <li>
          <RouterLink to="/logistics" :class="primaryLinkClass('/logistics')">{{ t('nav.logistics') }}</RouterLink>
        </li>
      </ul>

      <div class="flex items-center gap-4">
        <div class="flex gap-1 bg-white/10 rounded-full p-1">
          <button
            v-for="l in langs"
            :key="l.code"
            type="button"
            class="min-h-[44px] min-w-[44px] flex items-center justify-center border-none text-xs font-semibold py-1 px-2.5 rounded-full transition-all duration-200 font-sans uppercase tracking-wider cursor-pointer"
            :class="isActiveLang(l.code) ? 'bg-blue text-white' : 'bg-transparent text-white/60'"
            @click="setLocale(l.code)"
          >
            {{ l.label }}
          </button>
        </div>

        <div v-if="isTech" class="hidden lg:flex items-center gap-3">
          <template v-if="auth.isAuthenticated">
            <RouterLink
              v-if="auth.hasRole('admin')"
              to="/admin"
              class="text-white/78 no-underline text-sm font-medium transition-colors hover:text-blue tracking-[0.3px]"
            >
              {{ t('nav.admin') }}
            </RouterLink>
            <button
              type="button"
              class="text-white/78 text-sm font-medium hover:text-blue bg-transparent border-none cursor-pointer tracking-[0.3px]"
              @click="logout"
            >
              {{ t('nav.logout') }}
            </button>
          </template>
          <button
            type="button"
            class="min-h-[44px] inline-flex items-center bg-blue text-white py-2.5 px-5 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-[#5aaeff] hover:-translate-y-px border-none cursor-pointer font-sans"
            @click="openPricingFromNav"
          >
            {{ t('nav.cta') }}
          </button>
        </div>

        <button
          type="button"
          class="lg:hidden flex flex-col gap-1 cursor-pointer bg-transparent border-none min-h-[44px] min-w-[44px] items-center justify-center"
          aria-label="Menu"
          @click="toggleMenu"
        >
          <span class="block w-[22px] h-0.5 bg-white rounded-sm transition-all duration-300" />
          <span class="block w-[22px] h-0.5 bg-white rounded-sm transition-all duration-300" />
          <span class="block w-[22px] h-0.5 bg-white rounded-sm transition-all duration-300" />
        </button>
      </div>
    </nav>

    <TechSectionNav v-if="isTech" />
  </header>

  <div
    v-show="mobileMenuOpen"
    class="fixed inset-0 bg-deep z-99 flex flex-col items-center justify-center gap-6"
  >
    <button
      type="button"
      class="absolute top-6 right-[5%] min-h-[44px] min-w-[44px] flex items-center justify-center bg-transparent border-none text-white text-3xl cursor-pointer"
      aria-label="Cerrar"
      @click="closeMenu"
    >
      <PhX :size="28" weight="bold" />
    </button>

    <RouterLink
      to="/"
      class="min-h-[44px] flex items-center text-white no-underline text-2xl font-heading font-bold hover:text-blue"
      :class="{ 'text-blue': isPrimaryActive('/') }"
      @click="closeMenu"
    >
      {{ t('nav.group') }}
    </RouterLink>
    <RouterLink
      to="/tech"
      class="min-h-[44px] flex items-center text-white no-underline text-2xl font-heading font-bold hover:text-blue"
      :class="{ 'text-blue': isPrimaryActive('/tech') }"
      @click="closeMenu"
    >
      {{ t('nav.tech') }}
    </RouterLink>
    <RouterLink
      to="/logistics"
      class="min-h-[44px] flex items-center text-white no-underline text-2xl font-heading font-bold hover:text-blue"
      :class="{ 'text-blue': isPrimaryActive('/logistics') }"
      @click="closeMenu"
    >
      {{ t('nav.logistics') }}
    </RouterLink>

    <template v-if="isTech">
      <div class="w-12 border-t border-white/15 my-1" />
      <a href="/tech#servicios" class="min-h-[44px] flex items-center text-white/70 no-underline text-lg font-heading font-semibold hover:text-blue" @click="closeMenu">{{ t('nav.services') }}</a>
      <a href="/tech#packs" class="min-h-[44px] flex items-center text-white/70 no-underline text-lg font-heading font-semibold hover:text-blue" @click="closeMenu">{{ t('nav.packs') }}</a>
      <a href="/tech#retainers" class="min-h-[44px] flex items-center text-white/70 no-underline text-lg font-heading font-semibold hover:text-blue" @click="closeMenu">{{ t('nav.retainers') }}</a>
      <a href="/tech#metodologia" class="min-h-[44px] flex items-center text-white/70 no-underline text-lg font-heading font-semibold hover:text-blue" @click="closeMenu">{{ t('nav.method') }}</a>
      <a href="/tech#nosaltres" class="min-h-[44px] flex items-center text-white/70 no-underline text-lg font-heading font-semibold hover:text-blue" @click="closeMenu">{{ t('nav.about') }}</a>

      <template v-if="auth.isAuthenticated">
        <RouterLink
          v-if="auth.hasRole('admin')"
          to="/admin"
          class="min-h-[44px] flex items-center text-white no-underline text-2xl font-heading font-bold hover:text-blue"
          @click="closeMenu"
        >
          {{ t('nav.admin') }}
        </RouterLink>
        <button
          type="button"
          class="min-h-[44px] flex items-center text-white text-2xl font-heading font-bold hover:text-blue bg-transparent border-none cursor-pointer"
          @click="logout"
        >
          {{ t('nav.logout') }}
        </button>
      </template>
      <button
        type="button"
        class="min-h-[44px] inline-flex items-center bg-blue text-white py-2.5 px-5 rounded-full text-sm font-semibold no-underline border-none cursor-pointer font-sans"
        @click="closeAndPricing"
      >
        {{ t('nav.cta') }}
      </button>
    </template>
  </div>
</template>
