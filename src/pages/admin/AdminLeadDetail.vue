<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'
import AdminModal from '@/components/admin/AdminModal.vue'
import type { AxiosError } from 'axios'
import type { LeadClosedReason, LeadEmailDelivery, LeadStatus, HttpErrorBody } from '@/types/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const leadsStore = useLeadsStore()

const leadId = computed(() => String(route.params.id ?? ''))
const lead = computed(() => leadsStore.leadDetail)

const replying = ref(false)
const closing = ref(false)
const replyMessage = ref('')
const closeReason = ref<LeadClosedReason>('other')
const actionError = ref<string | null>(null)
const actionLoading = ref(false)

watch(
  leadId,
  async (id) => {
    if (!id) return
    await leadsStore.fetchLeadDetail(id)
    // Backend marks seenAt when opening; re-fetch to reflect it.
    await leadsStore.fetchLeadDetail(id)
  },
  { immediate: true },
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function goBack() {
  router.push({ name: 'admin-home' })
}

function statusLabel(status: LeadStatus) {
  if (status === 'new') return t('admin.leads.status_new')
  if (status === 'in_progress') return t('admin.leads.status_in_progress')
  if (status === 'answered') return t('admin.leads.status_answered')
  return t('admin.leads.status_closed')
}

async function runAction(fn: () => Promise<void>) {
  actionLoading.value = true
  actionError.value = null
  try {
    await fn()
    if (leadId.value) {
      await leadsStore.fetchLeadDetail(leadId.value)
      await leadsStore.refreshAdminTable()
      await leadsStore.fetchSummary()
    }
  } catch (e) {
    const ax = e as AxiosError<HttpErrorBody>
    const msg = ax.response?.data?.message
    actionError.value =
      (Array.isArray(msg) ? msg.join(', ') : typeof msg === 'string' ? msg : ax.message) || 'Request failed'
  } finally {
    actionLoading.value = false
  }
}

async function startLead() {
  if (!leadId.value) return
  await runAction(() => leadsStore.startLead(leadId.value))
}

function openReply() {
  replyMessage.value = ''
  replying.value = true
}

async function submitReply() {
  if (!leadId.value) return
  const msg = replyMessage.value.trim()
  if (!msg) return
  await runAction(async () => {
    await leadsStore.replyLead(leadId.value, msg)
  })
  replying.value = false
}

function openClose() {
  closeReason.value = 'other'
  closing.value = true
}

async function submitClose() {
  if (!leadId.value) return
  await runAction(() => leadsStore.closeLead(leadId.value, closeReason.value))
  closing.value = false
}

async function toggleArchive() {
  if (!leadId.value || !lead.value) return
  if (lead.value.archivedAt) await runAction(() => leadsStore.unarchiveLead(leadId.value))
  else await runAction(() => leadsStore.archiveLead(leadId.value))
}

async function deleteLead() {
  if (!leadId.value) return
  if (!confirm(t('admin.leads.delete_confirm'))) return
  await runAction(() => leadsStore.deleteLead(leadId.value))
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

      <div class="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface"
          :disabled="actionLoading"
          @click="startLead"
        >
          {{ t('admin.leads.action_start') }}
        </button>
        <button
          type="button"
          class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface"
          :disabled="actionLoading"
          @click="openReply"
        >
          {{ t('admin.leads.action_reply') }}
        </button>
        <button
          type="button"
          class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface"
          :disabled="actionLoading"
          @click="openClose"
        >
          {{ t('admin.leads.action_close') }}
        </button>
        <button
          type="button"
          class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface"
          :disabled="actionLoading"
          @click="toggleArchive"
        >
          {{ lead.archivedAt ? t('admin.leads.action_unarchive') : t('admin.leads.action_archive') }}
        </button>
        <button
          type="button"
          class="rounded-radius-sm border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-40 hover:bg-red-50"
          :disabled="actionLoading"
          @click="deleteLead"
        >
          {{ t('admin.leads.action_delete') }}
        </button>
      </div>

      <p v-if="actionError" class="mb-4 text-sm text-red-600">{{ actionError }}</p>

      <div class="mb-6 grid grid-cols-1 gap-3 text-sm">
        <p>
          <strong>Nombre:</strong> {{ lead.name || '-' }}
        </p>
        <p>
          <strong>{{ t('admin.dashboard.company') }}:</strong> {{ lead.company || '-' }}
        </p>
        <p>
          <strong>{{ t('admin.dashboard.contact') }}:</strong> {{ lead.email }}
        </p>
        <p>
          <strong>Teléfono:</strong> {{ lead.phone || '-' }}
        </p>
        <p v-if="lead.message">
          <strong>Mensaje:</strong> {{ lead.message }}
        </p>
        <p>
          <strong>{{ t('admin.leads.origin') }}:</strong>
          {{ lead.sourcePage }} / {{ lead.sourceSection }} / {{ lead.sourceCardId }} / {{ lead.sourceCta }}
        </p>
        <p>
          <strong>{{ t('admin.leads.received_at') }}:</strong> {{ formatDate(lead.createdAt) }}
        </p>
        <p>
          <strong>{{ t('admin.dashboard.status') }}:</strong> {{ statusLabel(lead.status) }}
        </p>
        <p>
          <strong>{{ t('admin.leads.seen_at') }}:</strong>
          <span v-if="lead.seenAt">{{ formatDate(lead.seenAt) }}</span>
          <span v-else class="text-text-muted">{{ t('admin.leads.unseen') }}</span>
        </p>
        <p>
          <strong>{{ t('admin.leads.answered_at') }}:</strong>
          <span v-if="lead.answeredAt">{{ formatDate(lead.answeredAt) }}</span>
          <span v-else class="text-text-muted">-</span>
        </p>
        <p>
          <strong>Cerrada:</strong>
          <span v-if="lead.closedAt">{{ formatDate(lead.closedAt) }}</span>
          <span v-else class="text-text-muted">-</span>
        </p>
        <p>
          <strong>{{ t('admin.leads.archived_at') }}:</strong>
          <span v-if="lead.archivedAt">{{ formatDate(lead.archivedAt) }}</span>
          <span v-else class="text-text-muted">-</span>
        </p>
        <p>
          <strong>{{ t('admin.leads.closed_reason') }}:</strong>
          <span v-if="lead.closedReason">{{ lead.closedReason }}</span>
          <span v-else class="text-text-muted">-</span>
        </p>
        <p v-if="lead.deletedAt">
          <strong>{{ t('admin.leads.deleted_at') }}:</strong> {{ formatDate(lead.deletedAt) }}
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

  <AdminModal
    :open="replying"
    :title="t('admin.leads.reply_title')"
    :description="t('admin.leads.reply_desc')"
    @close="replying = false"
  >
    <textarea
      v-model="replyMessage"
      rows="6"
      class="w-full rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-sm text-text"
      :placeholder="t('admin.leads.reply_placeholder')"
    />
    <div class="mt-4 flex justify-end gap-2">
      <button
        type="button"
        class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text hover:bg-surface"
        @click="replying = false"
      >
        {{ t('admin.leads.cancel') }}
      </button>
      <button
        type="button"
        class="rounded-radius-sm bg-deep px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        :disabled="actionLoading || replyMessage.trim() === ''"
        @click="submitReply"
      >
        {{ t('admin.leads.send') }}
      </button>
    </div>
  </AdminModal>

  <AdminModal
    :open="closing"
    :title="t('admin.leads.close_title')"
    :description="t('admin.leads.close_desc')"
    @close="closing = false"
  >
    <label class="block text-sm text-text">
      <span class="text-xs font-semibold text-text-muted">{{ t('admin.leads.close_reason') }}</span>
      <select
        v-model="closeReason"
        class="mt-2 w-full rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-sm text-text"
      >
        <option value="won">won</option>
        <option value="lost">lost</option>
        <option value="no_fit">no_fit</option>
        <option value="spam">spam</option>
        <option value="other">other</option>
      </select>
    </label>
    <div class="mt-4 flex justify-end gap-2">
      <button
        type="button"
        class="rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text hover:bg-surface"
        @click="closing = false"
      >
        {{ t('admin.leads.cancel') }}
      </button>
      <button
        type="button"
        class="rounded-radius-sm bg-deep px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        :disabled="actionLoading"
        @click="submitClose"
      >
        {{ t('admin.leads.confirm_close') }}
      </button>
    </div>
  </AdminModal>
</template>
