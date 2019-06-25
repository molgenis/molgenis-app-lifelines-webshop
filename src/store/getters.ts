import ApplicationState from '@/types/ApplicationState'
// @ts-ignore
import {transformToRSQL} from '@molgenis/rsql'
import Getters from '@/types/Getters'
import Count from '@/types/Count';

export default {
  variantIds: (state: ApplicationState) =>
    Array.from(
      new Set(
        state.variables.flatMap(
          variable => variable.variants.map(
            variant => variant.id
          )
        )
      )
    ),
  rsql: (state: ApplicationState, getters: Getters) => {
    const operands = []
    if (getters.variantIds.length > 0) {
      const variantFilter = {
        selector: 'variant_id',
        comparison: '=in=',
        arguments: getters.variantIds
      }
      operands.push(variantFilter)
    }
    if (operands.length == 0) {
      return ''
    }
    return transformToRSQL({
      operator: 'AND',
      operands
    })
  },
  gridAssessments: (state: ApplicationState) => {
    const assessmentIds = new Set(state.variables.flatMap(variable => variable.variants.map(variant => variant.assessmentId)))
    return state.assessments.filter(assessment => assessmentIds.has(assessment.id))
  },
  grid: (state: ApplicationState, getters: Getters) => 
    state.variables.map(variable => 
      getters.gridAssessments.map(assessment => {
        const variants = variable.variants.filter(variant => variant.assessmentId === assessment.id)
        const count = variants.reduce((sum, variant) => {
          const variantCount = state.variantCounts.find((variantCount) => variant.id === variantCount.variantId)
          return sum + (variantCount ? variantCount.count : 0)
        }, 0)
        return {
          count,
          selected: false
        }
      })
    )
}
