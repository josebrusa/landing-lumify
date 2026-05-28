import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import * as leadsService from '@/services/leads.service'
import type {
  HttpErrorBody,
  LeadClosedReason,
  LeadInterestType,
  LeadItem,
  LeadsKpisResponse,
  LeadsSummaryResponse,
  LeadsTimeseriesResponse,
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

export type AdminLeadsTab = 'inbox' | 'history'
export type AdminLeadsSeenFilter = 'all' | 'unseen' | 'seen'

export type AdminLeadsStatusFilter = 'all' | 'new' | 'in_progress' | 'answered' | 'closed'

export interface AdminLeadsTableState {
  tab: AdminLeadsTab
  interest: 'all' | LeadInterestType
  status: AdminLeadsStatusFilter
  seen: AdminLeadsSeenFilter
  search: string
  sortBy: 'createdAt' | 'seenAt' | 'answeredAt'
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

function initialTableState(): AdminLeadsTableState {
  return {
    tab: 'inbox',
    interest: 'all',
    status: 'all',
    seen: 'all',
    search: '',
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

  const adminTable = reactive<AdminLeadsTableState>(initialTableState())

  const summary = ref<LeadsSummaryResponse | null>(null)
  const summaryLoading = ref(false)
  const summaryError = ref<string | null>(null)

  const leadDetail = ref<LeadItem | null>(null)
  const leadDetailLoading = ref(false)
  const leadDetailError = ref<string | null>(null)

  const kpis = ref<LeadsKpisResponse | null>(null)
  const kpisLoading = ref(false)
  const kpisError = ref<string | null>(null)

  const timeseries = ref<LeadsTimeseriesResponse | null>(null)
  const timeseriesLoading = ref(false)
  const timeseriesError = ref<string | null>(null)

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

  async function refreshAdminTable() {
    const table = adminTable
    table.loading = true
    table.error = null
    try {
      const query: ListLeadsQuery = {
        ...(table.interest !== 'all' ? { interestType: table.interest } : {}),
        page: table.page,
        limit: table.limit,
        sortBy: table.sortBy,
        sortDir: table.sortDir,
      }

      if (table.tab === 'inbox') {
        query.archived = false
        query.deleted = false
      } else {
        query.archived = true
        query.deleted = false
      }

      if (table.status !== 'all') query.status = table.status
      if (table.seen === 'seen') query.seen = 'seen'
      if (table.seen === 'unseen') query.seen = 'unseen'
      if (table.search.trim()) query.search = table.search

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

  async function fetchKpis(payload: { from: string; to: string; tz: string }) {
    kpisLoading.value = true
    kpisError.value = null
    try {
      kpis.value = await leadsService.getAdminLeadsKpis(payload)
    } catch (e) {
      kpisError.value = formatHttpError(e)
      kpis.value = null
    } finally {
      kpisLoading.value = false
    }
  }

  async function fetchTimeseries(payload: { from: string; to: string; tz: string; interval: 'day' }) {
    timeseriesLoading.value = true
    timeseriesError.value = null
    try {
      timeseries.value = await leadsService.getAdminLeadsTimeseries(payload)
    } catch (e) {
      timeseriesError.value = formatHttpError(e)
      timeseries.value = null
    } finally {
      timeseriesLoading.value = false
    }
  }

  function setAdminTab(tab: AdminLeadsTab) {
    adminTable.tab = tab
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminInterest(interest: AdminLeadsTableState['interest']) {
    adminTable.interest = interest
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminStatus(status: AdminLeadsStatusFilter) {
    adminTable.status = status
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminSeen(seen: AdminLeadsSeenFilter) {
    adminTable.seen = seen
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminSearch(search: string) {
    adminTable.search = search
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminSort(sortBy: AdminLeadsTableState['sortBy'], sortDir: 'asc' | 'desc') {
    adminTable.sortBy = sortBy
    adminTable.sortDir = sortDir
    adminTable.page = 1
    void refreshAdminTable()
  }

  function setAdminPage(page: number) {
    adminTable.page = Math.max(1, page)
    void refreshAdminTable()
  }

  async function startLead(id: string) {
    await leadsService.startAdminLead(id)
  }

  async function replyLead(id: string, message: string) {
    await leadsService.replyAdminLead(id, { message })
  }

  async function closeLead(id: string, reason: LeadClosedReason) {
    await leadsService.closeAdminLead(id, { reason })
  }

  async function archiveLead(id: string) {
    await leadsService.archiveAdminLead(id)
  }

  async function unarchiveLead(id: string) {
    await leadsService.unarchiveAdminLead(id)
  }

  async function deleteLead(id: string) {
    await leadsService.deleteAdminLead(id)
  }

  return {
    currentIntent,
    registerIntent,
    createLead,
    createLeadSubmitting,
    createLeadError,
    adminTable,
    refreshAdminTable,
    setAdminTab,
    setAdminInterest,
    setAdminStatus,
    setAdminSeen,
    setAdminSearch,
    setAdminSort,
    setAdminPage,
    summary,
    summaryLoading,
    summaryError,
    fetchSummary,
    leadDetail,
    leadDetailLoading,
    leadDetailError,
    fetchLeadDetail,
    kpis,
    kpisLoading,
    kpisError,
    fetchKpis,
    timeseries,
    timeseriesLoading,
    timeseriesError,
    fetchTimeseries,
    startLead,
    replyLead,
    closeLead,
    archiveLead,
    unarchiveLead,
    deleteLead,
  }
})
