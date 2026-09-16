<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLocaleStore } from '@/stores/locale'
import * as crmService from '@/services/crm.service'
import type { BookingSlot, LeadInterestType } from '@/types/api'
import { addDays, toIsoLocalDate } from '@/utils/crmCalendar'
import { getApiErrorMessage } from '@/utils/api-error'

const { t } = useI18n()
const route = useRoute()
const localeStore = useLocaleStore()

const interestType = ref<LeadInterestType>(
  route.query.interest === 'logistics_service'
    ? 'logistics_service'
    : route.query.interest === 'pim_training'
      ? 'pim_training'
      : 'pim_service',
)

const email = ref('')
const company = ref('')
const name = ref('')
const phone = ref('')
const selectedSlot = ref<BookingSlot | null>(null)
const slots = ref<BookingSlot[]>([])
const loadingSlots = ref(false)
const submitting = ref(false)
const errorMsg = ref<string | null>(null)
const success = ref(false)

const rangeFrom = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})
const rangeTo = computed(() => addDays(rangeFrom.value, 14))

async function loadSlots() {
  loadingSlots.value = true
  errorMsg.value = null
  selectedSlot.value = null
  try {
    slots.value = await crmService.listBookingSlots({
      from: rangeFrom.value.toISOString(),
      to: rangeTo.value.toISOString(),
      interestType: interestType.value,
    })
  } catch (e) {
    errorMsg.value = getApiErrorMessage(e)
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
}

watch(interestType, () => {
  void loadSlots()
})

onMounted(() => {
  void loadSlots()
})

function formatSlot(slot: BookingSlot) {
  const start = new Date(slot.startsAt)
  const end = new Date(slot.endsAt)
  return `${start.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })} – ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
}

async function submit() {
  if (!selectedSlot.value || !email.value.trim()) return
  submitting.value = true
  errorMsg.value = null
  success.value = false
  try {
    await crmService.createBooking({
      startsAt: selectedSlot.value.startsAt,
      endsAt: selectedSlot.value.endsAt,
      email: email.value.trim(),
      ...(company.value.trim() ? { company: company.value.trim() } : {}),
      ...(name.value.trim() ? { name: name.value.trim() } : {}),
      ...(phone.value.trim() ? { phone: phone.value.trim() } : {}),
      interestType: interestType.value,
      locale: localeStore.lang,
    })
    success.value = true
    selectedSlot.value = null
    await loadSlots()
  } catch (e) {
    errorMsg.value = getApiErrorMessage(e) || t('book.error')
  } finally {
    submitting.value = false
  }
}

const inputClass = 'w-full rounded-radius-sm border border-gray-light px-3 py-2 text-sm'
</script>

<template>
  <div class="min-h-screen bg-surface px-[5%] py-12">
    <div class="mx-auto max-w-xl rounded-radius border border-gray-light bg-white p-6 sm:p-8">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('book.title') }}</h1>
      <p class="text-sm text-text-muted mb-6">{{ t('book.subtitle') }}</p>

      <p v-if="success" class="mb-4 rounded-radius-sm bg-green-50 text-green-800 text-sm px-3 py-2">
        {{ t('book.success') }}
      </p>
      <p v-if="errorMsg" class="mb-4 rounded-radius-sm bg-red-50 text-red-700 text-sm px-3 py-2">
        {{ errorMsg }}
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <label class="flex flex-col gap-1 text-xs text-text-muted">
          {{ t('book.interest') }}
          <select v-model="interestType" class="text-sm text-text" :class="inputClass">
            <option value="pim_service">{{ t('lead.interest.pim_service') }}</option>
            <option value="logistics_service">{{ t('lead.interest.logistics_service') }}</option>
            <option value="pim_training">{{ t('lead.interest.pim_training') }}</option>
          </select>
        </label>

        <label class="flex flex-col gap-1 text-xs text-text-muted">
          {{ t('book.email') }}
          <input v-model="email" type="email" required :class="inputClass" />
        </label>
        <label class="flex flex-col gap-1 text-xs text-text-muted">
          {{ t('book.company') }}
          <input v-model="company" type="text" :class="inputClass" />
        </label>
        <label class="flex flex-col gap-1 text-xs text-text-muted">
          {{ t('book.name') }}
          <input v-model="name" type="text" :class="inputClass" />
        </label>
        <label class="flex flex-col gap-1 text-xs text-text-muted">
          {{ t('book.phone') }}
          <input v-model="phone" type="tel" :class="inputClass" />
        </label>

        <fieldset>
          <legend class="text-xs text-text-muted mb-2">
            {{ t('book.slots') }}
            <span class="text-text-muted/70">
              ({{ toIsoLocalDate(rangeFrom) }} → {{ toIsoLocalDate(addDays(rangeFrom, 13)) }})
            </span>
          </legend>
          <p v-if="loadingSlots" class="text-sm text-text-muted">{{ t('book.loading_slots') }}</p>
          <p v-else-if="!slots.length" class="text-sm text-text-muted">{{ t('book.no_slots') }}</p>
          <ul v-else class="space-y-2 max-h-64 overflow-y-auto">
            <li v-for="slot in slots" :key="slot.startsAt">
              <label
                class="flex items-center gap-2 rounded-radius-sm border px-3 py-2 text-sm cursor-pointer"
                :class="
                  selectedSlot?.startsAt === slot.startsAt
                    ? 'border-deep bg-blue/10'
                    : 'border-gray-light hover:bg-surface'
                "
              >
                <input
                  type="radio"
                  name="slot"
                  class="accent-deep"
                  :checked="selectedSlot?.startsAt === slot.startsAt"
                  @change="selectedSlot = slot"
                />
                {{ formatSlot(slot) }}
              </label>
            </li>
          </ul>
        </fieldset>

        <button
          type="submit"
          class="rounded-radius-sm bg-deep text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-40"
          :disabled="submitting || !selectedSlot || !email.trim()"
        >
          {{ submitting ? t('book.submitting') : t('book.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>
