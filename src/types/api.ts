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
export type LeadInterestType = 'pim_service' | 'pim_training' | 'logistics_service'
export type LeadStatus = 'new' | 'in_progress' | 'answered' | 'closed'
export type LeadEmailDelivery = 'queued' | 'sent' | 'failed'
export type LeadClosedReason = 'won' | 'lost' | 'no_fit' | 'spam' | 'other'
export type LeadLocale = 'es' | 'en' | 'ca'

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
  /** Visitor UI language; drives ack/reply localization. Default on API: es. */
  locale?: LeadLocale
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
  locale?: LeadLocale | null
  status: LeadStatus
  createdAt: string
  seenAt: string | null
  answeredAt: string | null
  closedAt: string | null
  archivedAt: string | null
  deletedAt: string | null
  closedReason: LeadClosedReason | null
  answer: LeadAnswer | null
  /** Set when converted into CRM opportunity. */
  opportunityId?: string | null
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

/** CRM domain (see docs/backend-crm.md). */
export type OpportunityStage =
  | 'new'
  | 'qualified'
  | 'meeting_scheduled'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'nurture'

export type ActivityType = 'note' | 'email_out' | 'call' | 'stage_change' | 'system'
export type MeetingType = 'discovery' | 'proposal' | 'follow_up'
export type MeetingStatus = 'scheduled' | 'done' | 'no_show' | 'cancelled'

export interface CrmCompany {
  id: string
  name: string
}

export interface CrmContact {
  id: string
  companyId: string | null
  email: string
  name: string | null
  phone: string | null
}

export interface CrmActivity {
  id: string
  opportunityId: string
  type: ActivityType
  body: string
  createdByUserId: string
  createdAt: string
}

export interface CrmMeeting {
  id: string
  opportunityId: string
  startsAt: string
  endsAt: string
  type: MeetingType
  status: MeetingStatus
  locationOrUrl: string | null
  notes: string | null
}

export interface CrmOpportunityListItem {
  id: string
  leadInquiryId: string | null
  companyId: string | null
  contactId: string
  interestType: LeadInterestType
  stage: OpportunityStage
  title: string
  estimatedValue: number | null
  nextFollowUpAt: string | null
  sourcePage: string
  sourceSection: string
  sourceCardId: string
  sourceCta: string
  locale: LeadLocale | null
  closedReason: LeadClosedReason | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
  company: CrmCompany | null
  contact: CrmContact
}

export interface CrmOpportunityDetail extends CrmOpportunityListItem {
  activities: CrmActivity[]
  meetings: CrmMeeting[]
}

export interface ListOpportunitiesQuery {
  stage?: OpportunityStage
  interestType?: LeadInterestType
  followUp?: 'overdue' | 'upcoming' | 'none'
  search?: string
  page?: number
  limit?: number
}

export interface ListOpportunitiesResponse {
  items: CrmOpportunityListItem[]
  total: number
}

export interface PatchOpportunityBody {
  title?: string
  estimatedValue?: number | null
  nextFollowUpAt?: string | null
}

export interface PatchOpportunityStageBody {
  stage: OpportunityStage
  closedReason?: LeadClosedReason
}

export interface CreateActivityBody {
  type: 'note' | 'call'
  body: string
}

export interface CreateMeetingBody {
  opportunityId: string
  startsAt: string
  endsAt: string
  type: MeetingType
  locationOrUrl?: string
  notes?: string
}

export interface PatchMeetingBody {
  startsAt?: string
  endsAt?: string
  type?: MeetingType
  status?: MeetingStatus
  locationOrUrl?: string | null
  notes?: string | null
}

export interface ListMeetingsQuery {
  from: string
  to: string
}

/** dayOfWeek: 1 = Monday … 7 = Sunday */
export interface AvailabilityRule {
  id?: string
  dayOfWeek: number
  startMinutes: number
  endMinutes: number
}

export interface AvailabilityResponse {
  timezone: string
  rules: AvailabilityRule[]
}

export interface PutAvailabilityBody {
  timezone: string
  rules: Array<{ dayOfWeek: number; startMinutes: number; endMinutes: number }>
}

export interface BookingSlot {
  startsAt: string
  endsAt: string
}

export interface ListBookingSlotsQuery {
  from: string
  to: string
  interestType?: LeadInterestType
}

export interface CreateBookingBody {
  startsAt: string
  endsAt: string
  email: string
  company?: string
  name?: string
  phone?: string
  interestType: LeadInterestType
  locale?: LeadLocale
  opportunityId?: string | null
}

export interface CreateBookingResponse {
  meetingId: string
  opportunityId: string
  startsAt: string
  endsAt: string
}
