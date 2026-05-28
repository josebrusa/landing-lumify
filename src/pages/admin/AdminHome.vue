<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'
import type { LeadInterestType, LeadStatus } from '@/types/api'

const { t } = useI18n()
const router = useRouter()
const leadsStore = useLeadsStore()

const table = computed(() => leadsStore.adminTable)
const totalPages = computed(() => Math.max(1, Math.ceil(table.value.total / table.value.limit)))

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function openLeadDetail(leadId: string) {
  router.push({ name: 'admin-lead-detail', params: { id: leadId } })
}

function formatYmd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const tz = ref('Europe/Madrid')
const to = ref(formatYmd(new Date()))
const from = ref(formatYmd(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)))

async function refreshInsights() {
  await Promise.all([
    leadsStore.fetchKpis({ from: from.value, to: to.value, tz: tz.value }),
    leadsStore.fetchTimeseries({ from: from.value, to: to.value, tz: tz.value, interval: 'day' }),
  ])
}

function statusLabel(status: LeadStatus) {
  if (status === 'new') return t('admin.leads.status_new')
  if (status === 'in_progress') return t('admin.leads.status_in_progress')
  if (status === 'answered') return t('admin.leads.status_answered')
  return t('admin.leads.status_closed')
}

function toggleSortDir() {
  const next = table.value.sortDir === 'desc' ? 'asc' : 'desc'
  leadsStore.setAdminSort(table.value.sortBy, next)
}

function setSortBy(value: string) {
  leadsStore.setAdminSort(value as 'createdAt' | 'seenAt' | 'answeredAt', table.value.sortDir)
}

function setInterest(value: string) {
  leadsStore.setAdminInterest(value as 'all' | LeadInterestType)
}

function setStatus(value: string) {
  leadsStore.setAdminStatus(value as 'all' | LeadStatus)
}

function setSeen(value: string) {
  leadsStore.setAdminSeen(value as 'all' | 'seen' | 'unseen')
}

onMounted(() => {
  void leadsStore.fetchSummary()
  void leadsStore.refreshAdminTable()
  void refreshInsights()
})

