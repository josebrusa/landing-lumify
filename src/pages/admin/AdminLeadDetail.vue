<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'
import type { LeadEmailDelivery } from '@/types/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const leadsStore = useLeadsStore()

const leadId = computed(() => String(route.params.id ?? ''))
const lead = computed(() => leadsStore.leadDetail)

watch(
  leadId,
  (id) => {
    if (id) void leadsStore.fetchLeadDetail(id)
  },
  { immediate: true },
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function goBack() {
  router.push({ name: 'admin-home' })
}

function ackStatusLabel(delivery: LeadEmailDelivery) {
  if (delivery === 'queued') return t('admin.leads.ack_status_queued')
  if (delivery === 'sent') return t('admin.leads.ack_status_sent')
  return t('admin.leads.ack_status_failed')
}

function ackStatusClass(delivery: LeadEmailDelivery) {
  if (delivery === 'queued') return 'bg-amber-100 text-amber-800'
  if (delivery === 'sent') return 'bg-green-100 text-green-800'
  return 'bg-red-100 text-red-800'
}
</script>

<template>
  <div class="max-w-3xl">
    <button
      type="button"
      class="mb-4 rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
      @click="goBack"
    >
      {{ t('admin.leads.back_to_list') }}
    </button>

    <section v-if="leadsStore.leadDetailLoading" class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted">
      {{ t('admin.leads.detail_loading') }}
    </section>

    <section v-else-if="leadsStore.leadDetailError" class="rounded-radius border border-gray-light bg-white p-6 text-sm text-red-600">
      {{ leadsStore.leadDetailError }}
    </section>

    <section v-else-if="lead" class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-2">
        {{ t('admin.leads.detail_title') }}
      </h1>
      <p class="mb-6 text-sm text-text-muted">{{ lead.id }}</p>

      <div class="mb-6 grid grid-cols-1 gap-3 text-sm">
        <p>
          <strong>{{ t('admin.dashboard.company') }}:</strong> {{ lead.company }}
        </p>
        <p>
          <strong>{{ t('admin.dashboard.contact') }}:</strong> {{ lead.email }}
        </p>
        <p>
          <strong>{{ t('admin.leads.origin') }}:</strong> {{ lead.sourceSection }} / {{ lead.sourceCardId }}
        </p>
        <p>
          <strong>{{ t('admin.leads.received_at') }}:</strong> {{ formatDate(lead.createdAt) }}
        </p>
        <p>
          <strong>{{ t('admin.dashboard.status') }}:</strong> {{ lead.status }}
        </p>
      </div>

      <div class="rounded-radius-sm border border-gray-light bg-surface p-4">
        <h2 class="mb-2 text-sm font-semibold text-text">{{ t('admin.leads.ack_title') }}</h2>
        <template v-if="lead.answer">
          <p class="mb-2 text-sm text-text-muted">
            <strong>{{ t('admin.leads.ack_sent_at') }}:</strong> {{ formatDate(lead.answer.sentAt) }}
          </p>
          <p class="mb-2 text-sm text-text">
            <span
              class="inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="ackStatusClass(lead.answer.emailDelivery)"
            >
              {{ ackStatusLabel(lead.answer.emailDelivery) }}
            </span>
          </p>
          <p v-if="lead.answer.message" class="text-sm text-text">
            <strong>{{ t('admin.leads.ack_message') }}:</strong> {{ lead.answer.message }}
          </p>
        </template>
        <p v-else class="text-sm text-text-muted">{{ t('admin.leads.ack_missing') }}</p>
      </div>
    </section>

    <section v-else class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted">
      {{ t('admin.leads.not_found') }}
    </section>
  </div>
</template>
