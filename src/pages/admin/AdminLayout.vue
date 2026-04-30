<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

async function logout() {
  await auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-surface flex flex-col">
    <header
      class="flex flex-wrap items-center justify-between gap-4 px-[5%] py-4 bg-deep text-white border-b border-blue/15"
    >
      <RouterLink to="/admin" class="font-heading text-xl font-bold text-white no-underline">
        {{ t('brand.name') }} — {{ t('admin.title') }}
      </RouterLink>
      <nav class="flex flex-wrap items-center gap-4 text-sm">
        <RouterLink
          to="/admin"
          class="text-white/80 hover:text-blue no-underline [&.router-link-exact-active]:text-blue"
        >
          {{ t('admin.nav.dashboard') }}
        </RouterLink>
        <RouterLink
          to="/admin/settings"
          class="text-white/80 hover:text-blue no-underline [&.router-link-exact-active]:text-blue"
        >
          {{ t('admin.nav.settings') }}
        </RouterLink>
        <button
          type="button"
          class="text-white/90 border border-white/30 rounded-full px-3 py-1.5 text-xs hover:bg-white/10 cursor-pointer"
          @click="logout"
        >
          {{ t('nav.logout') }}
        </button>
      </nav>
    </header>
    <main class="flex-1 px-[5%] py-8">
      <RouterView />
    </main>
  </div>
</template>
