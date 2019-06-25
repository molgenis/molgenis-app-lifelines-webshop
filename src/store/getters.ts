import ApplicationState from '@/types/ApplicationState'
// @ts-ignore
import { transformToRSQL } from '@molgenis/rsql'
import Getters from '@/types/Getters'

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
    let operands: Object[] = []
    if (getters.variantIds.length > 0) {
      operands.push({
        selector: 'variant_id',
        comparison: '=in=',
        arguments: getters.variantIds
      })
    } else return ''
    if (state.facetFilter.ageGroupAt1A.length > 0) {
      operands.push({
        operator: 'OR',
        operands: state.facetFilter.ageGroupAt1A.map((ageGroup) => ({
          selector: 'll_nr.age_group_at_1a',
          comparison: '==',
          arguments: ageGroup
        }))
      })
    }
    if (state.facetFilter.ageGroupAt2A.length > 0) {
      operands.push({
        operator: 'OR',
        operands: state.facetFilter.ageGroupAt2A.map((ageGroup) => ({
          selector: 'll_nr.age_group_at_2a',
          comparison: '==',
          arguments: ageGroup
        }))
      })
    }
    if (state.facetFilter.ageGroupAt3A.length > 0) {
      operands.push({
        operator: 'OR',
        operands: state.facetFilter.ageGroupAt3A.map((ageGroup) => ({
          selector: 'll_nr.age_group_at_3a',
          comparison: '==',
          arguments: ageGroup
        }))
      })
    }
    if (state.facetFilter.subcohort.length > 0) {
      operands = [
        ...operands,
        ...state.facetFilter.subcohort.map(subcohort => ({
          selector: `ll_nr.subcohort${subcohort}_group`,
          comparison: '==',
          arguments: true
        })
        )]
    }
    if (state.facetFilter.gender.length > 0) {
      operands.push({
        operands: state.facetFilter.gender.map(
          (gender) => ({
            selector: 'll_nr.gender_group',
            comparison: '==',
            arguments: gender
          })),
        operator: 'OR'
      })
    }
    if (state.facetFilter.yearOfBirthRange.length > 0) {
      operands.push({
        selector: 'll_nr.year_of_birth',
        comparison: '=ge=',
        arguments: state.facetFilter.yearOfBirthRange[0]
      })
    }
    if (state.facetFilter.yearOfBirthRange.length > 1) {
      operands.push({
        selector: 'll_nr.year_of_birth',
        comparison: '=le=',
        arguments: state.facetFilter.yearOfBirthRange[1]
      })
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
        const selectionForVariable = state.gridSelection[variable.id]
        const selected = !!selectionForVariable && selectionForVariable.includes(assessment.id)
        return { count, selected }
      })
    )
}
