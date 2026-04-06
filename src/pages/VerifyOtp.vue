<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowLeft, PhLockKey, PhShieldCheck } from '@phosphor-icons/vue'
import { useAuthStore } from '../stores/auth'
import { messageForAuthError } from '../api/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

function safeRedirectPath(): string {
  const raw = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  return '/admin'
}

function maskEmail(email: string | null): string {
  if (!email) return 'tu correo'
  const [local, domain] = email.split('@')
  if (!domain) return 'tu correo'
  const masked = local.length <= 1 ? '***' : `${local[0]}***${local.slice(-1)}`
  return `${masked}@${domain}`
}

const maskedEmail = computed(() => maskEmail(auth.otpEmail))

const code = ref('')
const error = ref('')
const loading = ref(false)

function onCodeInput(e: Event) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 6)
  code.value = digits
  input.value = digits
}

function goBackToLogin() {
  auth.clearOtpChallenge()
  router.replace({ name: 'login', query: { ...route.query } })
}

async function onSubmit() {
  error.value = ''
  if (code.value.length !== 6) {
    error.value = 'Introduce el código de 6 dígitos.'
    return
  }
  loading.value = true
  try {
    await auth.verifyOtpCode(code.value)
    router.replace(safeRedirectPath())
  } catch (e) {
    error.value = messageForAuthError(e, 'verifyOtp')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-[5%] py-12 relative overflow-hidden bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)]"
  >
    <div
      class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]"
    />

    <RouterLink
      to="/"
      class="relative z-10 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-10 transition-colors"
    >
      <PhArrowLeft :size="18" weight="regular" />
      Volver al sitio
    </RouterLink>

    <div
      class="relative z-10 w-full max-w-[420px] rounded-radius bg-white/95 shadow-[0_24px_80px_rgba(10,61,98,0.35)] border border-white/20 p-8 md:p-10"
    >
      <div class="flex items-center gap-3 mb-2">
        <div
          class="w-11 h-11 rounded-radius-sm bg-deep/10 flex items-center justify-center text-deep"
        >
          <PhLockKey :size="24" weight="duotone" />
        </div>
        <div>
          <p class="text-xs font-bold tracking-[2px] uppercase text-blue">Lumify</p>
          <h1 class="font-heading text-xl font-extrabold text-deep tracking-tight">Verificación</h1>
        </div>
      </div>
      <p class="text-sm text-text-muted mb-8 leading-relaxed">
        Introduce el código de 6 dígitos enviado a <span class="font-semibold text-deep">{{ maskedEmail }}</span>
      </p>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label for="otp-code" class="block text-xs font-bold uppercase tracking-wide text-deep mb-1.5"
            >Código</label
          >
          <input
            id="otp-code"
            :value="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            autocomplete="one-time-code"
            class="w-full min-h-[52px] px-4 border-[1.5px] border-gray-light rounded-xl text-[1.35rem] tracking-[0.4em] text-center font-mono outline-none transition-[border-color] focus:border-blue text-deep bg-white"
            placeholder="000000"
            @input="onCodeInput"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 font-medium" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-deep text-white font-bold text-[0.95rem] tracking-wide hover:bg-[#0d4f7e] transition-colors disabled:opacity-60 disabled:pointer-events-none shadow-[0_12px_40px_rgba(10,61,98,0.35)]"
        >
          <PhShieldCheck :size="22" weight="bold" />
          {{ loading ? 'Verificando…' : 'Verificar' }}
        </button>

        <p class="text-xs text-text-muted text-center leading-relaxed">
          Reenviar código no está disponible aún. Para recibir uno nuevo, vuelve al inicio de sesión.
        </p>

        <button
          type="button"
          class="w-full text-sm font-semibold text-deep hover:underline"
          @click="goBackToLogin"
        >
          Volver al inicio de sesión
        </button>
      </form>
    </div>
  </div>
</template>
