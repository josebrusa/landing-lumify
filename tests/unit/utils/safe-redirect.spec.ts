import { safeInternalPath } from '@/utils/safe-redirect'

describe('safeInternalPath', () => {
  it('accepts same-origin relative paths', () => {
    expect(safeInternalPath('/admin')).toBe('/admin')
    expect(safeInternalPath('/admin/leads/1')).toBe('/admin/leads/1')
    expect(safeInternalPath('/tech?x=1')).toBe('/tech?x=1')
  })

  it('rejects protocol-relative and absolute URLs', () => {
    expect(safeInternalPath('//evil.com')).toBeNull()
    expect(safeInternalPath('/\\evil.com')).toBeNull()
    expect(safeInternalPath('https://evil.com')).toBeNull()
    expect(safeInternalPath('http://evil.com/path')).toBeNull()
    expect(safeInternalPath('/redirect://evil.com')).toBeNull()
  })

  it('rejects empty or non-path values', () => {
    expect(safeInternalPath('')).toBeNull()
    expect(safeInternalPath(null)).toBeNull()
    expect(safeInternalPath(undefined)).toBeNull()
    expect(safeInternalPath('admin')).toBeNull()
  })
})
