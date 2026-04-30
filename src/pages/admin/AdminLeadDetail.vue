<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useLeadsStore } from '@/stores/leads'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const leadsStore = useLeadsStore()

const responseMessage = ref('')
const responseError = ref<string | null>(null)
const sentBanner = ref(false)

const leadId = computed(() => String(route.params.id ?? ''))
const lead = computed(() => leadsStore.getLeadById(leadId.value))

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function goBack() {
  router.push({ name: 'admin-home' })
}

function submitReply() {
  if (!lead.value) return
  if (!responseMessage.value.trim()) {
    responseError.value = t('admin.leads.reply_required')
    return
  }
  leadsStore.replyToLead(lead.value.id, responseMessage.value)
  sentBanner.value = true
  responseError.value = null
  responseMessage.value = ''
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

    <section v-if="lead" class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-2">
        {{ t('admin.leads.detail_title') }}
      </h1>
      <p class="text-sm text-text-muted mb-6">{{ lead.id }}</p>

      <div class="grid grid-cols-1 gap-3 text-sm mb-6">
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

      <div v-if="sentBanner" class="mb-4 rounded-radius-sm border border-green-300 bg-green-50 p-3 text-sm text-green-800">
        {{ t('admin.leads.email_sent_mock') }}
      </div>

      <label for="lead-reply-message" class="block text-sm font-medium text-text mb-1">
        {{ t('admin.leads.reply_message') }}
      </label>
      <textarea
        id="lead-reply-message"
        v-model="responseMessage"
        rows="6"
        class="w-full rounded-radius-sm border border-gray-light bg-white px-3 py-2 text-sm text-text"
      />
      <p v-if="responseError" class="mt-2 text-sm text-red-600">{{ responseError }}</p>

      <div class="mt-4">
        <button
          type="button"
          :disabled="lead.status === 'answered'"
          class="rounded-radius-sm bg-deep px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          @click="submitReply"
        >
          {{ t('admin.leads.send_mock_email') }}
        </button>
      </div>
    </section>

    <section v-else class="rounded-radius border border-gray-light bg-white p-6 text-sm text-text-muted">
      {{ t('admin.leads.not_found') }}
    </section>
  </div>
</template>
