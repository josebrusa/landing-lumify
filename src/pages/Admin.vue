<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PhGear, PhSignOut, PhHouse } from '@phosphor-icons/vue'
import { useAuthStore } from '../stores/auth'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

onMounted(async () => {
  if (!auth.user) {
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
      router.replace({ name: 'login' })
    }
  }
})

function logout() {
  auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-surface flex flex-col">
    <header
      class="flex items-center justify-between px-[5%] py-5 border-b border-gray-light/80 bg-white/90 backdrop-blur-sm"
    >
      <div>
        <p class="text-xs font-bold tracking-[2px] uppercase text-blue">{{ t('brand.name') }}</p>
        <h1 class="font-heading text-lg font-extrabold text-deep">Panel de administración</h1>
        <p v-if="auth.user" class="text-sm text-text-muted mt-1">{{ auth.user.email }}</p>
      </div>
      <div class="flex items-center gap-3">
        <RouterLink
          :to="{ name: 'admin-settings' }"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-light text-deep text-sm font-semibold hover:bg-surface2 transition-colors"
        >
          <PhGear :size="20" weight="regular" />
          Seguridad
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-light text-deep text-sm font-semibold hover:bg-surface2 transition-colors"
        >
          <PhHouse :size="20" weight="regular" />
          Sitio público
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-deep text-white text-sm font-semibold hover:bg-[#0d4f7e] transition-colors"
          @click="logout"
        >
          <PhSignOut :size="20" weight="regular" />
          Cerrar sesión
        </button>
      </div>
    </header>

    <main class="flex-1 px-[5%] py-12 max-w-3xl mx-auto w-full">
      <div
        class="rounded-radius bg-white border border-gray-light/80 p-8 shadow-[0_8px_40px_rgba(31,42,55,0.06)]"
      >
        <h2 class="font-heading text-xl font-bold text-deep mb-2">Bienvenido</h2>
        <p class="text-text-muted leading-relaxed">
          Sesión iniciada correctamente. Desde aquí podrás ampliar la gestión de contenido cuando conectes más
          funcionalidades al backend.
        </p>
      </div>
    </main>
  </div>
</template>
