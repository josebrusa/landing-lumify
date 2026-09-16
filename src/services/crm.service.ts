import { apiClient } from '@/api/client'
import type {
  AvailabilityResponse,
  CreateActivityBody,
  CreateBookingBody,
  CreateBookingResponse,
  CreateMeetingBody,
  CrmActivity,
  CrmMeeting,
  CrmOpportunityDetail,
  ListBookingSlotsQuery,
  ListMeetingsQuery,
  ListOpportunitiesQuery,
  ListOpportunitiesResponse,
  PatchMeetingBody,
  PatchOpportunityBody,
  PatchOpportunityStageBody,
  PutAvailabilityBody,
  BookingSlot,
} from '@/types/api'

function opportunityQueryParams(
  query: ListOpportunitiesQuery,
): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (query.stage !== undefined) params.stage = query.stage
  if (query.interestType !== undefined) params.interestType = query.interestType
  if (query.followUp !== undefined) params.followUp = query.followUp
  if (query.search !== undefined && query.search.trim() !== '') params.search = query.search.trim()
  if (query.page !== undefined) params.page = query.page
  if (query.limit !== undefined) params.limit = query.limit
  return params
}

export async function convertLeadToOpportunity(leadId: string): Promise<CrmOpportunityDetail> {
  const { data } = await apiClient.post<CrmOpportunityDetail>(
    `/admin/crm/opportunities/from-lead/${encodeURIComponent(leadId)}`,
  )
  return data
}

export async function listOpportunities(
  query: ListOpportunitiesQuery,
): Promise<ListOpportunitiesResponse> {
  const { data } = await apiClient.get<ListOpportunitiesResponse>('/admin/crm/opportunities', {
    params: opportunityQueryParams(query),
  })
  return data
}

export async function getOpportunity(id: string): Promise<CrmOpportunityDetail> {
  const { data } = await apiClient.get<CrmOpportunityDetail>(
    `/admin/crm/opportunities/${encodeURIComponent(id)}`,
  )
  return data
}

export async function patchOpportunity(
  id: string,
  body: PatchOpportunityBody,
): Promise<CrmOpportunityDetail> {
  const { data } = await apiClient.patch<CrmOpportunityDetail>(
    `/admin/crm/opportunities/${encodeURIComponent(id)}`,
    body,
  )
  return data
}

export async function patchOpportunityStage(
  id: string,
  body: PatchOpportunityStageBody,
): Promise<CrmOpportunityDetail> {
  const { data } = await apiClient.patch<CrmOpportunityDetail>(
    `/admin/crm/opportunities/${encodeURIComponent(id)}/stage`,
    body,
  )
  return data
}

export async function createActivity(id: string, body: CreateActivityBody): Promise<CrmActivity> {
  const { data } = await apiClient.post<CrmActivity>(
    `/admin/crm/opportunities/${encodeURIComponent(id)}/activities`,
    body,
  )
  return data
}

export async function listMeetings(query: ListMeetingsQuery): Promise<CrmMeeting[]> {
  const { data } = await apiClient.get<CrmMeeting[]>('/admin/crm/meetings', {
    params: { from: query.from, to: query.to },
  })
  return data
}

export async function createMeeting(body: CreateMeetingBody): Promise<CrmMeeting> {
  const { data } = await apiClient.post<CrmMeeting>('/admin/crm/meetings', body)
  return data
}

export async function patchMeeting(id: string, body: PatchMeetingBody): Promise<CrmMeeting> {
  const { data } = await apiClient.patch<CrmMeeting>(
    `/admin/crm/meetings/${encodeURIComponent(id)}`,
    body,
  )
  return data
}

export async function downloadMeetingIcs(id: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`/admin/crm/meetings/${encodeURIComponent(id)}/ics`, {
    responseType: 'blob',
  })
  return data
}

export async function getAvailability(): Promise<AvailabilityResponse> {
  const { data } = await apiClient.get<AvailabilityResponse>('/admin/crm/availability')
  return data
}

export async function putAvailability(body: PutAvailabilityBody): Promise<AvailabilityResponse> {
  const { data } = await apiClient.put<AvailabilityResponse>('/admin/crm/availability', body)
  return data
}

export async function listBookingSlots(query: ListBookingSlotsQuery): Promise<BookingSlot[]> {
  const params: Record<string, string> = { from: query.from, to: query.to }
  if (query.interestType) params.interestType = query.interestType
  const { data } = await apiClient.get<BookingSlot[]>('/crm/booking/slots', { params })
  return data
}

export async function createBooking(body: CreateBookingBody): Promise<CreateBookingResponse> {
  const { data } = await apiClient.post<CreateBookingResponse>('/crm/booking', body)
  return data
}
