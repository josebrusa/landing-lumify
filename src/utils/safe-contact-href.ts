const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UNSAFE_EMAIL_CHARS = /[\s<>"'`\\]|javascript:|data:/i

/**
 * Build a safe mailto: href from user/API-provided email, or null if invalid.
 */
export function safeMailtoHref(email: string | null | undefined): string | null {
  if (typeof email !== 'string') return null
  const trimmed = email.trim()
  if (!trimmed || trimmed.length > 254) return null
  if (UNSAFE_EMAIL_CHARS.test(trimmed)) return null
  if (!EMAIL_RE.test(trimmed)) return null
  return `mailto:${trimmed}`
}

/**
 * Build a safe tel: href from user/API-provided phone, or null if invalid.
 * Allows digits, spaces, +, -, parentheses; href uses digits and leading + only.
 */
export function safeTelHref(phone: string | null | undefined): string | null {
  if (typeof phone !== 'string') return null
  const trimmed = phone.trim()
  if (!trimmed || trimmed.length > 32) return null
  if (!/^[+\d\s().-]+$/.test(trimmed)) return null
  const digits = trimmed.replace(/[^\d+]/g, '')
  const normalized = digits.startsWith('+')
    ? `+${digits.slice(1).replace(/\D/g, '')}`
    : digits.replace(/\D/g, '')
  if (!normalized || normalized === '+') return null
  if (normalized.startsWith('+')) {
    if (normalized.length < 8 || normalized.length > 16) return null
  } else if (normalized.length < 7 || normalized.length > 15) {
    return null
  }
  return `tel:${normalized}`
}
