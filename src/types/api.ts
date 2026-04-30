/** Mirrors backend DTOs (NestJS /api). */

export type UserRole = 'admin' | 'user'

export type LoginChallengePurpose = 'signup' | 'login_2fa'

export type LoginResponse =
  | { access_token: string; challengeId?: undefined; message?: undefined; purpose?: undefined }
  | {
      access_token?: undefined
      challengeId: string
      message?: string
      purpose?: LoginChallengePurpose
    }

export interface VerifyOtpResponse {
  access_token: string
}

export interface VerifyOtpBody {
  challengeId: string
  code: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  email: string
  password: string
}

export interface MeResponse {
  id: string
  email: string
  role: UserRole
  twoFactorLoginEnabled: boolean
  emailVerified: boolean
}

export interface UpdateTwoFactorBody {
  enabled: boolean
}

export interface UpdateTwoFactorResponse {
  twoFactorLoginEnabled: boolean
}

export interface InviteUserBody {
  email: string
}

export interface InviteUserResponse {
  id: string
  email: string
  temporaryPassword: string
  challengeId: string
  message: string
}

/** Typical NestJS validation / HTTP exception body */
export interface HttpErrorBody {
  statusCode: number
  message: string | string[]
  error?: string
}

/** Public + admin leads API (camelCase DTOs). */
export type LeadInterestType = 'pim_service' | 'pim_training'
export type LeadStatus = 'new' | 'answered'
export type LeadEmailDelivery = 'queued' | 'sent' | 'failed'

export interface CreateLeadBody {
  company?: string
  email: string
  interestType: LeadInterestType
  sourcePage: 'home' | 'training'
  sourceSection: string
  sourceCardId: string
  sourceCta: string
}

export interface CreateLeadResponse {
  id: string
  status: LeadStatus
  createdAt: string
}

export interface LeadAnswer {
  message: string
  sentAt: string
  emailDelivery: LeadEmailDelivery
}

export interface LeadItem {
  id: string
  company: string
  email: string
  interestType: LeadInterestType
  sourcePage: 'home' | 'training'
  sourceSection: string
  sourceCardId: string
  sourceCta: string
  status: LeadStatus
  createdAt: string
  answeredAt: string | null
  answer: LeadAnswer | null
}

export interface ListLeadsQuery {
  interestType?: LeadInterestType
  status?: LeadStatus
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'answeredAt'
  sortDir?: 'asc' | 'desc'
}

export interface ListLeadsResponse {
  items: LeadItem[]
  total: number
}

export interface LeadsSummaryBucket {
  new: number
  answered: number
  all: number
}

export interface LeadsSummaryResponse {
  service: LeadsSummaryBucket
  training: LeadsSummaryBucket
  totals: LeadsSummaryBucket
}
