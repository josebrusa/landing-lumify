import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import * as leadsService from '@/services/leads.service'
import type {
  HttpErrorBody,
  LeadInterestType,
  LeadItem,
  LeadsSummaryResponse,
  ListLeadsQuery,
} from '@/types/api'

export type { LeadInterestType } from '@/types/api'

export interface LeadIntent {
  interestType: LeadInterestType
  sourcePage: 'home' | 'training'
  sourceSection: string
  sourceCardId: string
  sourceCta: string
  capturedAt: string
}

interface LeadIntentFallback {
  sourcePage?: LeadIntent['sourcePage']
  sourceSection?: string
  sourceCardId?: string
  sourceCta?: string
}

export type AdminTableFilter = 'all' | 'new' | 'answered'

export interface AdminTableState {
  filter: AdminTableFilter
  sortBy: 'createdAt' | 'answeredAt'
  sortDir: 'asc' | 'desc'
  page: number
  limit: number
  items: LeadItem[]
  total: number
  loading: boolean
  error: string | null
}

const INTENT_MAX_AGE_MS = 1000 * 60 * 30

function nowIso() {
  return new Date().toISOString()
}

function fallbackSourcePageByInterest(interestType: LeadInterestType): LeadIntent['sourcePage'] {
  return interestType === 'pim_training' ? 'training' : 'home'
}

function buildFallbackIntent(
  fallbackInterest: LeadInterestType,
  fallbackContext?: LeadIntentFallback,
): Omit<LeadIntent, 'capturedAt'> {
  const sourcePage = fallbackContext?.sourcePage ?? fallbackSourcePageByInterest(fallbackInterest)
  const sourceSection = fallbackContext?.sourceSection ?? (sourcePage === 'training' ? 'training' : 'register')
  return {
    interestType: fallbackInterest,
    sourcePage,
    sourceSection,
    sourceCardId: fallbackContext?.sourceCardId ?? 'direct_form',
    sourceCta: fallbackContext?.sourceCta ?? 'form_submit',
  }
}

function formatHttpError(err: unknown): string {
  const ax = err as AxiosError<HttpErrorBody>
  const msg = ax.response?.data?.message
  if (Array.isArray(msg)) return msg.join(', ')
  if (typeof msg === 'string' && msg.trim()) return msg
  if (ax.message) return ax.message
  return 'Request failed'
}

function initialTableState(): AdminTableState {
  return {
    filter: 'new',
    sortBy: 'createdAt',
    sortDir: 'desc',
    page: 1,
    limit: 20,
    items: [],
    total: 0,
    loading: false,
    error: null,
  }
}

