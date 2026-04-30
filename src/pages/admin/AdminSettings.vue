<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as adminService from '@/services/admin.service'
import { useI18n } from '@/composables/useI18n'
import { getApiErrorMessage } from '@/utils/api-error'

const { t } = useI18n()
const auth = useAuthStore()

const enabled = ref(false)
const saving = ref(false)
const errorMsg = ref<string | null>(null)
const saved = ref(false)
const inviteEmail = ref('')
const inviteLoading = ref(false)
const inviteErrorMsg = ref<string | null>(null)
const inviteResult = ref<{
  temporaryPassword: string
  challengeId: string
  message: string
} | null>(null)

watch(
  () => auth.user?.twoFactorLoginEnabled,
  (v) => {
    if (v !== undefined) enabled.value = v
  },
  { immediate: true },
)

const canToggle = computed(() => Boolean(auth.user))

async function save() {
  errorMsg.value = null
  saved.value = false
  saving.value = true
  try {
    await auth.setTwoFactorLogin(enabled.value)
    saved.value = true
  } catch (e) {
    errorMsg.value = getApiErrorMessage(e)
  } finally {
    saving.value = false
  }
}

async function submitInvite() {
  inviteErrorMsg.value = null
  inviteLoading.value = true
  inviteResult.value = null
  try {
    const res = await adminService.inviteUser({ email: inviteEmail.value.trim() })
    inviteResult.value = {
      temporaryPassword: res.temporaryPassword,
      challengeId: res.challengeId,
      message: res.message,
    }
    inviteEmail.value = ''
  } catch (e) {
    inviteErrorMsg.value = getApiErrorMessage(e)
  } finally {
    inviteLoading.value = false
  }
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('admin.config.title') }}</h1>
      <p class="text-sm text-text-muted">{{ t('admin.config.subtitle') }}</p>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-2">{{ t('admin.invite.title') }}</h2>
      <p class="text-sm text-text-muted mb-5">{{ t('admin.invite.next_steps') }}</p>

      <form class="flex flex-col gap-4" @submit.prevent="submitInvite">
        <div>
          <label for="invite-email" class="block text-sm font-medium text-text mb-1">{{
            t('admin.invite.email')
          }}</label>
          <input
            id="invite-email"
            v-model="inviteEmail"
            type="email"
            autocomplete="off"
            required
            class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-text bg-white"
          />
        </div>
        <p v-if="inviteErrorMsg" class="text-sm text-red-600" role="alert">{{ inviteErrorMsg }}</p>
        <button
          type="submit"
          :disabled="inviteLoading"
          class="self-start rounded-radius-sm bg-deep px-4 py-2.5 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {{ inviteLoading ? t('admin.invite.loading') : t('admin.invite.submit') }}
        </button>
      </form>

      <div
        v-if="inviteResult"
        class="mt-6 rounded-radius-sm border border-blue/30 bg-surface2 p-4"
      >
        <p class="text-sm font-medium text-text mb-2">{{ inviteResult.message }}</p>
        <p class="text-xs text-text-muted mb-1">{{ t('admin.invite.temp_password') }}</p>
        <code
          class="block select-all rounded bg-white px-3 py-2 text-sm text-text border border-gray-light"
          >{{ inviteResult.temporaryPassword }}</code
        >
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-1">{{ t('admin.settings.title') }}</h2>
      <p class="text-sm text-text-muted mb-6">{{ t('admin.settings.subtitle') }}</p>

      <div v-if="!canToggle" class="text-sm text-text-muted">Loading…</div>

      <form v-else class="flex flex-col gap-4" @submit.prevent="save">
        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="enabled" type="checkbox" class="mt-1 size-4 accent-deep" />
          <span class="text-sm text-text">{{ t('admin.settings.2fa') }}</span>
        </label>

        <p v-if="errorMsg" class="text-sm text-red-600" role="alert">{{ errorMsg }}</p>
        <p v-if="saved" class="text-sm text-green-700">{{ t('admin.settings.saved') }}</p>

        <button
          type="submit"
          :disabled="saving"
          class="self-start rounded-radius-sm bg-deep px-4 py-2.5 text-white font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {{ saving ? t('admin.settings.saving') : t('admin.settings.save') }}
        </button>
      </form>
    </section>
  </div>
</template>
