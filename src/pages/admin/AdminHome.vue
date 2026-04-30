<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'

const { t } = useI18n()
const router = useRouter()
const leadsStore = useLeadsStore()

const serviceTable = computed(() => leadsStore.serviceTable)
const trainingTable = computed(() => leadsStore.trainingTable)

const serviceTotalPages = computed(() =>
  Math.max(1, Math.ceil(serviceTable.value.total / serviceTable.value.limit)),
)
const trainingTotalPages = computed(() =>
  Math.max(1, Math.ceil(trainingTable.value.total / trainingTable.value.limit)),
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function openLeadDetail(leadId: string) {
  router.push({ name: 'admin-lead-detail', params: { id: leadId } })
}

function statusLabel(status: 'new' | 'answered') {
  return status === 'answered'
    ? t('admin.leads.status_answered')
    : t('admin.leads.status_new')
}

function toggleSortDir(key: 'service' | 'training') {
  const table = key === 'service' ? serviceTable.value : trainingTable.value
  const next = table.sortDir === 'desc' ? 'asc' : 'desc'
  if (key === 'service') leadsStore.setServiceSort(table.sortBy, next)
  else leadsStore.setTrainingSort(table.sortBy, next)
}

function setSortBy(key: 'service' | 'training', sortBy: 'createdAt' | 'answeredAt') {
  const table = key === 'service' ? serviceTable.value : trainingTable.value
  if (key === 'service') leadsStore.setServiceSort(sortBy, table.sortDir)
  else leadsStore.setTrainingSort(sortBy, table.sortDir)
}

onMounted(() => {
  void leadsStore.fetchSummary()
  void leadsStore.refreshAdminTable('service')
  void leadsStore.refreshAdminTable('training')
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
      <div v-else-if="leadsStore.summary" class="flex flex-wrap gap-3">
        <div class="inline-flex items-center rounded-full bg-deep/10 px-4 py-2 text-sm text-deep">
          {{ t('admin.leads.badge_totals_new') }}:
          <strong class="ml-1">{{ leadsStore.summary.totals.new }}</strong>
        </div>
        <div class="inline-flex items-center rounded-full bg-surface px-4 py-2 text-sm text-text">
          {{ t('admin.leads.badge_service_new') }}:
          <strong class="ml-1">{{ leadsStore.summary.service.new }}</strong>
        </div>
        <div class="inline-flex items-center rounded-full bg-surface px-4 py-2 text-sm text-text">
          {{ t('admin.leads.badge_training_new') }}:
          <strong class="ml-1">{{ leadsStore.summary.training.new }}</strong>
        </div>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-4">
        {{ t('admin.leads.services_table') }}
      </h2>
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceTable.filter === 'all' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setServiceFilter('all')"
        >
          {{ t('admin.leads.filter_all') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceTable.filter === 'new' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setServiceFilter('new')"
        >
          {{ t('admin.leads.filter_new') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceTable.filter === 'answered' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setServiceFilter('answered')"
        >
          {{ t('admin.leads.filter_answered') }}
        </button>
        <span class="mx-2 hidden h-4 w-px bg-gray-light sm:inline-block" aria-hidden="true" />
        <label class="flex items-center gap-2 text-xs text-text-muted">
          <span>{{ t('admin.leads.sort_by') }}</span>
          <select
            class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
            :value="serviceTable.sortBy"
            @change="
              setSortBy('service', ($event.target as HTMLSelectElement).value as 'createdAt' | 'answeredAt')
            "
          >
            <option value="createdAt">{{ t('admin.leads.sort_created_at') }}</option>
            <option value="answeredAt">{{ t('admin.leads.sort_answered_at') }}</option>
          </select>
        </label>
        <button
          type="button"
          class="rounded-full border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
          @click="toggleSortDir('service')"
        >
          {{
            serviceTable.sortDir === 'desc' ? t('admin.leads.sort_desc') : t('admin.leads.sort_asc')
          }}
        </button>
      </div>
      <p v-if="serviceTable.error" class="mb-3 text-sm text-red-600">{{ serviceTable.error }}</p>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-light text-left text-text-muted">
              <th class="py-2 pr-4">ID</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.company') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.contact') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.origin') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.received_at') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.status') }}</th>
              <th class="py-2">{{ t('admin.leads.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="serviceTable.loading">
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.table_loading') }}</td>
            </tr>
            <template v-else-if="serviceTable.items.length">
              <tr
                v-for="item in serviceTable.items"
                :key="item.id"
                class="cursor-pointer border-b border-gray-light/70 text-text hover:bg-surface"
                @click="openLeadDetail(item.id)"
              >
                <td class="py-3 pr-4">{{ item.id }}</td>
                <td class="py-3 pr-4">{{ item.company }}</td>
                <td class="py-3 pr-4">{{ item.email }}</td>
                <td class="py-3 pr-4">{{ item.sourceSection }} / {{ item.sourceCardId }}</td>
                <td class="py-3 pr-4">{{ formatDate(item.createdAt) }}</td>
                <td class="py-3 pr-4">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      item.status === 'answered'
                        ? 'bg-green-100 text-green-800'
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
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.empty_filtered') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="!serviceTable.loading && serviceTable.total > serviceTable.limit"
        class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted"
      >
        <span>
          {{ t('admin.leads.page_of', { page: serviceTable.page, total: serviceTotalPages }) }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="serviceTable.page <= 1"
            @click="leadsStore.setServicePage(serviceTable.page - 1)"
          >
            {{ t('admin.leads.prev_page') }}
          </button>
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="serviceTable.page >= serviceTotalPages"
            @click="leadsStore.setServicePage(serviceTable.page + 1)"
          >
            {{ t('admin.leads.next_page') }}
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-4">
        {{ t('admin.leads.training_table') }}
      </h2>
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingTable.filter === 'all' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setTrainingFilter('all')"
        >
          {{ t('admin.leads.filter_all') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingTable.filter === 'new' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setTrainingFilter('new')"
        >
          {{ t('admin.leads.filter_new') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingTable.filter === 'answered' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="leadsStore.setTrainingFilter('answered')"
        >
          {{ t('admin.leads.filter_answered') }}
        </button>
        <span class="mx-2 hidden h-4 w-px bg-gray-light sm:inline-block" aria-hidden="true" />
        <label class="flex items-center gap-2 text-xs text-text-muted">
          <span>{{ t('admin.leads.sort_by') }}</span>
          <select
            class="rounded-radius-sm border border-gray-light bg-white px-2 py-1 text-xs text-text"
            :value="trainingTable.sortBy"
            @change="
              setSortBy(
                'training',
                ($event.target as HTMLSelectElement).value as 'createdAt' | 'answeredAt',
              )
            "
          >
            <option value="createdAt">{{ t('admin.leads.sort_created_at') }}</option>
            <option value="answeredAt">{{ t('admin.leads.sort_answered_at') }}</option>
          </select>
        </label>
        <button
          type="button"
          class="rounded-full border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
          @click="toggleSortDir('training')"
        >
          {{
            trainingTable.sortDir === 'desc'
              ? t('admin.leads.sort_desc')
              : t('admin.leads.sort_asc')
          }}
        </button>
      </div>
      <p v-if="trainingTable.error" class="mb-3 text-sm text-red-600">{{ trainingTable.error }}</p>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-gray-light text-left text-text-muted">
              <th class="py-2 pr-4">ID</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.company') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.contact') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.origin') }}</th>
              <th class="py-2 pr-4">{{ t('admin.leads.received_at') }}</th>
              <th class="py-2 pr-4">{{ t('admin.dashboard.status') }}</th>
              <th class="py-2">{{ t('admin.leads.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="trainingTable.loading">
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.table_loading') }}</td>
            </tr>
            <template v-else-if="trainingTable.items.length">
              <tr
                v-for="item in trainingTable.items"
                :key="item.id"
                class="cursor-pointer border-b border-gray-light/70 text-text hover:bg-surface"
                @click="openLeadDetail(item.id)"
              >
                <td class="py-3 pr-4">{{ item.id }}</td>
                <td class="py-3 pr-4">{{ item.company }}</td>
                <td class="py-3 pr-4">{{ item.email }}</td>
                <td class="py-3 pr-4">{{ item.sourceSection }} / {{ item.sourceCardId }}</td>
                <td class="py-3 pr-4">{{ formatDate(item.createdAt) }}</td>
                <td class="py-3 pr-4">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      item.status === 'answered'
                        ? 'bg-green-100 text-green-800'
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
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.empty_filtered') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="!trainingTable.loading && trainingTable.total > trainingTable.limit"
        class="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted"
      >
        <span>
          {{ t('admin.leads.page_of', { page: trainingTable.page, total: trainingTotalPages }) }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="trainingTable.page <= 1"
            @click="leadsStore.setTrainingPage(trainingTable.page - 1)"
          >
            {{ t('admin.leads.prev_page') }}
          </button>
          <button
            type="button"
            class="rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 font-semibold text-text disabled:opacity-40"
            :disabled="trainingTable.page >= trainingTotalPages"
            @click="leadsStore.setTrainingPage(trainingTable.page + 1)"
          >
            {{ t('admin.leads.next_page') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
