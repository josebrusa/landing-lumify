<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft, PhHouse, PhShieldCheck } from '@phosphor-icons/vue'
import { useAuthStore } from '../stores/auth'
import { ApiError, messageForAuthError } from '../api/auth'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const pageLoading = ref(false)
const toggleLoading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!auth.user) {
    pageLoading.value = true
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
      router.replace({ name: 'login', query: { redirect: '/admin/settings' } })
    } finally {
      pageLoading.value = false
    }
  }
})

async function onTwoFactorChange(e: Event) {
  const el = e.target as HTMLInputElement
  const next = el.checked
  toggleLoading.value = true
  error.value = ''
  try {
    await auth.updateTwoFactorLogin(next)
  } catch (err) {
    el.checked = !next
    error.value = messageForAuthError(err, 'twoFactor')
    if (err instanceof ApiError && err.statusCode === 401) {
      auth.logout()
      router.replace({ name: 'login', query: { redirect: '/admin/settings' } })
    }
  } finally {
    toggleLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface flex flex-col">
    <header
      class="flex items-center justify-between px-[5%] py-5 border-b border-gray-light/80 bg-white/90 backdrop-blur-sm"
    >
      <div>
        <p class="text-xs font-bold tracking-[2px] uppercase text-blue">{{ t('brand.name') }}</p>
        <h1 class="font-heading text-lg font-extrabold text-deep">Seguridad</h1>
        <p v-if="auth.user" class="text-sm text-text-muted mt-1">{{ auth.user.email }}</p>
      </div>
      <div class="flex items-center gap-3">
        <RouterLink
          to="/admin"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-light text-deep text-sm font-semibold hover:bg-surface2 transition-colors"
        >
          <PhArrowLeft :size="20" weight="regular" />
          Panel
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-light text-deep text-sm font-semibold hover:bg-surface2 transition-colors"
        >
          <PhHouse :size="20" weight="regular" />
          Sitio público
        </RouterLink>
      </div>
    </header>

    <main class="flex-1 px-[5%] py-12 max-w-3xl mx-auto w-full">
      <div
        v-if="pageLoading"
        class="rounded-radius bg-white border border-gray-light/80 p-8 text-text-muted"
      >
        Cargando…
      </div>
      <div
        v-else
        class="rounded-radius bg-white border border-gray-light/80 p-8 shadow-[0_8px_40px_rgba(31,42,55,0.06)]"
      >
        <div class="flex items-start gap-3 mb-6">
          <div
            class="w-11 h-11 rounded-radius-sm bg-deep/10 flex items-center justify-center text-deep shrink-0"
          >
            <PhShieldCheck :size="24" weight="duotone" />
          </div>
          <div>
            <h2 class="font-heading text-xl font-bold text-deep">Inicio de sesión en dos pasos</h2>
            <p class="text-text-muted text-sm mt-1 leading-relaxed">
              Si lo activas, tras el correo y la contraseña correctos te pediremos un código de 6 dígitos enviado por
              email en cada inicio de sesión.
            </p>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-gray-light/80"
        >
          <span class="text-sm font-semibold text-deep">Segundo factor al iniciar sesión</span>
          <label class="inline-flex items-center gap-3 cursor-pointer select-none">
            <span class="text-sm text-text-muted">{{ auth.user?.twoFactorLoginEnabled ? 'Activado' : 'Desactivado' }}</span>
            <span class="relative inline-block w-11 h-6 shrink-0">
              <input
                type="checkbox"
                class="peer sr-only"
                :checked="auth.user?.twoFactorLoginEnabled ?? false"
                :disabled="toggleLoading || !auth.user"
                @change="onTwoFactorChange"
              />
              <span
                class="block w-11 h-6 rounded-full bg-gray-light transition-colors peer-checked:bg-deep peer-focus-within:ring-2 peer-focus-within:ring-blue/40 peer-disabled:opacity-50"
                aria-hidden="true"
              />
              <span
                class="pointer-events-none absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
                aria-hidden="true"
              />
            </span>
          </label>
        </div>

        <p v-if="error" class="text-sm text-red-600 font-medium mt-4" role="alert">
          {{ error }}
        </p>
      </div>
    </main>
  </div>
</template>
