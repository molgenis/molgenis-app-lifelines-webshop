import { formatNumber } from '@/globals/formatting'

describe('formatters', () => {
  describe('format number', () => {
    it('should not touch input < 15 "', () => {
      expect(formatNumber(14)).toBe('14')
    })
    it('should round 10 to 99 to "≈ floor n"', () => {
      expect(formatNumber(23)).toBe('≈ 20')
    })
    it('should round 100 to 999 to "≈ floor n"', () => {
      expect(formatNumber(723)).toBe('≈ 700')
    })
    it('should round 1000 to 9999 to "nk"', () => {
      expect(formatNumber(1337)).toBe('1k')
    })
    it('should round 9999 to 10k', () => {
      expect(formatNumber(9999)).toBe('10k')
    })
    it('should round 125500 to 126k', () => {
      expect(formatNumber(125500)).toBe('126k')
    })
    it('should round 125400 to 125k', () => {
      expect(formatNumber(125400)).toBe('125k')
    })
  })
})
