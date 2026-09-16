<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useCrmStore } from '@/stores/crm'
import AdminModal from '@/components/admin/AdminModal.vue'
import type { LeadClosedReason, MeetingType, OpportunityStage } from '@/types/api'
import { resolveLeadLabel } from '@/data/leadAttribution'
import { buildMeetingIcs, downloadIcsFile } from '@/utils/crmCalendar'
import * as crmService from '@/services/crm.service'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const crm = useCrmStore()

const oppId = computed(() => String(route.params.id ?? ''))
const opp = computed(() => crm.opportunityDetail)

const noteBody = ref('')
const followUpLocal = ref('')
const stageDraft = ref<OpportunityStage>('new')
const closeReason = ref<LeadClosedReason>('other')
const scheduling = ref(false)
const meetingNotice = ref<string | null>(null)
const bookLinkCopied = ref(false)

const meetingStart = ref('')
const meetingEnd = ref('')
const meetingType = ref<MeetingType>('discovery')
const meetingUrl = ref('')
const meetingNotes = ref('')

const stages: OpportunityStage[] = [
  'new',
  'qualified',
  'meeting_scheduled',
  'proposal',
  'negotiation',
  'won',
  'lost',
  'nurture',
]

const btnPrimary =
  'rounded-radius-sm bg-deep px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-deep/90'
const btnSecondary =
  'rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-xs font-semibold text-text disabled:opacity-40 hover:bg-surface'

watch(
  oppId,
  async (id) => {
    if (!id) return
    await crm.fetchOpportunity(id)
    if (crm.opportunityDetail) {
      stageDraft.value = crm.opportunityDetail.stage
      followUpLocal.value = crm.opportunityDetail.nextFollowUpAt
        ? toDatetimeLocal(crm.opportunityDetail.nextFollowUpAt)
        : ''
    }
  },
  { immediate: true },
)

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDatetimeLocal(value: string) {
  return new Date(value).toISOString()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function stageLabel(stage: OpportunityStage) {
  return t(`admin.crm.stage_${stage}`)
}

function interestLabel(type: string) {
  return resolveLeadLabel(t, `lead.interest.${type}`, type)
}

function meetingTypeLabel(type: MeetingType) {
  return t(`admin.crm.meeting_${type === 'follow_up' ? 'follow_up' : type}`)
}

async function saveFollowUp() {
  if (!oppId.value) return
  await crm.updateOpportunity(oppId.value, {
    nextFollowUpAt: followUpLocal.value ? fromDatetimeLocal(followUpLocal.value) : null,
  })
}

async function saveStage() {
  if (!oppId.value) return
  const needsReason = stageDraft.value === 'won' || stageDraft.value === 'lost'
  await crm.updateStage(oppId.value, {
    stage: stageDraft.value,
    ...(needsReason ? { closedReason: closeReason.value } : {}),
  })
}

async function addNote() {
  if (!oppId.value || !noteBody.value.trim()) return
  await crm.addActivity(oppId.value, { type: 'note', body: noteBody.value.trim() })
  noteBody.value = ''
}

function openSchedule() {
  const start = new Date()
  start.setMinutes(0, 0, 0)
  start.setHours(start.getHours() + 1)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + 30)
  meetingStart.value = toDatetimeLocal(start.toISOString())
  meetingEnd.value = toDatetimeLocal(end.toISOString())
  meetingType.value = 'discovery'
  meetingUrl.value = ''
  meetingNotes.value = ''
  scheduling.value = true
}

async function createMeeting() {
  if (!oppId.value) return
  meetingNotice.value = null
  await crm.scheduleMeeting({
    opportunityId: oppId.value,
    startsAt: fromDatetimeLocal(meetingStart.value),
    endsAt: fromDatetimeLocal(meetingEnd.value),
    type: meetingType.value,
    ...(meetingUrl.value.trim() ? { locationOrUrl: meetingUrl.value.trim() } : {}),
    ...(meetingNotes.value.trim() ? { notes: meetingNotes.value.trim() } : {}),
  })
  scheduling.value = false
  meetingNotice.value = t('admin.crm.meeting_created_ok')
}

async function copyBookLink() {
  const interest = opp.value?.interestType || 'pim_service'
  const url = `${window.location.origin}/book?interest=${encodeURIComponent(interest)}`
  await navigator.clipboard.writeText(url)
  bookLinkCopied.value = true
  setTimeout(() => {
    bookLinkCopied.value = false
  }, 2000)
}

