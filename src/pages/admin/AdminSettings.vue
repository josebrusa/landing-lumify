<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCrmStore } from '@/stores/crm'
import * as adminService from '@/services/admin.service'
import { useI18n } from '@/composables/useI18n'
import { getApiErrorMessage } from '@/utils/api-error'
import { minutesToLabel } from '@/utils/crmCalendar'

const { t } = useI18n()
const auth = useAuthStore()
const crm = useCrmStore()

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

type RuleDraft = { dayOfWeek: number; startMinutes: number; endMinutes: number }
const rules = ref<RuleDraft[]>([])
const timezone = ref('Europe/Madrid')
const availabilitySaved = ref(false)

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

function parseTimeToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function minutesInput(minutes: number) {
  return minutesToLabel(minutes)
}

function addRule() {
  rules.value.push({ dayOfWeek: 1, startMinutes: 9 * 60, endMinutes: 17 * 60 })
}

function removeRule(index: number) {
  rules.value.splice(index, 1)
}

async function loadAvailability() {
  await crm.fetchAvailability()
  if (crm.availability) {
    timezone.value = crm.availability.timezone || 'Europe/Madrid'
    rules.value = crm.availability.rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startMinutes: r.startMinutes,
      endMinutes: r.endMinutes,
    }))
  }
}

async function saveAvailability() {
  availabilitySaved.value = false
  try {
    await crm.saveAvailability({
      timezone: timezone.value,
      rules: rules.value.map((r) => ({
        dayOfWeek: r.dayOfWeek,
        startMinutes: r.startMinutes,
        endMinutes: r.endMinutes,
      })),
    })
    availabilitySaved.value = true
  } catch {
    /* error on store */
  }
}

onMounted(() => {
  void loadAvailability()
})
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
      <h2 class="font-heading text-xl font-bold text-text mb-1">{{ t('admin.crm.availability_title') }}</h2>
      <p class="text-sm text-text-muted mb-4">{{ t('admin.crm.availability_subtitle') }}</p>

      <p v-if="crm.availabilityLoading" class="text-sm text-text-muted mb-3">{{ t('admin.crm.loading') }}</p>
      <p v-if="crm.availabilityError" class="text-sm text-red-600 mb-3">{{ crm.availabilityError }}</p>

      <label class="flex flex-col gap-1 text-xs text-text-muted mb-4 max-w-xs">
        {{ t('admin.crm.availability_timezone') }}
        <input
          v-model="timezone"
          type="text"
          class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm text-text"
        />
      </label>

      <ul class="space-y-3 mb-4">
        <li
          v-for="(rule, index) in rules"
          :key="index"
          class="flex flex-wrap items-end gap-2 border border-gray-light rounded-radius-sm p-3"
        >
          <label class="flex flex-col gap-1 text-xs text-text-muted">
            {{ t('admin.crm.day_of_week') }}
            <select
              v-model.number="rule.dayOfWeek"
              class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm text-text"
            >
              <option v-for="d in 7" :key="d" :value="d">{{ t(`admin.crm.day_${d}`) }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs text-text-muted">
            {{ t('admin.crm.start_time') }}
            <input
              type="time"
              class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
              :value="minutesInput(rule.startMinutes)"
              @change="rule.startMinutes = parseTimeToMinutes(($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="flex flex-col gap-1 text-xs text-text-muted">
            {{ t('admin.crm.end_time') }}
            <input
              type="time"
              class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
              :value="minutesInput(rule.endMinutes)"
              @change="rule.endMinutes = parseTimeToMinutes(($event.target as HTMLInputElement).value)"
            />
          </label>
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light px-3 py-2 text-xs font-semibold text-text hover:bg-surface"
            @click="removeRule(index)"
          >
            {{ t('admin.crm.remove_rule') }}
          </button>
        </li>
      </ul>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-radius-sm border border-gray-light px-3 py-2 text-xs font-semibold text-text hover:bg-surface"
          @click="addRule"
        >
          {{ t('admin.crm.add_rule') }}
        </button>
        <button
          type="button"
          class="rounded-radius-sm bg-deep px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          :disabled="crm.availabilityLoading"
          @click="saveAvailability"
        >
          {{ t('admin.crm.availability_save') }}
        </button>
      </div>
      <p v-if="availabilitySaved" class="mt-3 text-sm text-green-700">{{ t('admin.crm.availability_saved') }}</p>
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
