import { isFileIncluded, buildFormData, generateOrderNumber, buildOrdersQuery } from '@/services/orderService.ts'
import { QueryParams } from '@/types/QueryParams'

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

describe('buildOrdersQuery', () => {
  let query:QueryParams = {
    filters: { text: '', state: '' },
    sortBy: null,
    sortDesc: true,
    num: 10,
    start: 0
  }

  it('should generate a default page query', () => {
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=creationDate:desc')
  })

  it('should add sorting to query params', () => {
    query.sortBy = 'name'
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=name:desc')
    query.sortDesc = false
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=name:asc')
  })

  it('should generate valid filter query params', () => {
    query.filters.text = 'text'
    query.filters.state = 'state'
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=name:asc&q=(email=like=text,name=like=text,orderNumber=like=text,projectNumber=like=text);state=q=state')
    query.filters.text = ''
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=name:asc&q=state=q=state')
    query.filters.text = 'text'
    query.filters.state = ''
    expect(buildOrdersQuery(query)).toEqual('?num=10&start=0&sort=name:asc&q=email=like=text,name=like=text,orderNumber=like=text,projectNumber=like=text')
  })
})