async function downloadIcs(meetingId: string) {
  const meeting = opp.value?.meetings.find((m) => m.id === meetingId)
  if (!meeting || !opp.value) return
  try {
    const blob = await crmService.downloadMeetingIcs(meetingId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${meetingId}.ics`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    downloadIcsFile(`meeting-${meetingId}.ics`, buildMeetingIcs(meeting, opp.value.title))
  }
}

function goLead() {
  if (!opp.value?.leadInquiryId) return
  router.push({ name: 'admin-lead-detail', params: { id: opp.value.leadInquiryId } })
}
</script>

<template>
  <div class="max-w-4xl">
    <button
      type="button"
      class="mb-4 rounded-radius-sm border border-gray-light bg-white px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface"
      @click="router.push({ name: 'admin-pipeline' })"
    >
      {{ t('admin.crm.back_pipeline') }}
    </button>

    <section v-if="crm.opportunityLoading" class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted">
      {{ t('admin.crm.loading') }}
    </section>
    <section v-else-if="crm.opportunityError" class="rounded-radius border border-gray-light bg-white p-6 text-sm text-red-600">
      {{ crm.opportunityError }}
    </section>
    <template v-else-if="opp">
      <section class="rounded-radius border border-gray-light bg-white p-6 mb-4">
        <div class="flex flex-wrap justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-wide text-text-muted mb-1">{{ t('admin.crm.opp_title') }}</p>
            <h1 class="font-heading text-2xl font-bold text-text">{{ opp.title }}</h1>
            <div class="mt-3 flex flex-wrap gap-2">
              <span class="inline-flex rounded-full bg-blue/15 px-2.5 py-1 text-xs font-semibold text-deep">
                {{ interestLabel(opp.interestType) }}
              </span>
              <span class="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text">
                {{ stageLabel(opp.stage) }}
              </span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" :class="btnPrimary" @click="openSchedule">
              {{ t('admin.crm.schedule_meeting') }}
            </button>
            <button type="button" :class="btnSecondary" @click="copyBookLink">
              {{ bookLinkCopied ? t('admin.crm.book_link_copied') : t('admin.crm.copy_book_link') }}
            </button>
            <button
              v-if="opp.leadInquiryId"
              type="button"
              :class="btnSecondary"
              @click="goLead"
            >
              {{ t('admin.crm.open_lead') }}
            </button>
          </div>
        </div>
        <p v-if="meetingNotice" class="mt-4 text-sm text-green-700">{{ meetingNotice }}</p>
        <p v-if="crm.actionError" class="mt-4 text-sm text-red-600">{{ crm.actionError }}</p>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <section class="rounded-radius border border-gray-light bg-white p-5">
          <h2 class="text-sm font-semibold mb-3">{{ t('admin.crm.block_contact') }}</h2>
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-text-muted">{{ t('admin.dashboard.company') }}</dt>
              <dd class="font-medium">{{ opp.company?.name || '—' }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.field_name') }}</dt>
              <dd class="font-medium">{{ opp.contact.name || '—' }}</dd>
            </div>
            <div>
              <dt class="text-text-muted">Email</dt>
              <dd>
                <a class="text-deep underline font-medium" :href="`mailto:${opp.contact.email}`">{{
                  opp.contact.email
                }}</a>
              </dd>
            </div>
            <div>
              <dt class="text-text-muted">{{ t('admin.leads.field_phone') }}</dt>
              <dd>
                <a
                  v-if="opp.contact.phone"
                  class="text-deep underline font-medium"
                  :href="`tel:${opp.contact.phone}`"
                  >{{ opp.contact.phone }}</a
                >
                <span v-else class="text-text-muted">—</span>
              </dd>
            </div>
          </dl>
        </section>

        <section class="rounded-radius border border-gray-light bg-white p-5 space-y-4">
          <div>
            <label class="block text-xs text-text-muted mb-1">{{ t('admin.crm.next_follow_up') }}</label>
            <div class="flex flex-wrap gap-2">
              <input
                v-model="followUpLocal"
                type="datetime-local"
                class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
              />
              <button type="button" :class="btnSecondary" :disabled="crm.actionLoading" @click="saveFollowUp">
                {{ t('admin.crm.save_follow_up') }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs text-text-muted mb-1">{{ t('admin.crm.change_stage') }}</label>
            <div class="flex flex-wrap gap-2 items-center">
              <select
                v-model="stageDraft"
                class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
              >
                <option v-for="s in stages" :key="s" :value="s">{{ stageLabel(s) }}</option>
              </select>
              <select
                v-if="stageDraft === 'won' || stageDraft === 'lost'"
                v-model="closeReason"
                class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm"
              >
                <option value="won">{{ t('admin.leads.reason_won') }}</option>
                <option value="lost">{{ t('admin.leads.reason_lost') }}</option>
                <option value="no_fit">{{ t('admin.leads.reason_no_fit') }}</option>
                <option value="spam">{{ t('admin.leads.reason_spam') }}</option>
                <option value="other">{{ t('admin.leads.reason_other') }}</option>
              </select>
              <button type="button" :class="btnSecondary" :disabled="crm.actionLoading" @click="saveStage">
                {{ t('admin.settings.save') }}
              </button>
            </div>
          </div>
        </section>
      </div>

      <section class="rounded-radius border border-gray-light bg-white p-5 mb-4">
        <h2 class="text-sm font-semibold mb-3">{{ t('admin.crm.notes') }}</h2>
        <textarea
          v-model="noteBody"
          rows="3"
          class="w-full rounded-radius-sm border border-gray-light px-3 py-2 text-sm mb-2"
          :placeholder="t('admin.crm.note_placeholder')"
        />
        <button type="button" :class="btnPrimary" :disabled="crm.actionLoading || !noteBody.trim()" @click="addNote">
          {{ t('admin.crm.add_note') }}
        </button>
      </section>

      <section class="rounded-radius border border-gray-light bg-white p-5 mb-4">
        <h2 class="text-sm font-semibold mb-3">{{ t('admin.crm.activities') }}</h2>
        <p v-if="!opp.activities?.length" class="text-sm text-text-muted">{{ t('admin.crm.no_activities') }}</p>
        <ul v-else class="space-y-3">
          <li
            v-for="a in opp.activities"
            :key="a.id"
            class="border-b border-gray-light/60 pb-3 text-sm last:border-0"
          >
            <div class="flex justify-between gap-2 text-xs text-text-muted mb-1">
              <span class="uppercase font-semibold">{{ a.type }}</span>
              <span>{{ formatDate(a.createdAt) }}</span>
            </div>
            <p class="text-text whitespace-pre-wrap">{{ a.body }}</p>
          </li>
        </ul>
      </section>

      <section class="rounded-radius border border-gray-light bg-white p-5">
        <h2 class="text-sm font-semibold mb-3">{{ t('admin.crm.meetings') }}</h2>
        <p v-if="!opp.meetings?.length" class="text-sm text-text-muted">{{ t('admin.crm.no_meetings') }}</p>
        <ul v-else class="space-y-3">
          <li
            v-for="m in opp.meetings"
            :key="m.id"
            class="flex flex-wrap items-start justify-between gap-3 border border-gray-light rounded-radius-sm p-3"
          >
            <div class="text-sm">
              <p class="font-medium">{{ meetingTypeLabel(m.type) }} · {{ t(`admin.crm.meeting_${m.status}`) }}</p>
              <p class="text-text-muted">{{ formatDate(m.startsAt) }} → {{ formatDate(m.endsAt) }}</p>
              <p v-if="m.locationOrUrl" class="text-deep truncate max-w-md">{{ m.locationOrUrl }}</p>
            </div>
            <button type="button" :class="btnSecondary" @click="downloadIcs(m.id)">
              {{ t('admin.crm.download_ics') }}
            </button>
          </li>
        </ul>
      </section>
    </template>
    <section v-else class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted">
      {{ t('admin.crm.not_found') }}
    </section>
  </div>

  <AdminModal
    :open="scheduling"
    :title="t('admin.crm.schedule_meeting')"
    :description="t('admin.crm.schedule_meeting_hint')"
    @close="scheduling = false"
  >
    <div class="flex flex-col gap-3 text-sm">
      <label class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">{{ t('admin.crm.meeting_type') }}</span>
        <select v-model="meetingType" class="rounded-radius-sm border border-gray-light px-3 py-2">
          <option value="discovery">{{ t('admin.crm.meeting_discovery') }}</option>
          <option value="proposal">{{ t('admin.crm.meeting_proposal') }}</option>
          <option value="follow_up">{{ t('admin.crm.meeting_follow_up') }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">{{ t('admin.crm.meeting_start') }}</span>
        <input v-model="meetingStart" type="datetime-local" class="rounded-radius-sm border border-gray-light px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">{{ t('admin.crm.meeting_end') }}</span>
        <input v-model="meetingEnd" type="datetime-local" class="rounded-radius-sm border border-gray-light px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">{{ t('admin.crm.meeting_url') }}</span>
        <input v-model="meetingUrl" type="text" class="rounded-radius-sm border border-gray-light px-3 py-2" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-xs text-text-muted">{{ t('admin.crm.meeting_notes') }}</span>
        <textarea v-model="meetingNotes" rows="2" class="rounded-radius-sm border border-gray-light px-3 py-2" />
      </label>
    </div>
    <div class="mt-4 flex justify-end gap-2">
      <button type="button" :class="btnSecondary" @click="scheduling = false">{{ t('admin.leads.cancel') }}</button>
      <button type="button" :class="btnPrimary" :disabled="crm.actionLoading" @click="createMeeting">
        {{ t('admin.crm.meeting_create') }}
      </button>
    </div>
  </AdminModal>
</template>
