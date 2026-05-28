import { apiClient } from '@/api/client'
import type {
  CreateLeadBody,
  CreateLeadResponse,
  LeadItem,
  LeadsKpisQuery,
  LeadsKpisResponse,
  LeadsSummaryResponse,
  ListLeadsQuery,
  ListLeadsResponse,
  LeadsTimeseriesQuery,
  LeadsTimeseriesResponse,
} from '@/types/api'

function listQueryParams(query: ListLeadsQuery): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (query.interestType !== undefined) params.interestType = query.interestType
  if (query.status !== undefined) params.status = query.status
  if (query.archived !== undefined) params.archived = query.archived
  if (query.deleted !== undefined) params.deleted = query.deleted
  if (query.seen !== undefined) params.seen = query.seen
  if (query.search !== undefined && query.search.trim() !== '') params.search = query.search.trim()
  if (query.page !== undefined) params.page = query.page
  if (query.limit !== undefined) params.limit = query.limit
  if (query.sortBy !== undefined) params.sortBy = query.sortBy
  if (query.sortDir !== undefined) params.sortDir = query.sortDir
  return params
}

export async function createPublicLead(body: CreateLeadBody): Promise<CreateLeadResponse> {
  const { data } = await apiClient.post<CreateLeadResponse>('/leads/inquiries', body)
  return data
}

export async function listAdminLeads(query: ListLeadsQuery): Promise<ListLeadsResponse> {
  const { data } = await apiClient.get<ListLeadsResponse>('/admin/leads/inquiries', {
    params: listQueryParams(query),
  })
  return data
}

export async function getAdminLead(id: string): Promise<LeadItem> {
  const { data } = await apiClient.get<LeadItem>(`/admin/leads/inquiries/${encodeURIComponent(id)}`)
  return data
}

export async function getAdminLeadsSummary(): Promise<LeadsSummaryResponse> {
  const { data } = await apiClient.get<LeadsSummaryResponse>('/admin/leads/summary')
  return data
}

export async function getAdminLeadsKpis(query: LeadsKpisQuery): Promise<LeadsKpisResponse> {
  const { data } = await apiClient.get<LeadsKpisResponse>('/admin/leads/kpis', {
    params: query,
  })
  return data
}

export async function getAdminLeadsTimeseries(
  query: LeadsTimeseriesQuery,
): Promise<LeadsTimeseriesResponse> {
  const { data } = await apiClient.get<LeadsTimeseriesResponse>('/admin/leads/timeseries', {
    params: query,
  })
  return data
}

export async function startAdminLead(id: string): Promise<LeadItem> {
  const { data } = await apiClient.post<LeadItem>(
    `/admin/leads/inquiries/${encodeURIComponent(id)}/start`,
  )
  return data
}

export async function replyAdminLead(id: string, body: { message: string }): Promise<LeadItem> {
  const { data } = await apiClient.post<LeadItem>(
    `/admin/leads/inquiries/${encodeURIComponent(id)}/reply`,
    body,
  )
  return data
}

export async function closeAdminLead(
  id: string,
  body: { reason: 'won' | 'lost' | 'no_fit' | 'spam' | 'other' },
): Promise<LeadItem> {
  const { data } = await apiClient.post<LeadItem>(
    `/admin/leads/inquiries/${encodeURIComponent(id)}/close`,
    body,
  )
  return data
}

export async function archiveAdminLead(id: string): Promise<LeadItem> {
  const { data } = await apiClient.post<LeadItem>(
    `/admin/leads/inquiries/${encodeURIComponent(id)}/archive`,
  )
  return data
}

export async function unarchiveAdminLead(id: string): Promise<LeadItem> {
  const { data } = await apiClient.post<LeadItem>(
    `/admin/leads/inquiries/${encodeURIComponent(id)}/unarchive`,
  )
  return data
}

export async function deleteAdminLead(id: string): Promise<void> {
  await apiClient.delete(`/admin/leads/inquiries/${encodeURIComponent(id)}`)
}
