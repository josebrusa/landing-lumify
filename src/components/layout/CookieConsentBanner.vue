<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useConsentStore } from '@/stores/consent'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const consent = useConsentStore()
const route = useRoute()

onMounted(() => {
  consent.hydrate()
})

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const visible = computed(() => !isAdminRoute.value && !consent.hasResponded)
</script>

<template>
  <div
    v-if="visible"
    class="fixed bottom-0 inset-x-0 z-[60] border-t border-white/10 bg-[#060E14] text-white/80 px-[5%] py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
    role="dialog"
    aria-labelledby="cookie-banner-title"
  >
    <div
      class="mx-auto max-w-5xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p id="cookie-banner-title" class="text-sm leading-relaxed max-w-2xl">
        {{ t('cookie.banner.text') }}
        <RouterLink to="/cookies" class="text-blue underline hover:opacity-90">{{
          t('cookie.banner.cookies_link')
        }}</RouterLink>
        {{ t('cookie.banner.and') }}
        <RouterLink to="/privacy" class="text-blue underline hover:opacity-90">{{
          t('cookie.banner.privacy_link')
        }}</RouterLink>.
      </p>
      <div class="flex flex-wrap gap-2 shrink-0">
        <button
          type="button"
          class="min-h-[44px] px-5 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/10"
          @click="consent.decline()"
        >
          {{ t('cookie.banner.decline') }}
        </button>
        <button
          type="button"
          class="min-h-[44px] px-5 rounded-full bg-blue text-white text-sm font-semibold hover:opacity-95"
          @click="consent.accept()"
        >
          {{ t('cookie.banner.accept') }}
        </button>
      </div>
    </div>
  </div>
</template>
