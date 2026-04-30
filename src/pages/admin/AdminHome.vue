<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'

const { t } = useI18n()
const router = useRouter()
const leadsStore = useLeadsStore()

const serviceLeads = computed(() => leadsStore.servicePendingLeads)
const trainingLeads = computed(() => leadsStore.trainingPendingLeads)
const serviceAnsweredLeads = computed(() => leadsStore.serviceAnsweredLeads)
const trainingAnsweredLeads = computed(() => leadsStore.trainingAnsweredLeads)
const serviceAllLeads = computed(() => leadsStore.serviceLeads)
const trainingAllLeads = computed(() => leadsStore.trainingLeads)

type FilterMode = 'all' | 'new' | 'answered'
const serviceFilter = ref<FilterMode>('new')
const trainingFilter = ref<FilterMode>('new')

const pendingCount = computed(
  () => serviceLeads.value.length + trainingLeads.value.length,
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function openLeadDetail(leadId: string) {
  router.push({ name: 'admin-lead-detail', params: { id: leadId } })
}

const visibleServiceLeads = computed(() => {
  if (serviceFilter.value === 'all') return serviceAllLeads.value
  if (serviceFilter.value === 'answered') return serviceAnsweredLeads.value
  return serviceLeads.value
})

const visibleTrainingLeads = computed(() => {
  if (trainingFilter.value === 'all') return trainingAllLeads.value
  if (trainingFilter.value === 'answered') return trainingAnsweredLeads.value
  return trainingLeads.value
})

function statusLabel(status: 'new' | 'answered') {
  return status === 'answered'
    ? t('admin.leads.status_answered')
    : t('admin.leads.status_new')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('admin.dashboard.title') }}</h1>
      <p class="text-sm text-text-muted mb-4">{{ t('admin.dashboard.subtitle') }}</p>
      <div class="inline-flex items-center rounded-full bg-deep/10 px-4 py-2 text-sm text-deep">
        {{ t('admin.dashboard.pending_badge') }}:
        <strong class="ml-1">{{ pendingCount }}</strong>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-4">
        {{ t('admin.leads.services_table') }}
      </h2>
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceFilter === 'all' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="serviceFilter = 'all'"
        >
          {{ t('admin.leads.filter_all') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceFilter === 'new' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="serviceFilter = 'new'"
        >
          {{ t('admin.leads.filter_new') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="serviceFilter === 'answered' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="serviceFilter = 'answered'"
        >
          {{ t('admin.leads.filter_answered') }}
        </button>
      </div>
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
            <tr
              v-for="item in visibleServiceLeads"
              :key="item.id"
              class="border-b border-gray-light/70 text-text cursor-pointer hover:bg-surface"
              @click="openLeadDetail(item.id)"
            >
              <td class="py-3 pr-4">{{ item.id }}</td>
              <td class="py-3 pr-4">{{ item.company }}</td>
              <td class="py-3 pr-4">{{ item.email }}</td>
              <td class="py-3 pr-4">{{ item.sourceSection }} / {{ item.sourceCardId }}</td>
              <td class="py-3 pr-4">{{ formatDate(item.answeredAt ?? item.createdAt) }}</td>
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
              <td class="py-3 text-deep font-semibold">{{ t('admin.leads.open') }}</td>
            </tr>
            <tr v-if="!visibleServiceLeads.length">
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.empty_filtered') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h2 class="font-heading text-xl font-bold text-text mb-4">
        {{ t('admin.leads.training_table') }}
      </h2>
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingFilter === 'all' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="trainingFilter = 'all'"
        >
          {{ t('admin.leads.filter_all') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingFilter === 'new' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="trainingFilter = 'new'"
        >
          {{ t('admin.leads.filter_new') }}
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="trainingFilter === 'answered' ? 'bg-deep text-white' : 'bg-surface text-text'"
          @click="trainingFilter = 'answered'"
        >
          {{ t('admin.leads.filter_answered') }}
        </button>
      </div>
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
            <tr
              v-for="item in visibleTrainingLeads"
              :key="item.id"
              class="border-b border-gray-light/70 text-text cursor-pointer hover:bg-surface"
              @click="openLeadDetail(item.id)"
            >
              <td class="py-3 pr-4">{{ item.id }}</td>
              <td class="py-3 pr-4">{{ item.company }}</td>
              <td class="py-3 pr-4">{{ item.email }}</td>
              <td class="py-3 pr-4">{{ item.sourceSection }} / {{ item.sourceCardId }}</td>
              <td class="py-3 pr-4">{{ formatDate(item.answeredAt ?? item.createdAt) }}</td>
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
              <td class="py-3 text-deep font-semibold">{{ t('admin.leads.open') }}</td>
            </tr>
            <tr v-if="!visibleTrainingLeads.length">
              <td colspan="7" class="py-4 text-text-muted">{{ t('admin.leads.empty_filtered') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>
