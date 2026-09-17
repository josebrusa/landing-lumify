import { safeMailtoHref, safeTelHref } from '@/utils/safe-contact-href'

describe('safeMailtoHref', () => {
  it('accepts valid emails', () => {
    expect(safeMailtoHref('user@example.com')).toBe('mailto:user@example.com')
    expect(safeMailtoHref('  a.b+c@domain.co  ')).toBe('mailto:a.b+c@domain.co')
  })

  it('rejects scheme injection and invalid values', () => {
    expect(safeMailtoHref('javascript:alert(1)')).toBeNull()
    expect(safeMailtoHref('user@example.com<script>')).toBeNull()
    expect(safeMailtoHref('not-an-email')).toBeNull()
    expect(safeMailtoHref('')).toBeNull()
    expect(safeMailtoHref(null)).toBeNull()
  })
})

describe('safeTelHref', () => {
  it('accepts common phone formats', () => {
    expect(safeTelHref('+34 679 818 935')).toBe('tel:+34679818935')
    expect(safeTelHref('(555) 123-4567')).toBe('tel:5551234567')
  })

  it('rejects non-phone content', () => {
    expect(safeTelHref('javascript:alert(1)')).toBeNull()
    expect(safeTelHref('abc')).toBeNull()
    expect(safeTelHref('')).toBeNull()
    expect(safeTelHref(null)).toBeNull()
  })
})
