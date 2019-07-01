import actions from '@/store/actions'

jest.mock('@molgenis/molgenis-api-client', () => {
  const responses: {[key:string]: Object} = {
    '/api/v2/lifelines_assessment': {
      items: [
        { id: 1, name: '1A' },
        { id: 2, name: '1B' }
      ]
    },
    '/api/v2/lifelines_subsection_variable?q=subsection_id==4&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id))&num=10000': {
      items: [{
        variable_id: {
          id: 2,
          name: 'ARZON',
          label: 'Suncream used',
          variants: [{
            id: 197,
            assessment_id: 1
          }]
        }
      }, {
        variable_id: {
          id: 3,
          name: 'SAF',
          label: 'SAF',
          variants: [{
            id: 197,
            assessment_id: 1
          }]
        }
      }, {
        variable_id: {
          id: 4,
          name: 'UVREFLECT',
          label: 'Reflection',
          variants: [{
            id: 197,
            assessment_id: 1
          }]
        }
      }, {
        variable_id: {
          id: 4,
          name: 'ARCREME',
          label: 'Skin cream used',
          variants: [{
            id: 197,
            assessment_id: 1
          }]
        }
      }]
    },
    '/api/v2/lifelines_who_when?aggs=x==variant_id&q=ll_nr.yob%3Dle%3D1970': {
      aggs: {
        matrix: [[1234], [5678]],
        xLabels: [{
          assessment_id: '1',
          id: '1'
        }, {
          assessment_id: '2',
          id: '10'
        }
        ]
      }
    },
    '/api/v2/lifelines_who_when?aggs=x==variant_id': {
      aggs: {
        matrix: [[12340], [56780]],
        xLabels: [{
          assessment_id: '1',
          id: '1'
        }, {
          assessment_id: '2',
          id: '10'
        }
        ]
      }
    }
  }
  return {
    get: (url: string) => Promise.resolve(responses[url])
  }
})

describe('actions', () => {
  describe('loadAssessments', () => {
    it('loads the assessments and commits them', async (done) => {
      const commit = jest.fn()
      await actions.loadAssessments({ commit })
      expect(commit).toHaveBeenCalledWith('updateAssessments', [
        { id: 1, name: '1A' },
        { id: 2, name: '1B' }
      ])
      done()
    })
  })

  describe('loadVariables', () => {
    it('loads variables for selected subsection', async (done) => {
      const commit = jest.fn()
      const action = actions.loadVariables({ state: { treeSelected: 4 }, commit })
      expect(commit).toHaveBeenCalledWith('updateVariables', [])
      await action
      const variant = { 'assessmentId': 1, 'assessment_id': 1, 'id': 197 }
      expect(commit).toHaveBeenCalledWith('updateVariables', [
        { 'id': 2, 'label': 'Suncream used', 'name': 'ARZON', 'variants': [variant] },
        { 'id': 3, 'label': 'SAF', 'name': 'SAF', 'variants': [variant] },
        { 'id': 4, 'label': 'Reflection', 'name': 'UVREFLECT', 'variants': [variant] },
        { 'id': 4, 'label': 'Skin cream used', 'name': 'ARCREME', 'variants': [variant] }
      ])
      done()
    })
  })

  describe('loadGridData', () => {
    it('loads new variant counts if rsql is empty', async (done) => {
      const commit = jest.fn()
      const response = actions.loadGridData({ commit, getters: { rsql: '' } })
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [])
      await response
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [
        { 'count': 12340, 'variantId': 1 },
        { 'count': 56780, 'variantId': 10 }
      ])
      done()
    })

    it('loads new variant counts if rsql is nonempty', async (done) => {
      const commit = jest.fn()
      await actions.loadGridData({ commit, getters: { rsql: 'll_nr.yob=le=1970' } })
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [])
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [
        { 'count': 1234, 'variantId': 1 },
        { 'count': 5678, 'variantId': 10 }
      ])
      done()
    })
  })
})
