<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft, PhLockKey, PhUserPlus } from '@phosphor-icons/vue'
import { useAuthStore } from '../stores/auth'
import { messageForAuthError } from '../api/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Completa correo y contraseña.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  try {
    await auth.registerUser(email.value, password.value)
    router.replace({ name: 'login' })
  } catch (e) {
    error.value = messageForAuthError(e, 'register')
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
          <h1 class="font-heading text-xl font-extrabold text-deep tracking-tight">Crear cuenta</h1>
        </div>
      </div>
      <p class="text-sm text-text-muted mb-8 leading-relaxed">
        Regístrate con tu correo y contraseña para acceder al panel.
      </p>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label for="reg-email" class="block text-xs font-bold uppercase tracking-wide text-deep mb-1.5"
            >Correo electrónico</label
          >
          <input
            id="reg-email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="w-full min-h-[48px] px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep bg-white"
          />
        </div>
        <div>
          <label for="reg-password" class="block text-xs font-bold uppercase tracking-wide text-deep mb-1.5"
            >Contraseña</label
          >
          <input
            id="reg-password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            class="w-full min-h-[48px] px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep bg-white"
          />
        </div>
        <div>
          <label for="reg-password2" class="block text-xs font-bold uppercase tracking-wide text-deep mb-1.5"
            >Repetir contraseña</label
          >
          <input
            id="reg-password2"
            v-model="passwordConfirm"
            type="password"
            autocomplete="new-password"
            class="w-full min-h-[48px] px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep bg-white"
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
          <PhUserPlus :size="22" weight="bold" />
          {{ loading ? 'Creando cuenta…' : 'Registrarse' }}
        </button>

        <p class="text-center text-sm text-text-muted">
          ¿Ya tienes cuenta?
          <RouterLink class="font-semibold text-deep hover:underline" :to="{ name: 'login' }">
            Inicia sesión
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
