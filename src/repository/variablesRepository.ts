// @ts-ignore
import api from '@molgenis/molgenis-api-client'

const resolveVariableIds = async (varIds: number[]) => {
  const reqIds = varIds.join(',')
  if (!reqIds.length) {
    return []
  }
  const response = await api.get(`/api/v2/lifelines_variable?attrs=id,name,label&q=id=in=(${reqIds})&num=100`)
  return response.items
}

export default {
  resolveVariableIds
}
