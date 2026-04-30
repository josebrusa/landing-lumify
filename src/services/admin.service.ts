import { apiClient } from '@/api/client'
import type { InviteUserBody, InviteUserResponse } from '@/types/api'

export async function inviteUser(body: InviteUserBody): Promise<InviteUserResponse> {
  const { data } = await apiClient.post<InviteUserResponse>('/admin/users', body)
  return data
}
