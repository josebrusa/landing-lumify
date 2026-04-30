<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { getApiErrorMessage } from '@/utils/api-error'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const redirectTarget = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : null
})

async function submit() {
  errorMsg.value = null
  loading.value = true
  try {
    const res = await auth.register({
      email: email.value.trim(),
      password: password.value,
    })
    if (res.challengeId) {
      await router.push({
        name: 'verify-otp',
        query: {
          challengeId: res.challengeId,
          purpose: res.purpose ?? 'signup',
          ...(res.message ? { message: res.message } : {}),
          ...(redirectTarget.value ? { redirect: redirectTarget.value } : {}),
        },
      })
      return
    }
    if ('access_token' in res && res.access_token) {
      auth.setSession(res.access_token)
      await auth.fetchMe()
      const dest = redirectTarget.value ?? (auth.hasRole('admin') ? '/admin' : '/')
      await router.push(dest)
      return
    }
    errorMsg.value = 'Unexpected response from server.'
  } catch (e) {
    errorMsg.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-deep flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md rounded-radius bg-white p-8 shadow-lg">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">
        {{ t('auth.register.title') }}
      </h1>
      <p class="text-sm text-text-muted mb-6">{{ t('auth.register.subtitle') }}</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div>
          <label for="register-email-auth" class="block text-sm font-medium text-text mb-1">{{
            t('auth.register.email')
          }}</label>
          <input
            id="register-email-auth"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-text"
          />
        </div>
        <div>
          <label
            for="register-password-auth"
            class="block text-sm font-medium text-text mb-1"
            >{{ t('auth.register.password') }}</label
          >
          <input
            id="register-password-auth"
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-text"
          />
        </div>

        <p v-if="errorMsg" class="text-sm text-red-600" role="alert">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="rounded-radius-sm bg-deep px-4 py-3 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {{ loading ? t('auth.register.loading') : t('auth.register.submit') }}
        </button>
      </form>

      <div class="mt-6 flex flex-col gap-2">
        <RouterLink to="/login" class="text-sm text-blue no-underline hover:underline">
          {{ t('auth.register.back_login') }}
        </RouterLink>
        <RouterLink to="/" class="text-sm text-blue no-underline hover:underline">
          ← {{ t('nav.home') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
