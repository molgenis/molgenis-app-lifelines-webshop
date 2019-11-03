import { isFileIncluded, buildFormData, generateOrderNumber } from '@/services/orderService.ts'

describe('orderService', () => {
  describe('when a file type field is included', () => {
    let formData = {
      a: new File([], 'name')
    }
    let formFields = [
      {
        id: 'a',
        type: 'file'
      }
    ]
    let result: boolean
    beforeEach(() => {
      result = isFileIncluded(formData, formFields)
    })
    it('should return true', () => {
      expect(result).toBeTruthy()
    })
  })

  describe('when no file type field is included', () => {
    let formData = {
      a: 'a'
    }
    let formFields = [
      {
        id: 'a',
        type: 'other'
      }
    ]
    let result: boolean
    beforeEach(() => {
      result = isFileIncluded(formData, formFields)
    })
    it('should return false', () => {
      expect(result).toBeFalsy()
    })
  })
})

describe('buildFormData', () => {
  let data = {
    a: 'a',
    b: new File([], 'name'),
    c: null
  }

  let fields = [
    { id: 'a', type: 'other' },
    { id: 'b', type: 'file' },
    { id: 'c', type: 'other' }
  ]

  it('should create a new FormData obejct and fill it with the given data', () => {
    let formData = buildFormData(data, fields)
    expect(formData).toBeTruthy()
    const keys = Array.from(formData.keys())
    expect(keys).toContain('a')
    expect(keys).toContain('b')
    expect(keys).toContain('c')
  })
})

describe('generateOrderNumber', () => {
  const orderNumber = parseInt(generateOrderNumber())
  expect(orderNumber > 0 && orderNumber <= 1000000).toBeTruthy()
})
