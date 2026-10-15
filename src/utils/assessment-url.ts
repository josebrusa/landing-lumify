/** Build a single absolute http(s) URL from user input (avoids https://https://…). */
export function toAbsoluteAssessmentUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const hasHttps = /https:\/\//i.test(trimmed)
  const hasHttp = /http:\/\//i.test(trimmed)
  const withoutSchemes = trimmed.replace(/^(https?:\/\/)+/i, '').replace(/^\/+/, '')
  if (!withoutSchemes) return ''

  const scheme = hasHttp && !hasHttps ? 'http' : 'https'
  return `${scheme}://${withoutSchemes}`
}
