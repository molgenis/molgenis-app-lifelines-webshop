
import assessmentsRepository from '@/repository/assessmentsRepository'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'

jest.mock('@molgenis/molgenis-api-client', () => ({
  get: jest.fn()
}))

api.get.mockResolvedValue({
  items: [{
    id: '1',
    name: 'assessment1'
  }]
})

describe('AssessmentRepository', () => {
  describe('getAssessments', () => {
    it('should fetch the assemenents from the server if the cache is empty', () => {
      assessmentsRepository.getAssessments()
      expect(api.get).toHaveBeenCalled()
    })

    it('should not fetch from the server is the cache is filled', (done) => {
      assessmentsRepository.getAssessments().then(() => {
        expect(api.get).toBeCalledTimes(1)
        assessmentsRepository.getAssessments().then(() => {
          expect(api.get).toBeCalledTimes(1)
          done()
        })
      })
    })
  })
})
