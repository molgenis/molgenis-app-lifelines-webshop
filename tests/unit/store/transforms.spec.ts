import transforms from '@/store/transforms'

describe('transforms', () => {
  describe('helpers - findEmpty', () => {
    it('it find empty rows', () => {
      const in_ = [
        [0, 0],
        [1, 2],
        [3, 4],
        [0, 0],
        [5, 6],
        [0, 0]
      ]
      const out_ = [0, 3, 5]
      expect(transforms.helpers.findEmpty(in_)).toEqual(out_)
    })
  })
  describe('helpers - transpose', () => {
    it('it can correctly transpose a matrix', () => {
      const in_ = [
        [1, 2],
        [3, 4],
        [5, 6]
      ]
      const out_ = [
        [1, 3, 5],
        [2, 4, 6]
      ]
      expect(transforms.helpers.transpose(in_)).toEqual(out_)
    })
  })
  describe('findZeroRowsAndCols', () => {
    it('returns no rows/cols on missing grid', () => {
      const out_ = { rows: [], cols: [] }
      expect(transforms.findZeroRowsAndCols(null)).toEqual(out_)
    })
    it('find empty cols and rows', () => {
      const in_ = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 2],
        [3, 0, 4],
        [0, 0, 0]
      ]
      const out_ = { rows: [0, 2, 5], cols: [1] }
      expect(transforms.findZeroRowsAndCols(in_)).toEqual(out_)
    })
  })
})
