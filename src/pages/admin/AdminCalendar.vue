<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useCrmStore } from '@/stores/crm'
import { addDays, startOfWeekMonday, toIsoLocalDate } from '@/utils/crmCalendar'
import { buildMeetingIcs, downloadIcsFile } from '@/utils/crmCalendar'
import * as crmService from '@/services/crm.service'
import type { CrmMeeting } from '@/types/api'

const { t } = useI18n()
const router = useRouter()
const crm = useCrmStore()

const weekAnchor = ref(startOfWeekMonday(new Date()))

const weekStart = computed(() => startOfWeekMonday(weekAnchor.value))
const weekEnd = computed(() => addDays(weekStart.value, 7))

const days = computed(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)))

const meetingsByDay = computed(() => {
  const map = new Map<string, CrmMeeting[]>()
  for (const d of days.value) {
    map.set(toIsoLocalDate(d), [])
  }
  for (const m of crm.meetings) {
    const key = toIsoLocalDate(new Date(m.startsAt))
    const list = map.get(key)
    if (list) list.push(m)
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  }
  return map
})

function formatDayHeader(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

async function refresh() {
  await crm.fetchMeetings(weekStart.value.toISOString(), weekEnd.value.toISOString())
}

function prevWeek() {
  weekAnchor.value = addDays(weekStart.value, -7)
}

function nextWeek() {
  weekAnchor.value = addDays(weekStart.value, 7)
}

function thisWeek() {
  weekAnchor.value = startOfWeekMonday(new Date())
}

watch(weekStart, () => {
  void refresh()
})

onMounted(() => {
  void refresh()
})

async function downloadIcs(meetingId: string) {
  const meeting = crm.meetings.find((m) => m.id === meetingId)
  if (!meeting) return
  try {
    const blob = await crmService.downloadMeetingIcs(meetingId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${meetingId}.ics`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    downloadIcsFile(`meeting-${meetingId}.ics`, buildMeetingIcs(meeting, 'Lumify meeting'))
  }
}

const btnSecondary =
  'rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text hover:bg-surface'
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-radius border border-gray-light bg-white p-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('admin.crm.calendar_title') }}</h1>
        <p class="text-sm text-text-muted">{{ t('admin.crm.calendar_subtitle') }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" :class="btnSecondary" @click="prevWeek">{{ t('admin.crm.prev_week') }}</button>
        <button type="button" :class="btnSecondary" @click="thisWeek">{{ t('admin.crm.this_week') }}</button>
        <button type="button" :class="btnSecondary" @click="nextWeek">{{ t('admin.crm.next_week') }}</button>
      </div>
    </section>

    <p v-if="crm.meetingsLoading" class="text-sm text-text-muted">{{ t('admin.crm.loading') }}</p>
    <p v-else-if="crm.meetingsError" class="text-sm text-red-600">{{ crm.meetingsError }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-3">
      <section
        v-for="day in days"
        :key="toIsoLocalDate(day)"
        class="rounded-radius border border-gray-light bg-white p-3 min-h-[160px]"
      >
        <h2 class="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
          {{ formatDayHeader(day) }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="m in meetingsByDay.get(toIsoLocalDate(day)) || []"
            :key="m.id"
            class="rounded-radius-sm border border-blue/20 bg-blue/5 p-2 text-xs"
          >
            <button
              type="button"
              class="text-left w-full font-semibold text-deep hover:underline"
              @click="router.push({ name: 'admin-opportunity-detail', params: { id: m.opportunityId } })"
            >
              {{ formatTime(m.startsAt) }} – {{ formatTime(m.endsAt) }}
            </button>
            <p class="text-text-muted mt-1">{{ t(`admin.crm.meeting_${m.type === 'follow_up' ? 'follow_up' : m.type}`) }}</p>
            <button type="button" class="mt-1 text-deep underline" @click="downloadIcs(m.id)">
              {{ t('admin.crm.download_ics') }}
            </button>
          </li>
        </ul>
        <p
          v-if="!(meetingsByDay.get(toIsoLocalDate(day)) || []).length"
          class="text-xs text-text-muted"
        >
          —
        </p>
      </section>
    </div>

    <p
      v-if="!crm.meetingsLoading && !crm.meetingsError && crm.meetings.length === 0"
      class="text-sm text-text-muted"
    >
      {{ t('admin.crm.no_meetings_week') }}
    </p>
  </div>
</template>