watch([from, to, tz], () => {
  void refreshInsights()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('admin.dashboard.title') }}</h1>
      <p class="text-sm text-text-muted mb-4">{{ t('admin.dashboard.subtitle') }}</p>

      <div v-if="leadsStore.summaryLoading" class="text-sm text-text-muted">
        {{ t('admin.leads.summary_loading') }}
      </div>
      <p v-else-if="leadsStore.summaryError" class="text-sm text-red-600">
        {{ leadsStore.summaryError }}
      </p>
      <div v-else-if="leadsStore.summary" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">{{ t('admin.leads.kpi_new') }}</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.summary.totals.new }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">{{ t('admin.leads.kpi_in_progress') }}</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.summary.totals.inProgress }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">{{ t('admin.leads.kpi_answered') }}</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.summary.totals.answered }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">{{ t('admin.leads.kpi_closed') }}</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.summary.totals.closed }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">{{ t('admin.leads.kpi_all') }}</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.summary.totals.all }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="font-heading text-lg font-bold text-text">Leads KPIs</h2>
          <p class="text-sm text-text-muted">from/to en {{ tz }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          <label class="flex items-center gap-2">
            <span>From</span>
            <input
              v-model="from"
              type="date"
              class="h-8 rounded-radius-sm border border-gray-light bg-white px-2 text-xs text-text"
            />
          </label>
          <label class="flex items-center gap-2">
            <span>To</span>
            <input
              v-model="to"
              type="date"
              class="h-8 rounded-radius-sm border border-gray-light bg-white px-2 text-xs text-text"
            />
          </label>
          <label class="flex items-center gap-2">
            <span>TZ</span>
            <input
              v-model="tz"
              type="text"
              class="h-8 w-40 rounded-radius-sm border border-gray-light bg-white px-2 text-xs text-text"
            />
          </label>
          <button
            type="button"
            class="h-8 rounded-radius-sm border border-gray-light bg-white px-3 font-semibold text-text hover:bg-surface"
            @click="refreshInsights"
          >
            Refresh
          </button>
        </div>
      </div>

      <p v-if="leadsStore.kpisError" class="mb-3 text-sm text-red-600">{{ leadsStore.kpisError }}</p>

      <div v-if="leadsStore.kpisLoading" class="text-sm text-text-muted">Cargando KPIs…</div>
      <div
        v-else-if="leadsStore.kpis"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">Created</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.created }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">Unseen</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.unseen }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">In progress</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.inProgress }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">Answered</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.answered }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">Closed</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.closed }}</p>
        </div>
        <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
          <p class="text-xs font-semibold text-text-muted">Archived</p>
          <p class="mt-1 text-2xl font-bold text-text">{{ leadsStore.kpis.totals.archived }}</p>
        </div>
      </div>

      <div class="mt-5">
        <p v-if="leadsStore.timeseriesError" class="mb-3 text-sm text-red-600">{{ leadsStore.timeseriesError }}</p>
        <div v-if="leadsStore.timeseriesLoading" class="text-sm text-text-muted">Cargando serie…</div>
        <div v-else-if="leadsStore.timeseries?.points?.length" class="overflow-x-auto">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr class="border-b border-gray-light text-left text-text-muted">
                <th class="py-2 pr-4">Date</th>
                <th class="py-2 pr-4">Created</th>
                <th class="py-2 pr-4">Seen</th>
                <th class="py-2 pr-4">Answered</th>
                <th class="py-2">Closed</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in leadsStore.timeseries.points"
                :key="p.date"
                class="border-b border-gray-light/70 text-text"
              >
                <td class="py-2 pr-4">{{ p.date }}</td>
                <td class="py-2 pr-4">{{ p.created }}</td>
                <td class="py-2 pr-4">{{ p.seen }}</td>
                <td class="py-2 pr-4">{{ p.answered }}</td>
                <td class="py-2">{{ p.closed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-sm text-text-muted">Sin datos de serie para este rango.</div>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-full px-3 py-1.5 text-xs font-semibold"
            :class="table.tab === 'inbox' ? 'bg-deep text-white' : 'bg-surface text-text'"
            @click="leadsStore.setAdminTab('inbox')"
          >
            {{ t('admin.leads.tab_inbox') }}
          </button>
          <button
            type="button"
            class="rounded-full px-3 py-1.5 text-xs font-semibold"
            :class="table.tab === 'history' ? 'bg-deep text-white' : 'bg-surface text-text'"
            @click="leadsStore.setAdminTab('history')"
          >
            {{ t('admin.leads.tab_history') }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <label class="flex items-center gap-2 text-xs text-text-muted">
            <span>{{ t('admin.leads.filter_interest') }}</span>
            <select
              class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
              :value="table.interest"
              @change="setInterest(($event.target as HTMLSelectElement).value)"
            >
              <option value="all">{{ t('admin.leads.interest_all') }}</option>
              <option value="pim_service">{{ t('admin.leads.interest_service') }}</option>
              <option value="pim_training">{{ t('admin.leads.interest_training') }}</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-xs text-text-muted">
            <span>{{ t('admin.leads.filter_status') }}</span>
            <select
              class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
              :value="table.status"
              @change="setStatus(($event.target as HTMLSelectElement).value)"
            >
              <option value="all">{{ t('admin.leads.filter_all') }}</option>
              <option value="new">{{ t('admin.leads.status_new') }}</option>
              <option value="in_progress">{{ t('admin.leads.status_in_progress') }}</option>
              <option value="answered">{{ t('admin.leads.status_answered') }}</option>
              <option value="closed">{{ t('admin.leads.status_closed') }}</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-xs text-text-muted">
            <span>{{ t('admin.leads.filter_seen') }}</span>
            <select
              class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
              :value="table.seen"
              @change="setSeen(($event.target as HTMLSelectElement).value)"
            >
              <option value="all">{{ t('admin.leads.seen_all') }}</option>
              <option value="unseen">{{ t('admin.leads.seen_unseen') }}</option>
              <option value="seen">{{ t('admin.leads.seen_seen') }}</option>
            </select>
          </label>

          <input
            class="h-8 w-56 rounded-radius-sm border border-gray-light bg-white px-3 text-xs text-text"
            :placeholder="t('admin.leads.search_placeholder')"
            :value="table.search"
            @input="leadsStore.setAdminSearch(($event.target as HTMLInputElement).value)"
          />

          <label class="flex items-center gap-2 text-xs text-text-muted">
            <span>{{ t('admin.leads.sort_by') }}</span>
            <select
              class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
              :value="table.sortBy"
              @change="setSortBy(($event.target as HTMLSelectElement).value)"
            >
              <option value="createdAt">{{ t('admin.leads.sort_created_at') }}</option>
              <option value="seenAt">{{ t('admin.leads.sort_seen_at') }}</option>
              <option value="answeredAt">{{ t('admin.leads.sort_answered_at') }}</option>
            </select>
          </label>
          <button
            type="button"
            class="rounded-full border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
            @click="toggleSortDir"
          >
            {{ table.sortDir === 'desc' ? t('admin.leads.sort_desc') : t('admin.leads.sort_asc') }}
          </button>
        </div>
      </div>

      <p v-if="table.error" class="mb-3 text-sm text-red-600">{{ table.error }}</p>

      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-light text-left text-text-muted">
              <th class="py-2 pr-4">ID</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.company') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.contact') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.origin') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.received_at') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.seen_at') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.answered_at') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.status') }}</th>
              <th class="py-2">{{ t('admin.leads.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="table.loading">
              <td colspan="9" class="py-4 text-text-muted">{{ t('admin.leads.table_loading') }}</td>
            </tr>

            <template v-else-if="table.items.length">
              <tr
                v-for="item in table.items"
                :key="item.id"
                class="cursor-pointer border-b border-gray-light/70 text-text hover:bg-surface"
                @click="openLeadDetail(item.id)"
              >
                <td class="py-3 pr-4">{{ item.id }}</td>
                 <td class="py-3 pr-4">{{ item.company || '-' }}</td>
                 <td class="py-3 pr-4">{{ item.email }}</td>
                 <td class="py-3 pr-4">
                   {{ item.sourcePage }} / {{ item.sourceSection }} / {{ item.sourceCardId }}
                 </td>
                 <td class="py-3 pr-4">{{ formatDate(item.createdAt) }}</td>
                <td class="py-3 pr-4">
                  <span v-if="item.seenAt" class="text-text">{{ formatDate(item.seenAt) }}</span>
                  <span v-else class="text-text-muted">{{ t('admin.leads.unseen') }}</span>
                </td>
                <td class="py-3 pr-4">
                  <span v-if="item.answeredAt" class="text-text">{{ formatDate(item.answeredAt) }}</span>
                  <span v-else class="text-text-muted">-</span>
                </td>
                <td class="py-3 pr-4">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      item.status === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'in_progress'
                          ? 'bg-blue/10 text-blue'
                          : item.status === 'closed'
                            ? 'bg-gray-light text-text'
                            : 'bg-amber-100 text-amber-800'
                    "
                  >
                    {{ statusLabel(item.status) }}
                  </span>
                </td>
                <td class="py-3 font-semibold text-deep">{{ t('admin.leads.open') }}</td>
              </tr>
            </template>

            <tr v-else>
              <td colspan="9" class="py-4 text-text-muted">{{ t('admin.leads.empty_filtered') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!table.loading && table.total > table.limit"
        class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted"
      >
        <span>
          {{ t('admin.leads.page_of', { page: table.page, total: totalPages }) }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="table.page <= 1"
            @click="leadsStore.setAdminPage(table.page - 1)"
          >
            {{ t('admin.leads.prev_page') }}
          </button>
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="table.page >= totalPages"
            @click="leadsStore.setAdminPage(table.page + 1)"
          >
            {{ t('admin.leads.next_page') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
