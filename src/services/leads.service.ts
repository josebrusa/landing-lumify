import { apiClient } from '@/api/client'
import type {
  CreateLeadBody,
  CreateLeadResponse,
  LeadItem,
  LeadsSummaryResponse,
  ListLeadsQuery,
  ListLeadsResponse,
} from '@/types/api'

function listQueryParams(query: ListLeadsQuery): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (query.interestType !== undefined) params.interestType = query.interestType
  if (query.status !== undefined) params.status = query.status
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
