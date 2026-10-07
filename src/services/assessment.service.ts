import { apiClient } from '@/api/client'
import type { AssessmentAreaId } from '@/data/assessmentContent'

export type MaturityBand = 'critical' | 'improvable' | 'good' | 'excellent'

export interface AnalyzeFinding {
  area: AssessmentAreaId
  severity: 'ok' | 'warn' | 'error'
  code: string
  message: string
}

export interface AnalyzeResponse {
  url: string
  globalScore: number
  scores: Partial<Record<AssessmentAreaId, number>>
  findings: AnalyzeFinding[]
  maturity: MaturityBand
  source: 'html' | 'microlink'
}

export async function analyzeAssessment(body: {
  url: string
  areas: AssessmentAreaId[]
}): Promise<AnalyzeResponse> {
  const { data } = await apiClient.post<AnalyzeResponse>('/assessments/analyze', body)
  return data
}
