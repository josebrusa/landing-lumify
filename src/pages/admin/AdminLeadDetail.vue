<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'
import { useCrmStore } from '@/stores/crm'
import AdminModal from '@/components/admin/AdminModal.vue'
import type { AxiosError } from 'axios'
import type { LeadClosedReason, LeadEmailDelivery, LeadInterestType, LeadStatus, HttpErrorBody } from '@/types/api'
import {
  leadCardLabelKey,
  leadCtaLabelKey,
  leadSectionLabelKey,
  resolveLeadLabel,
} from '@/data/leadAttribution'
import { safeMailtoHref, safeTelHref } from '@/utils/safe-contact-href'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const leadsStore = useLeadsStore()
const crmStore = useCrmStore()

const leadId = computed(() => String(route.params.id ?? ''))
const lead = computed(() => leadsStore.leadDetail)
const leadMailtoHref = computed(() => safeMailtoHref(lead.value?.email))
const leadTelHref = computed(() => safeTelHref(lead.value?.phone))

const replying = ref(false)
const closing = ref(false)
const replyMessage = ref('')
const closeReason = ref<LeadClosedReason>('other')
const actionError = ref<string | null>(null)
const actionLoading = ref(false)
const converting = ref(false)

function interestLabel(type: LeadInterestType) {
  return resolveLeadLabel(t, `lead.interest.${type}`, type)
}

function sectionLabel(section: string) {
  return resolveLeadLabel(t, leadSectionLabelKey(section), section)
}

function cardLabel(cardId: string) {
  return resolveLeadLabel(t, leadCardLabelKey(cardId), cardId)
}

function ctaLabel(cta: string) {
  return resolveLeadLabel(t, leadCtaLabelKey(cta), cta)
}

