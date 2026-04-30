<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'
import { getApiErrorMessage } from '@/utils/api-error'
import type { LoginChallengePurpose } from '@/types/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const challengeId = computed(() => {
  const id = route.query.challengeId
  return typeof id === 'string' ? id : ''
})

const purpose = computed((): LoginChallengePurpose => {
  const p = route.query.purpose
  return p === 'login_2fa' ? 'login_2fa' : 'signup'
})

const brand = computed(() => t('brand.name'))

const subtitle = computed(() =>
  purpose.value === 'login_2fa'
    ? t('auth.verify.subtitle_2fa', { brand: brand.value })
    : t('auth.verify.subtitle_signup', { brand: brand.value }),
)

const code = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const redirectTarget = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') ? r : null
})

async function submit() {
  if (!challengeId.value) {
    errorMsg.value = 'Missing challenge. Return to sign in.'
    return
  }
  errorMsg.value = null
  loading.value = true
  try {
    await auth.verifyOtp(challengeId.value, code.value.trim())
    const dest = redirectTarget.value ?? (auth.hasRole('admin') ? '/admin' : '/')
    await router.push(dest)
  } catch (e) {
    errorMsg.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push({
    name: 'login',
    ...(redirectTarget.value ? { query: { redirect: redirectTarget.value } } : {}),
  })
}

onMounted(() => {
  if (!challengeId.value) {
    router.replace({
      name: 'login',
      ...(redirectTarget.value ? { query: { redirect: redirectTarget.value } } : {}),
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-deep flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md rounded-[var(--radius-radius)] bg-white p-8 shadow-lg">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">
        {{ t('auth.verify.title') }}
      </h1>
      <p class="text-sm text-text-muted mb-6">{{ subtitle }}</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div>
          <label for="otp-code" class="block text-sm font-medium text-text mb-1">{{
            t('auth.verify.code')
          }}</label>
          <input
            id="otp-code"
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            pattern="[0-9]{6}"
            autocomplete="one-time-code"
            required
            class="w-full rounded-[var(--radius-radius-sm)] border border-gray-light px-3 py-2 text-text tracking-widest text-center text-lg"
            placeholder="000000"
          />
        </div>

        <p v-if="errorMsg" class="text-sm text-red-600" role="alert">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="loading || !challengeId"
          class="rounded-[var(--radius-radius-sm)] bg-deep px-4 py-3 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {{ loading ? t('auth.verify.loading') : t('auth.verify.submit') }}
        </button>
      </form>

      <button
        type="button"
        class="mt-6 text-sm text-blue bg-transparent border-none cursor-pointer hover:underline p-0"
        @click="goLogin"
      >
        {{ t('auth.verify.back') }}
      </button>
    </div>
  </div>
</template>
