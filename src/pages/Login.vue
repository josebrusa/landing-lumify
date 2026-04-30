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
    const res = await auth.login({
      email: email.value.trim(),
      password: password.value,
    })
    if ('access_token' in res && res.access_token) {
      auth.setSession(res.access_token)
      await auth.fetchMe()
      const dest = redirectTarget.value ?? (auth.hasRole('admin') ? '/admin' : '/')
      await router.push(dest)
      return
    }
    if (res.challengeId) {
      await router.push({
        name: 'verify-otp',
        query: {
          challengeId: res.challengeId,
          purpose: res.purpose ?? 'login_2fa',
          ...(res.message ? { message: res.message } : {}),
          ...(redirectTarget.value ? { redirect: redirectTarget.value } : {}),
        },
      })
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
        {{ t('auth.login.title') }}
      </h1>
      <p class="text-sm text-text-muted mb-6">{{ t('auth.login.subtitle') }}</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div>
          <label for="login-email" class="block text-sm font-medium text-text mb-1">{{
            t('auth.login.email')
          }}</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-text"
          />
        </div>
        <div>
          <label for="login-password" class="block text-sm font-medium text-text mb-1">{{
            t('auth.login.password')
          }}</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
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
          {{ loading ? t('auth.login.loading') : t('auth.login.submit') }}
        </button>
      </form>

      <div class="mt-6 flex flex-col gap-2">
        <RouterLink to="/register" class="text-sm text-blue no-underline hover:underline">
          {{ t('auth.login.create_account') }}
        </RouterLink>
        <RouterLink to="/" class="text-sm text-blue no-underline hover:underline">
          ← {{ t('nav.home') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