watch(
  leadId,
  async (id) => {
    if (!id) return
    await leadsStore.fetchLeadDetail(id)
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

const canStart = computed(() => lead.value?.status === 'new')
const canReply = computed(() => {
  const s = lead.value?.status
  return s === 'new' || s === 'in_progress' || s === 'answered'
})
const canClose = computed(() => {
  const s = lead.value?.status
  return s === 'new' || s === 'in_progress' || s === 'answered'
})
const isTerminal = computed(() => lead.value?.status === 'closed' || Boolean(lead.value?.deletedAt))

const primaryAction = computed(() => {
  if (!lead.value) return null
  if (lead.value.opportunityId) return 'open_crm' as const
  if (lead.value.status === 'new') return 'start' as const
  if (canReply.value) return 'reply' as const
  return 'convert' as const
})

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
      (Array.isArray(msg) ? msg.join(', ') : typeof msg === 'string' ? msg : ax.message) ||
      'Request failed'
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

async function convertToCrm() {
  if (!leadId.value) return
  converting.value = true
  actionError.value = null
  try {
    const opp = await crmStore.convertFromLead(leadId.value)
    await leadsStore.fetchLeadDetail(leadId.value)
    await router.push({ name: 'admin-opportunity-detail', params: { id: opp.id } })
  } catch (e) {
    actionError.value = crmStore.actionError || (e as Error).message
  } finally {
    converting.value = false
  }
}

function openCrm() {
  if (!lead.value?.opportunityId) return
  router.push({ name: 'admin-opportunity-detail', params: { id: lead.value.opportunityId } })
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

const btnPrimary =
  'rounded-radius-sm bg-deep px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-deep/90'
const btnSecondary =
  'rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface'
</script>

<template>
  <div class="max-w-4xl">
    <button
      type="button"
      class="mb-4 rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
      @click="goBack"
    >
      {{ t('admin.leads.back_to_list') }}
    </button>

    <section
      v-if="leadsStore.leadDetailLoading"
      class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted"
    >
      {{ t('admin.leads.detail_loading') }}
    </section>

    <section
      v-else-if="leadsStore.leadDetailError"
      class="rounded-radius border border-gray-light bg-white p-6 text-sm text-red-600"
    >
      {{ leadsStore.leadDetailError }}
    </section>

    <template v-else-if="lead">
      <!-- Header -->
      <section class="rounded-radius border border-gray-light bg-white p-6 mb-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-xs uppercase tracking-wide text-text-muted mb-1">
              {{ t('admin.leads.detail_title') }}
            </p>
            <h1 class="font-heading text-2xl font-bold text-text truncate">
              {{ lead.company || lead.email }}
            </h1>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                class="inline-flex rounded-full bg-blue/15 px-2.5 py-1 text-xs font-semibold text-deep"
              >
                {{ interestLabel(lead.interestType) }}
              </span>
              <span
                class="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text"
              >
                {{ statusLabel(lead.status) }}
              </span>
              <span
                v-if="lead.opportunityId"
                class="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"
              >
                {{ t('admin.crm.in_pipeline') }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-if="primaryAction === 'open_crm'"
              type="button"
              :class="btnPrimary"
              @click="openCrm"
            >
              {{ t('admin.crm.open_opportunity') }}
            </button>
            <button
              v-else-if="primaryAction === 'start'"
              type="button"
              :class="btnPrimary"
              :disabled="actionLoading"
              @click="startLead"
            >
              {{ t('admin.leads.action_start') }}
            </button>
            <button
              v-else-if="primaryAction === 'reply'"
              type="button"
              :class="btnPrimary"
              :disabled="actionLoading"
              @click="openReply"
            >
              {{ t('admin.leads.action_reply') }}
            </button>
            <button
              v-if="!lead.opportunityId"
              type="button"
              :class="btnSecondary"
              :disabled="converting || actionLoading"
              @click="convertToCrm"
            >
              {{ t('admin.crm.convert') }}
            </button>
          </div>
        </div>
        <p v-if="actionError" class="mt-4 text-sm text-red-600">{{ actionError }}</p>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Contact -->
        <section class="rounded-radius border border-gray-light bg-white p-5">
          <h2 class="text-sm font-semibold text-text mb-3">{{ t('admin.crm.block_contact') }}</h2>
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.field_name') }}</dt>
              <dd class="text-text font-medium">{{ lead.name || '—' }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.dashboard.company') }}</dt>
              <dd class="text-text font-medium">{{ lead.company || '—' }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.dashboard.contact') }}</dt>
              <dd>
                <a
                  v-if="leadMailtoHref"
                  class="text-deep font-medium underline"
                  :href="leadMailtoHref"
                  >{{ lead.email }}</a
                >
                <span v-else class="text-text font-medium">{{ lead.email || '—' }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.field_phone') }}</dt>
              <dd>
                <a
                  v-if="leadTelHref"
                  class="text-deep font-medium underline"
                  :href="leadTelHref"
                  >{{ lead.phone }}</a
                >
                <span v-else class="text-text-muted">{{ lead.phone || '—' }}</span>
              </dd>
            </div>
            <div v-if="lead.message">
              <dt class="text-text-muted">{{ t('admin.leads.field_message') }}</dt>
              <dd class="text-text whitespace-pre-wrap">{{ lead.message }}</dd>
            </div>
            <div v-if="lead.locale">
              <dt class="text-text-muted">{{ t('admin.leads.field_locale') }}</dt>
              <dd class="text-text uppercase">{{ lead.locale }}</dd>
            </div>
          </dl>
        </section>

        <!-- Origin -->
        <section class="rounded-radius border border-gray-light bg-white p-5">
          <h2 class="text-sm font-semibold text-text mb-3">{{ t('admin.crm.block_origin') }}</h2>
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.section') }}</dt>
              <dd class="text-text font-medium">{{ sectionLabel(lead.sourceSection) }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.card') }}</dt>
              <dd class="text-text font-medium">{{ cardLabel(lead.sourceCardId) }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.cta') }}</dt>
              <dd class="text-text font-medium">{{ ctaLabel(lead.sourceCta) }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.origin') }}</dt>
              <dd class="text-text">{{ lead.sourcePage }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <!-- Timeline -->
      <section class="rounded-radius border border-gray-light bg-white p-5 mb-4">
        <h2 class="text-sm font-semibold text-text mb-3">{{ t('admin.crm.block_timeline') }}</h2>
        <ol class="space-y-2 text-sm">
          <li class="flex justify-between gap-4 border-b border-gray-light/60 py-2">
            <span class="text-text-muted">{{ t('admin.leads.received_at') }}</span>
            <span class="text-text font-medium">{{ formatDate(lead.createdAt) }}</span>
          </li>
          <li class="flex justify-between gap-4 border-b border-gray-light/60 py-2">
            <span class="text-text-muted">{{ t('admin.leads.seen_at') }}</span>
            <span class="text-text font-medium">
              <template v-if="lead.seenAt">{{ formatDate(lead.seenAt) }}</template>
              <template v-else>{{ t('admin.leads.unseen') }}</template>
            </span>
          </li>
          <li class="flex justify-between gap-4 border-b border-gray-light/60 py-2">
            <span class="text-text-muted">{{ t('admin.leads.answered_at') }}</span>
            <span class="text-text font-medium">{{
              lead.answeredAt ? formatDate(lead.answeredAt) : '—'
            }}</span>
          </li>
          <li class="flex justify-between gap-4 py-2">
            <span class="text-text-muted">{{ t('admin.leads.field_closed_at') }}</span>
            <span class="text-text font-medium">{{
              lead.closedAt ? formatDate(lead.closedAt) : '—'
            }}</span>
          </li>
        </ol>
      </section>

      <!-- Ack -->
      <section class="rounded-radius border border-gray-light bg-white p-5 mb-4">
        <h2 class="mb-2 text-sm font-semibold text-text">{{ t('admin.leads.ack_title') }}</h2>
        <template v-if="lead.answer">
          <p class="mb-2 text-sm text-text-muted">
            <strong>{{ t('admin.leads.ack_sent_at') }}:</strong>
            {{ formatDate(lead.answer.sentAt) }}
          </p>
          <p class="mb-2 text-sm text-text">
            <span
              class="inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="ackStatusClass(lead.answer.emailDelivery)"
            >
              {{ ackStatusLabel(lead.answer.emailDelivery) }}
            </span>
          </p>
          <p v-if="lead.answer.message" class="text-sm text-text whitespace-pre-wrap">
            {{ lead.answer.message }}
          </p>
        </template>
        <p v-else class="text-sm text-text-muted">{{ t('admin.leads.ack_missing') }}</p>
      </section>

      <!-- Secondary actions -->
      <section
        v-if="!isTerminal"
        class="rounded-radius border border-gray-light bg-white p-5 flex flex-wrap gap-2"
      >
        <button
          type="button"
          :class="btnSecondary"
          :disabled="actionLoading || !canStart"
          @click="startLead"
        >
          {{ t('admin.leads.action_start') }}
        </button>
        <button
          type="button"
          :class="btnSecondary"
          :disabled="actionLoading || !canReply"
          @click="openReply"
        >
          {{ t('admin.leads.action_reply') }}
        </button>
        <button
          type="button"
          :class="btnSecondary"
          :disabled="actionLoading || !canClose"
          @click="openClose"
        >
          {{ t('admin.leads.action_close') }}
        </button>
        <button type="button" :class="btnSecondary" :disabled="actionLoading" @click="toggleArchive">
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
      </section>
    </template>

    <section
      v-else
      class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted"
    >
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
      rows="5"
      class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
      :placeholder="t('admin.leads.reply_placeholder')"
    />
    <div class="mt-4 flex justify-end gap-2">
      <button type="button" :class="btnSecondary" @click="replying = false">
        {{ t('admin.leads.cancel') }}
      </button>
      <button
        type="button"
        :class="btnPrimary"
        :disabled="actionLoading || !replyMessage.trim()"
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
    <label class="block text-sm text-text mb-2">{{ t('admin.leads.close_reason') }}</label>
    <select
      v-model="closeReason"
      class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
    >
      <option value="won">{{ t('admin.leads.reason_won') }}</option>
      <option value="lost">{{ t('admin.leads.reason_lost') }}</option>
      <option value="no_fit">{{ t('admin.leads.reason_no_fit') }}</option>
      <option value="spam">{{ t('admin.leads.reason_spam') }}</option>
      <option value="other">{{ t('admin.leads.reason_other') }}</option>
    </select>
    <div class="mt-4 flex justify-end gap-2">
      <button type="button" :class="btnSecondary" @click="closing = false">
        {{ t('admin.leads.cancel') }}
      </button>
      <button type="button" :class="btnPrimary" :disabled="actionLoading" @click="submitClose">
        {{ t('admin.leads.confirm_close') }}
      </button>
    </div>
  </AdminModal>
</template>
