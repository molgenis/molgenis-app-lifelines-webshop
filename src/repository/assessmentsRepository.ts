// @ts-ignore
import api from '@molgenis/molgenis-api-client'

interface Cache { [index:string] : {id: string, name: string} }
interface AssessmentResponse { id: string, name: string }

let assessmentsCache: Cache = {}

const getAssessments:() => Promise<Cache> = async () => {
// All or nothing cache if its full use it, else fill it up
  if (!Object.keys(assessmentsCache).length) {
    const response = await api.get(`/api/v2/lifelines_assessment?attrs=id,name&num=100`)
    assessmentsCache = response.items.reduce((accum:Cache, item: AssessmentResponse) => {
      accum[item.id] = {
        id: item.id,
        name: item.name
      }

      return accum
    }, assessmentsCache)
  }

  return Promise.resolve(assessmentsCache)
}

export default {
  getAssessments
}
