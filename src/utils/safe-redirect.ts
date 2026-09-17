/**
 * Returns a same-origin relative path suitable for post-login redirects, or null.
 * Rejects protocol-relative URLs (//evil.com) and absolute URLs.
 */
export function safeInternalPath(path: string | null | undefined): string | null {
  if (typeof path !== 'string' || path.length === 0) return null
  if (!path.startsWith('/')) return null
  if (path.startsWith('//') || path.startsWith('/\\')) return null
  if (path.includes('://')) return null
  return path
}
