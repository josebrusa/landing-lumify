import { toAbsoluteAssessmentUrl } from '@/utils/assessment-url'

describe('toAbsoluteAssessmentUrl', () => {
  it('adds https when missing', () => {
    expect(toAbsoluteAssessmentUrl('www.pccomponentes.com/producto')).toBe(
      'https://www.pccomponentes.com/producto',
    )
  })

  it('keeps a single https scheme', () => {
    expect(
      toAbsoluteAssessmentUrl(
        'https://www.pccomponentes.com/portatil-asus-vivobook',
      ),
    ).toBe('https://www.pccomponentes.com/portatil-asus-vivobook')
  })

  it('collapses duplicated schemes from prefix + paste', () => {
    expect(
      toAbsoluteAssessmentUrl(
        'https:// https://www.pccomponentes.com/portatil'.replace(/\s+/g, ''),
      ),
    ).toBe('https://www.pccomponentes.com/portatil')
    expect(
      toAbsoluteAssessmentUrl('https://https://www.zalando.es/item'),
    ).toBe('https://www.zalando.es/item')
  })

  it('preserves http-only URLs', () => {
    expect(toAbsoluteAssessmentUrl('http://example.com/p')).toBe(
      'http://example.com/p',
    )
  })
})
