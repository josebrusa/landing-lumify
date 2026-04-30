import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type LeadInterestType = 'pim_service' | 'pim_training'
export type LeadStatus = 'new' | 'answered'

export interface LeadIntent {
  interestType: LeadInterestType
  sourcePage: 'home' | 'training'
  sourceSection: string
  sourceCardId: string
  sourceCta: string
  capturedAt: string
}

export interface LeadAnswer {
  message: string
  sentAt: string
  emailDelivery: 'mock_sent'
}

export interface LeadEntry {
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
  answeredAt?: string
  answer?: LeadAnswer
}

const STORAGE_KEY = 'lumify.leads.v1'
const INTENT_MAX_AGE_MS = 1000 * 60 * 30

function nowIso() {
  return new Date().toISOString()
}

function generateLeadId() {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `LD-${token}`
}

function parseStoredLeads(): LeadEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LeadEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref<LeadEntry[]>(parseStoredLeads())
  const currentIntent = ref<LeadIntent | null>(null)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads.value))
  }

  function registerIntent(intent: Omit<LeadIntent, 'capturedAt'>) {
    currentIntent.value = {
      ...intent,
      capturedAt: nowIso(),
    }
  }

  function resolveIntent(fallbackInterest: LeadInterestType): LeadIntent {
    if (!currentIntent.value) {
      return {
        interestType: fallbackInterest,
        sourcePage: fallbackInterest === 'pim_training' ? 'training' : 'home',
        sourceSection: fallbackInterest === 'pim_training' ? 'training' : 'register',
        sourceCardId: 'direct_form',
        sourceCta: 'form_submit',
        capturedAt: nowIso(),
      }
    }

    const age = Date.now() - new Date(currentIntent.value.capturedAt).getTime()
    if (!Number.isFinite(age) || age > INTENT_MAX_AGE_MS) {
      return {
        interestType: fallbackInterest,
        sourcePage: fallbackInterest === 'pim_training' ? 'training' : 'home',
        sourceSection: fallbackInterest === 'pim_training' ? 'training' : 'register',
        sourceCardId: 'expired_intent',
        sourceCta: 'form_submit',
        capturedAt: nowIso(),
      }
    }

    return currentIntent.value
  }

  function createLead(payload: {
    company: string
    email: string
    fallbackInterest: LeadInterestType
  }) {
    const intent = resolveIntent(payload.fallbackInterest)
    const lead: LeadEntry = {
      id: generateLeadId(),
      company: payload.company.trim() || 'Unknown company',
      email: payload.email.trim(),
      interestType: intent.interestType,
      sourcePage: intent.sourcePage,
      sourceSection: intent.sourceSection,
      sourceCardId: intent.sourceCardId,
      sourceCta: intent.sourceCta,
      status: 'new',
      createdAt: nowIso(),
    }
    leads.value = [lead, ...leads.value]
    persist()
    return lead
  }

  function replyToLead(leadId: string, message: string) {
    const idx = leads.value.findIndex((lead) => lead.id === leadId)
    if (idx < 0) return null
    const sentAt = nowIso()
    leads.value[idx] = {
      ...leads.value[idx],
      status: 'answered',
      answeredAt: sentAt,
      answer: {
        message: message.trim(),
        sentAt,
        emailDelivery: 'mock_sent',
      },
    }
    persist()
    return leads.value[idx]
  }

  function getLeadById(leadId: string) {
    return leads.value.find((lead) => lead.id === leadId) ?? null
  }

  const serviceLeads = computed(() =>
    leads.value.filter((lead) => lead.interestType === 'pim_service'),
  )
  const trainingLeads = computed(() =>
    leads.value.filter((lead) => lead.interestType === 'pim_training'),
  )

  const servicePendingLeads = computed(() =>
    serviceLeads.value.filter((lead) => lead.status === 'new'),
  )
  const trainingPendingLeads = computed(() =>
    trainingLeads.value.filter((lead) => lead.status === 'new'),
  )
  const serviceAnsweredLeads = computed(() =>
    serviceLeads.value.filter((lead) => lead.status === 'answered'),
  )
  const trainingAnsweredLeads = computed(() =>
    trainingLeads.value.filter((lead) => lead.status === 'answered'),
  )

  return {
    leads,
    currentIntent,
    registerIntent,
    createLead,
    replyToLead,
    getLeadById,
    serviceLeads,
    trainingLeads,
    servicePendingLeads,
    trainingPendingLeads,
    serviceAnsweredLeads,
    trainingAnsweredLeads,
  }
})
