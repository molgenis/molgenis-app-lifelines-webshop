jest.mock('@molgenis/molgenis-api-client', () => {
  const responses: {[key:string]: Object} = {
    '/api/v2/lifelines_assessment': {
      items: [
        {id: 1, name: '1A'},
        {id: 2, name: '1B'}
      ]
    }
  }
  return {
    get: (url: string) => Promise.resolve(responses[url])
  }
})

import actions from '@/store/actions'

describe('actions', () => {
  describe('loadAssessments', () => {
    it('loads the assessments and commits them', async (done) => {
      const commit = jest.fn()
      await actions.loadAssessments({commit})
      expect(commit).toHaveBeenCalledWith('updateAssessments', [
        {id: 1, name: '1A'},
        {id: 2, name: '1B'}
      ])
      done()
    })
  })
})