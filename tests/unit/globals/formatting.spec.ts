import { formatNumber } from '@/globals/formatting'

describe('formatters', () => {
  describe('format number', () => {
    it('should return a full number when given a four digit number', () => {
      expect(formatNumber(1337)).toBe('1337')
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
