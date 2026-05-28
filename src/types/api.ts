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
export type LeadStatus = 'new' | 'in_progress' | 'answered' | 'closed'
export type LeadEmailDelivery = 'queued' | 'sent' | 'failed'
export type LeadClosedReason = 'won' | 'lost' | 'no_fit' | 'spam' | 'other'

export interface CreateLeadBody {
  name?: string
  company?: string
  phone?: string
  email: string
  message?: string
  interestType: LeadInterestType
  sourcePage: string
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
  name: string | null
  company: string | null
  phone: string | null
  email: string
  message: string | null
  interestType: LeadInterestType
  sourcePage: string
  sourceSection: string
  sourceCardId: string
  sourceCta: string
  status: LeadStatus
  createdAt: string
  seenAt: string | null
  answeredAt: string | null
  closedAt: string | null
  archivedAt: string | null
  deletedAt: string | null
  closedReason: LeadClosedReason | null
  answer: LeadAnswer | null
}

export interface ListLeadsQuery {
  interestType?: LeadInterestType
  status?: LeadStatus
  archived?: boolean
  deleted?: boolean
  seen?: 'seen' | 'unseen'
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'seenAt' | 'answeredAt'
  sortDir?: 'asc' | 'desc'
}

export interface ListLeadsResponse {
  items: LeadItem[]
  total: number
}

export interface LeadsSummaryBucket {
  new: number
  inProgress: number
  answered: number
  closed: number
  all: number
}

export interface LeadsSummaryResponse {
  service: LeadsSummaryBucket
  training: LeadsSummaryBucket
  totals: LeadsSummaryBucket
}

export interface LeadsKpisQuery {
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  tz: string
}

export interface LeadsKpisResponse {
  totals: {
    created: number
    unseen: number
    inProgress: number
    answered: number
    closed: number
    archived: number
  }
  responseTime: {
    answeredCount: number
    avgMinutes: number | null
    medianMinutes: number | null
    p90Minutes: number | null
  }
  byInterestType: Array<{ interestType: LeadInterestType; created: number; answered: number }>
}

export interface LeadsTimeseriesQuery extends LeadsKpisQuery {
  interval: 'day'
}

export interface LeadsTimeseriesResponse {
  points: Array<{
    date: string // YYYY-MM-DD
    created: number
    seen: number
    answered: number
    closed: number
  }>
}
