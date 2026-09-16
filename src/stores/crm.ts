import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import * as crmService from '@/services/crm.service'
import type {
  CreateActivityBody,
  CreateMeetingBody,
  CrmMeeting,
  CrmOpportunityDetail,
  CrmOpportunityListItem,
  HttpErrorBody,
  LeadInterestType,
  ListOpportunitiesQuery,
  OpportunityStage,
  PatchMeetingBody,
  PatchOpportunityBody,
  PatchOpportunityStageBody,
  AvailabilityResponse,
  PutAvailabilityBody,
} from '@/types/api'

function formatHttpError(e: unknown): string {
  const ax = e as AxiosError<HttpErrorBody>
  const msg = ax.response?.data?.message
  if (Array.isArray(msg)) return msg.join(', ')
  if (typeof msg === 'string') return msg
  return ax.message || 'Request failed'
}

export const useCrmStore = defineStore('crm', () => {
  const pipeline = reactive({
    items: [] as CrmOpportunityListItem[],
    total: 0,
    loading: false,
    error: null as string | null,
    stage: 'all' as 'all' | OpportunityStage,
    interest: 'all' as 'all' | LeadInterestType,
    search: '',
    page: 1,
    limit: 50,
  })

  const opportunityDetail = ref<CrmOpportunityDetail | null>(null)
  const opportunityLoading = ref(false)
  const opportunityError = ref<string | null>(null)

  const meetings = ref<CrmMeeting[]>([])
  const meetingsLoading = ref(false)
  const meetingsError = ref<string | null>(null)

  const availability = ref<AvailabilityResponse | null>(null)
  const availabilityLoading = ref(false)
  const availabilityError = ref<string | null>(null)

  const actionError = ref<string | null>(null)
  const actionLoading = ref(false)

  async function refreshPipeline() {
    pipeline.loading = true
    pipeline.error = null
    try {
      const query: ListOpportunitiesQuery = {
        page: pipeline.page,
        limit: pipeline.limit,
        ...(pipeline.stage !== 'all' ? { stage: pipeline.stage } : {}),
        ...(pipeline.interest !== 'all' ? { interestType: pipeline.interest } : {}),
        ...(pipeline.search.trim() ? { search: pipeline.search } : {}),
      }
      const res = await crmService.listOpportunities(query)
      pipeline.items = res.items
      pipeline.total = res.total
    } catch (e) {
      pipeline.error = formatHttpError(e)
    } finally {
      pipeline.loading = false
    }
  }

  async function fetchOpportunity(id: string) {
    opportunityLoading.value = true
    opportunityError.value = null
    try {
      opportunityDetail.value = await crmService.getOpportunity(id)
    } catch (e) {
      opportunityError.value = formatHttpError(e)
      opportunityDetail.value = null
    } finally {
      opportunityLoading.value = false
    }
  }

  async function convertFromLead(leadId: string) {
    actionLoading.value = true
    actionError.value = null
    try {
      const opp = await crmService.convertLeadToOpportunity(leadId)
      opportunityDetail.value = opp
      return opp
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateOpportunity(id: string, body: PatchOpportunityBody) {
    actionLoading.value = true
    actionError.value = null
    try {
      opportunityDetail.value = await crmService.patchOpportunity(id, body)
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateStage(id: string, body: PatchOpportunityStageBody) {
    actionLoading.value = true
    actionError.value = null
    try {
      opportunityDetail.value = await crmService.patchOpportunityStage(id, body)
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function addActivity(id: string, body: CreateActivityBody) {
    actionLoading.value = true
    actionError.value = null
    try {
      await crmService.createActivity(id, body)
      await fetchOpportunity(id)
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function fetchMeetings(from: string, to: string) {
    meetingsLoading.value = true
    meetingsError.value = null
    try {
      meetings.value = await crmService.listMeetings({ from, to })
    } catch (e) {
      meetingsError.value = formatHttpError(e)
      meetings.value = []
    } finally {
      meetingsLoading.value = false
    }
  }

  async function scheduleMeeting(body: CreateMeetingBody) {
    actionLoading.value = true
    actionError.value = null
    try {
      const meeting = await crmService.createMeeting(body)
      if (opportunityDetail.value?.id === body.opportunityId) {
        await fetchOpportunity(body.opportunityId)
      }
      return meeting
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateMeeting(id: string, body: PatchMeetingBody) {
    actionLoading.value = true
    actionError.value = null
    try {
      return await crmService.patchMeeting(id, body)
    } catch (e) {
      actionError.value = formatHttpError(e)
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function fetchAvailability() {
    availabilityLoading.value = true
    availabilityError.value = null
    try {
      availability.value = await crmService.getAvailability()
    } catch (e) {
      availabilityError.value = formatHttpError(e)
    } finally {
      availabilityLoading.value = false
    }
  }

  async function saveAvailability(body: PutAvailabilityBody) {
    availabilityLoading.value = true
    availabilityError.value = null
    try {
      availability.value = await crmService.putAvailability(body)
    } catch (e) {
      availabilityError.value = formatHttpError(e)
      throw e
    } finally {
      availabilityLoading.value = false
    }
  }

  return {
    pipeline,
    opportunityDetail,
    opportunityLoading,
    opportunityError,
    meetings,
    meetingsLoading,
    meetingsError,
    availability,
    availabilityLoading,
    availabilityError,
    actionError,
    actionLoading,
    refreshPipeline,
    fetchOpportunity,
    convertFromLead,
    updateOpportunity,
    updateStage,
    addActivity,
    fetchMeetings,
    scheduleMeeting,
    updateMeeting,
    fetchAvailability,
    saveAvailability,
  }
})
