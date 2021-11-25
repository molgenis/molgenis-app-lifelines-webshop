import { fetchVariables } from '@/repository/VariableRepository'
// @ts-ignore
import { get } from '@molgenis/molgenis-api-client'
import { VariableWithVariants } from '@/types/Variable'

jest.mock('@molgenis/rsql', () => {
  return {
    encodeRsqlValue: (query:string) => query
  }
})

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: jest.fn()
  }
})

const mockQueryresponse = { items: [{
  variable_id: {
    id: 0,
    name: 'name',
    label: 'label',
    variants: [{ assessment_id: '1', id: 1 }],
    subvariable_of: 1,
    subsections: [1],
    subvariables: [{
      id: 1,
      name: 's-name'
    }],
    options: [{ label_en: 'foo', bar: 'bas', code: 1 }],
    definitionEn: '',
    definitionNl: ''
  }
}] }

describe('VariableRepository', () => {
  describe('fetchVariable', () => {
    describe('treeSelected is set', () => {
      let result:VariableWithVariants[]

      beforeAll(async (done) => {
        get.mockResolvedValue(mockQueryresponse)
        result = await fetchVariables('subsection_id=1', 1)
        done()
      })

      it('should fetch the variables with selected subsection', () => {
        expect(get).toHaveBeenCalledWith(expect.stringContaining('lifelines_subsection_variable'))
        expect(result[0].id).toEqual(0)
      })

      it('should flatten the results', () => {
        expect(result.length).toEqual(2) // 1 main var + 1 flattend subvar
      })
    })

    describe('treeSelected is not set', () => {
      let result:VariableWithVariants[]

      beforeAll(async (done) => {
        get.mockResolvedValue({
          items: [{
            id: 0
          }]
        })
        result = await fetchVariables('subsection_id=-1', -1)
        done()
      })

      it('should fetch the variables without selected subsection', () => {
        expect(get).toHaveBeenCalledWith(expect.stringContaining('lifelines_variable'))
        expect(result[0].id).toEqual(0)
      })
    })

    describe('toVariable constructs complete internet status', () => {
      let result:VariableWithVariants[]
      beforeAll(async (done) => {
        get.mockResolvedValue({ items: [{ variable_id: { id: 0 } }] })
        result = await fetchVariables('subsection_id=1', 1)
        done()
      })

      it('should create a correct VariableWithVariants even with missing data', () => {
        expect(result[0]).toEqual({
          id: 0,
          label: '',
          name: '',
          options: [],
          variants: [],
          subvariableOf: null,
          subvariables: [],
          definitionEn: '',
          definitionNl: ''
        })
      })
    })

    describe('toVariable converts variants and options', () => {
      let result:VariableWithVariants[]
      beforeAll(async (done) => {
        get.mockResolvedValue(mockQueryresponse)
        result = await fetchVariables('subsection_id=1', 1)
        done()
      })

      it('should create a correct VariableWithVariants even with missing data', () => {
        expect(result[0]).toEqual({
          id: 0,
          label: 'label',
          name: 'name',
          options: [{ label_en: 'foo', code: 1 }],
          variants: [{ assessmentId: '1', id: 1 }],
          subsections: [1],
          subvariableOf: 1,
          subvariables: [{
            id: 1,
            name: 's-name'
          }],
          definitionEn: '',
          definitionNl: ''
        })
      })
    })
  })
})