export const useLeadsStore = defineStore('leads', () => {
  const currentIntent = ref<LeadIntent | null>(null)

  const serviceTable = reactive<AdminTableState>(initialTableState())
  const trainingTable = reactive<AdminTableState>(initialTableState())

  const summary = ref<LeadsSummaryResponse | null>(null)
  const summaryLoading = ref(false)
  const summaryError = ref<string | null>(null)

  const leadDetail = ref<LeadItem | null>(null)
  const leadDetailLoading = ref(false)
  const leadDetailError = ref<string | null>(null)

  const createLeadSubmitting = ref(false)
  const createLeadError = ref<string | null>(null)

  function registerIntent(intent: Omit<LeadIntent, 'capturedAt'>) {
    currentIntent.value = {
      ...intent,
      capturedAt: nowIso(),
    }
  }

  function resolveIntent(
    fallbackInterest: LeadInterestType,
    fallbackContext?: LeadIntentFallback,
  ): Omit<LeadIntent, 'capturedAt'> {
    if (!currentIntent.value) {
      return buildFallbackIntent(fallbackInterest, fallbackContext)
    }

    const age = Date.now() - new Date(currentIntent.value.capturedAt).getTime()
    if (!Number.isFinite(age) || age > INTENT_MAX_AGE_MS) {
      const fallback = buildFallbackIntent(fallbackInterest, fallbackContext)
      return {
        ...fallback,
        sourceCardId: fallbackContext?.sourceCardId ?? 'expired_intent',
      }
    }

    const { interestType, sourcePage, sourceSection, sourceCardId, sourceCta } = currentIntent.value
    return { interestType, sourcePage, sourceSection, sourceCardId, sourceCta }
  }

  async function createLead(payload: {
    company: string
    email: string
    fallbackInterest: LeadInterestType
    fallbackContext?: LeadIntentFallback
  }) {
    createLeadSubmitting.value = true
    createLeadError.value = null
    try {
      const intent = resolveIntent(payload.fallbackInterest, payload.fallbackContext)
      const companyTrim = payload.company.trim()
      const res = await leadsService.createPublicLead({
        ...(companyTrim ? { company: companyTrim } : {}),
        email: payload.email.trim(),
        interestType: intent.interestType,
        sourcePage: intent.sourcePage,
        sourceSection: intent.sourceSection,
        sourceCardId: intent.sourceCardId,
        sourceCta: intent.sourceCta,
      })
      return res
    } catch (e) {
      createLeadError.value = formatHttpError(e)
      throw e
    } finally {
      createLeadSubmitting.value = false
    }
  }

  function tableInterestType(key: 'service' | 'training'): ListLeadsQuery['interestType'] {
    return key === 'service' ? 'pim_service' : 'pim_training'
  }

  async function refreshAdminTable(key: 'service' | 'training') {
    const table = key === 'service' ? serviceTable : trainingTable
    table.loading = true
    table.error = null
    try {
      const query: ListLeadsQuery = {
        interestType: tableInterestType(key),
        page: table.page,
        limit: table.limit,
        sortBy: table.sortBy,
        sortDir: table.sortDir,
      }
      if (table.filter !== 'all') {
        query.status = table.filter === 'new' ? 'new' : 'answered'
      }
      const res = await leadsService.listAdminLeads(query)
      table.items = res.items
      table.total = res.total
    } catch (e) {
      table.error = formatHttpError(e)
      table.items = []
      table.total = 0
    } finally {
      table.loading = false
    }
  }

  async function fetchSummary() {
    summaryLoading.value = true
    summaryError.value = null
    try {
      summary.value = await leadsService.getAdminLeadsSummary()
    } catch (e) {
      summaryError.value = formatHttpError(e)
      summary.value = null
    } finally {
      summaryLoading.value = false
    }
  }

  async function fetchLeadDetail(id: string) {
    leadDetailLoading.value = true
    leadDetailError.value = null
    leadDetail.value = null
    try {
      leadDetail.value = await leadsService.getAdminLead(id)
    } catch (e) {
      leadDetailError.value = formatHttpError(e)
      leadDetail.value = null
    } finally {
      leadDetailLoading.value = false
    }
  }

  function setServiceFilter(filter: AdminTableFilter) {
    serviceTable.filter = filter
    serviceTable.page = 1
    void refreshAdminTable('service')
  }

  function setTrainingFilter(filter: AdminTableFilter) {
    trainingTable.filter = filter
    trainingTable.page = 1
    void refreshAdminTable('training')
  }

  function setServiceSort(sortBy: 'createdAt' | 'answeredAt', sortDir: 'asc' | 'desc') {
    serviceTable.sortBy = sortBy
    serviceTable.sortDir = sortDir
    serviceTable.page = 1
    void refreshAdminTable('service')
  }

  function setTrainingSort(sortBy: 'createdAt' | 'answeredAt', sortDir: 'asc' | 'desc') {
    trainingTable.sortBy = sortBy
    trainingTable.sortDir = sortDir
    trainingTable.page = 1
    void refreshAdminTable('training')
  }

  function setServicePage(page: number) {
    serviceTable.page = Math.max(1, page)
    void refreshAdminTable('service')
  }

  function setTrainingPage(page: number) {
    trainingTable.page = Math.max(1, page)
    void refreshAdminTable('training')
  }

  return {
    currentIntent,
    registerIntent,
    createLead,
    createLeadSubmitting,
    createLeadError,
    serviceTable,
    trainingTable,
    refreshAdminTable,
    setServiceFilter,
    setTrainingFilter,
    setServiceSort,
    setTrainingSort,
    setServicePage,
    setTrainingPage,
    summary,
    summaryLoading,
    summaryError,
    fetchSummary,
    leadDetail,
    leadDetailLoading,
    leadDetailError,
    fetchLeadDetail,
  }
})
