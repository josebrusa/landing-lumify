<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useCrmStore } from '@/stores/crm'
import type { LeadInterestType, OpportunityStage } from '@/types/api'
import { resolveLeadLabel } from '@/data/leadAttribution'

const { t } = useI18n()
const router = useRouter()
const crm = useCrmStore()

const pipeline = computed(() => crm.pipeline)

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

function stageLabel(stage: OpportunityStage) {
  return t(`admin.crm.stage_${stage}`)
}

function interestLabel(type: LeadInterestType) {
  return resolveLeadLabel(t, `lead.interest.${type}`, type)
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

function openOpportunity(id: string) {
  router.push({ name: 'admin-opportunity-detail', params: { id } })
}

function setStage(value: string) {
  pipeline.value.stage = value as 'all' | OpportunityStage
  pipeline.value.page = 1
  void crm.refreshPipeline()
}

function setInterest(value: string) {
  pipeline.value.interest = value as 'all' | LeadInterestType
  pipeline.value.page = 1
  void crm.refreshPipeline()
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => pipeline.value.search,
  () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      pipeline.value.page = 1
      void crm.refreshPipeline()
    }, 300)
  },
)

onMounted(() => {
  void crm.refreshPipeline()
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-radius border border-gray-light bg-white p-6">
      <h1 class="font-heading text-2xl font-bold text-text mb-1">{{ t('admin.crm.pipeline_title') }}</h1>
      <p class="text-sm text-text-muted">{{ t('admin.crm.pipeline_subtitle') }}</p>
    </section>

    <section class="rounded-radius border border-gray-light bg-white p-4 flex flex-wrap gap-3 items-end">
      <label class="flex flex-col gap-1 text-xs text-text-muted">
        {{ t('admin.crm.filter_stage') }}
        <select
          class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm text-text min-w-[160px]"
          :value="pipeline.stage"
          @change="setStage(($event.target as HTMLSelectElement).value)"
        >
          <option value="all">{{ t('admin.crm.stage_all') }}</option>
          <option v-for="s in stages" :key="s" :value="s">{{ stageLabel(s) }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs text-text-muted">
        {{ t('admin.leads.filter_interest') }}
        <select
          class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm text-text min-w-[160px]"
          :value="pipeline.interest"
          @change="setInterest(($event.target as HTMLSelectElement).value)"
        >
          <option value="all">{{ t('admin.leads.interest_all') }}</option>
          <option value="pim_service">{{ t('admin.leads.interest_service') }}</option>
          <option value="pim_training">{{ t('admin.leads.interest_training') }}</option>
          <option value="logistics_service">{{ t('admin.leads.interest_logistics') }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-xs text-text-muted flex-1 min-w-[200px]">
        {{ t('admin.leads.search_placeholder') }}
        <input
          v-model="pipeline.search"
          type="search"
          class="rounded-radius-sm border border-gray-light px-3 py-2 text-sm text-text"
          :placeholder="t('admin.crm.search_placeholder')"
        />
      </label>
    </section>

    <section class="rounded-radius border border-gray-light bg-white overflow-x-auto">
      <p v-if="pipeline.loading" class="p-6 text-sm text-text-muted">{{ t('admin.crm.loading') }}</p>
      <p v-else-if="pipeline.error" class="p-6 text-sm text-red-600">{{ pipeline.error }}</p>
      <p v-else-if="pipeline.items.length === 0" class="p-6 text-sm text-text-muted">
        {{ t('admin.crm.empty_pipeline') }}
      </p>
      <table v-else class="w-full text-sm text-left">
        <thead class="bg-surface text-text-muted text-xs uppercase tracking-wide">
          <tr>
            <th class="px-4 py-3 font-semibold">{{ t('admin.crm.col_title') }}</th>
            <th class="px-4 py-3 font-semibold">{{ t('admin.leads.interest') }}</th>
            <th class="px-4 py-3 font-semibold">{{ t('admin.crm.col_stage') }}</th>
            <th class="px-4 py-3 font-semibold">{{ t('admin.crm.col_follow_up') }}</th>
            <th class="px-4 py-3 font-semibold">{{ t('admin.leads.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in pipeline.items"
            :key="item.id"
            class="border-t border-gray-light hover:bg-surface/60 cursor-pointer"
            @click="openOpportunity(item.id)"
          >
            <td class="px-4 py-3">
              <div class="font-medium text-text">{{ item.title }}</div>
              <div class="text-xs text-text-muted">{{ item.contact.email }}</div>
            </td>
            <td class="px-4 py-3">{{ interestLabel(item.interestType) }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex rounded-full bg-blue/15 px-2 py-0.5 text-xs font-semibold text-deep">
                {{ stageLabel(item.stage) }}
              </span>
            </td>
            <td class="px-4 py-3 text-text-muted">{{ formatDate(item.nextFollowUpAt) }}</td>
            <td class="px-4 py-3">
              <button
                type="button"
                class="text-xs font-semibold text-deep underline"
                @click.stop="openOpportunity(item.id)"
              >
                {{ t('admin.crm.open') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
