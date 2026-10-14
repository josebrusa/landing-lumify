import { apiClient } from '@/api/client'
import type { AssessmentAreaId } from '@/data/assessmentContent'

export type MaturityBand = 'critical' | 'improvable' | 'good' | 'excellent'

export interface AnalyzeFinding {
  area: AssessmentAreaId
  severity: 'ok' | 'warn' | 'error'
  code: string
  message: string
}

export interface AssessmentEvidence {
  title: string
  metaDescription: string
  h1: string
  canonical: string
  ogTitle: string
  ogImage: string
  lang: string
  https: boolean
  hasJsonLdProduct: boolean
  hasGtin: boolean
  hasSku: boolean
  hasBrand: boolean
  hasVariantsHint: boolean
  hasSpecsHint: boolean
  imageCount: number
  imagesWithAlt: number
  hasPdfLink: boolean
  hasVideo: boolean
  hasBuyButton: boolean
  hasPrice: boolean
  hasReturns: boolean
  hasReviews: boolean
  hasIva: boolean
  hasVendor: boolean
  hasGpsr: boolean
  hasCe: boolean
  hasCookies: boolean
  bodyTextLength: number
}

export type AssessmentScreenshotLabel = 'desktop' | 'mobile'

export interface AssessmentScreenshot {
  label: AssessmentScreenshotLabel
  key: string
  url: string
}

export interface AnalyzeResponse {
  url: string
  globalScore: number
  scores: Partial<Record<AssessmentAreaId, number>>
  findings: AnalyzeFinding[]
  maturity: MaturityBand
  source: 'html' | 'microlink'
  evidence: AssessmentEvidence
  screenshots?: AssessmentScreenshot[]
}

export type AssessmentAnalysisPayload = {
  url: string
  reviewType: 'instant' | 'detailed'
  areas: AssessmentAreaId[]
  globalScore: number
  maturity: MaturityBand
  scores: Partial<Record<AssessmentAreaId, number>>
  findings: AnalyzeFinding[]
  evidence: AssessmentEvidence
  answers?: Record<string, number>
  source: 'html' | 'microlink'
  analyzedAt: string
  screenshots?: AssessmentScreenshot[]
}

export function emptyEvidence(): AssessmentEvidence {
  return {
    title: '',
    metaDescription: '',
    h1: '',
    canonical: '',
    ogTitle: '',
    ogImage: '',
    lang: '',
    https: true,
    hasJsonLdProduct: false,
    hasGtin: false,
    hasSku: false,
    hasBrand: false,
    hasVariantsHint: false,
    hasSpecsHint: false,
    imageCount: 0,
    imagesWithAlt: 0,
    hasPdfLink: false,
    hasVideo: false,
    hasBuyButton: false,
    hasPrice: false,
    hasReturns: false,
    hasReviews: false,
    hasIva: false,
    hasVendor: false,
    hasGpsr: false,
    hasCe: false,
    hasCookies: false,
    bodyTextLength: 0,
  }
}

export async function analyzeAssessment(body: {
  url: string
  areas: AssessmentAreaId[]
}): Promise<AnalyzeResponse> {
  const { data } = await apiClient.post<AnalyzeResponse>('/assessments/analyze', body)
  return data
}
