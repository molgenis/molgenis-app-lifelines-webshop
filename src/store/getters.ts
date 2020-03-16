import ApplicationState from '@/types/ApplicationState'
// @ts-ignore
import { transformToRSQL } from '@molgenis/rsql'
import Getters from '@/types/Getters'
import Variant from '@/types/Variant'
import { VariableWithVariants } from '@/types/Variable'
import Assessment from '@/types/Assessment'
import CartSection from '@/types/CartSection'

import 'core-js/fn/array/flat-map'

import transforms from './transforms'

const paramGetters = {
  grid (state: ApplicationState, getters: Getters, filterActive = false) {
    if (state.gridVariables === null) { return null }

    return state.gridVariables.map((variable: VariableWithVariants) => {
      let gridAssessments
      if (filterActive) {
        gridAssessments = getters.gridAssessmentsActive
      } else {
        gridAssessments = getters.gridAssessments
      }
      return gridAssessments.map((assessment: Assessment) => {
        if (state.variantCounts === null) { return NaN }

        const variants: Variant[] = variable.variants.filter((variant: Variant) => variant.assessmentId === assessment.id)
        const variantCounts: number[] = []

        // Get all counts for this variant.
        variants.forEach((variant: Variant) => {
          // @ts-ignore
          const variantCount = state.variantCounts.find((variantCount) => variant.id === variantCount.variantId)
          if (variantCount) {
            variantCounts.push(variantCount.count)
          } else {
            variantCounts.push(0)
          }
        })

        if (variantCounts.every((value) => value === 0)) { return 0 }
        if (variantCounts.every((value) => value <= 0)) { return -1 } else {
          // Filter out any below threshold.
          const positiveVariantCounts = variantCounts.filter((value) => value >= 0)
          // Sum it.
          return positiveVariantCounts.reduce((sum: number, nextValue: number) => sum + nextValue)
        }
      })
    })
  },
  gridAssessments: (state: ApplicationState, getters: Getters, filterActive = false) => {
    const assessmentIds: number[] = getters.variants.reduce((acc: number[], variant: Variant) => acc.includes(variant.assessmentId) ? acc : [...acc, variant.assessmentId], [])
    const gridAssessments = Object.values(state.assessments).filter(assessment => assessmentIds.includes(assessment.id))

    if (filterActive) {
      return gridAssessments.filter((i:any) => state.facetFilter.assessment.includes(i.id))
    } else {
      return gridAssessments
    }
  }
}

export default {
  isSignedIn: (state: ApplicationState): boolean => state.context.context && state.context.context.authenticated,
  variants: (state: ApplicationState): Variant[] => {
    if (state.gridVariables === null) { return [] }

    return state.gridVariables.reduce((result: Variant[], variable: VariableWithVariants): Variant[] => {
      return variable.variants.reduce((accumulator: Variant[], variant: Variant) => {
        if (accumulator.some((candidate: Variant): boolean => candidate.id === variant.id)) {
          return accumulator
        } else {
          return [...accumulator, variant]
        }
      }, result)
    }, [])
  },
  variantIds: (state: ApplicationState, getters: Getters): number[] =>
    getters.variants.map(variant => variant.id),
  rsql: (state: ApplicationState) => {
    let operands: Object[] = []
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
      operands.push({
        operator: 'OR',
        operands: state.facetFilter.subcohort.map((subcohort) => ({
          selector: `ll_nr.subcohort${subcohort}_group`,
          comparison: '==',
          arguments: true
        }))
      })
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
  grid: (state: ApplicationState, getters: Getters) => {
    return paramGetters.grid(state, getters, false)
  },
  gridActive: (state: ApplicationState, getters: Getters) => {
    return paramGetters.grid(state, getters, true)
  },
  gridAssessments: (state: ApplicationState, getters: Getters) => {
    return paramGetters.gridAssessments(state, getters, false)
  },
  gridAssessmentsActive: (state: ApplicationState, getters: Getters) => {
    return paramGetters.gridAssessments(state, getters, true)
  },
  gridMarkers: function (state: ApplicationState, getters: Getters) {
    const selected:any = { all: true, row: [], col: [] }
    if (!getters.gridActive.length) {
      return selected
    }
    selected.col = getters.gridActive[0].map(i => true)

    getters.gridActive.forEach((row, i) => {
      selected.row[i] = true
      row.forEach((col, j) => {
        if (!getters.gridSelections[i][j]) {
          selected.col[j] = false
          selected.row[i] = false
          selected.all = false
        }
      })
    })
    return selected
  },
  gridSelections: (state: ApplicationState, getters: Getters): boolean[][] | null => {
    if (state.gridVariables === null) { return null }
    return state.gridVariables.map(variable => {
      const variableSelections = state.gridSelection[variable.id]
      return getters.gridAssessmentsActive.map(assessment => !!variableSelections && variableSelections.includes(assessment.id))
    })
  },
  numberOfSelectedItems: (state: ApplicationState, getters: Getters): number =>
    getters.gridSelections.reduce((total: number, item: boolean[]) => {
      return total + item.filter(Boolean).length
    }, 0),
  treeStructure: (state: ApplicationState, getters: Getters) => {
    const loadedSection: boolean = Object.keys(state.sections).length > 0
    const loadedSubSection: boolean = state.subSectionList.length > 0
    const loadedTreeStructure: boolean = state.treeStructure.length > 0
    if (loadedSection && loadedSubSection && loadedTreeStructure) {
      // return full tree
      return transforms.treeStructure(state.treeStructure, state.sections, state.subSectionList)
    } else if (loadedSection) {
      // return temporary partial tree
      return Object.values(state.sections)
    }
    return []
  },
  cartTree: (state: ApplicationState): CartSection[] => {
    return transforms.cartTree(state.gridSelection, state.treeStructure, state.sections, state.subSectionList, state.variables)
  },
  isGridLoading: (state: ApplicationState): boolean => {
    return (state.gridVariables === null || state.variantCounts === null) && state.treeSelected !== -1
  },
  searchTermQuery: (state: ApplicationState) => {
    const operands = []
    const subsectionFiltered = state.treeSelected >= 0

    if (subsectionFiltered) {
      operands.push({ selector: 'subsection_id', comparison: '==', arguments: state.treeSelected })
    }

    if (state.searchTerm) {
      const prefix = state.treeSelected >= 0 ? 'variable_id.' : ''
      let searchTermoperands:any = [
        { selector: `${prefix}name`, comparison: '=like=', arguments: state.searchTerm },
        { selector: `${prefix}label`, comparison: '=like=', arguments: state.searchTerm }
      ]

      if (!state.searchExact) {
        searchTermoperands = searchTermoperands.concat([
          { selector: `${prefix}definition_en`, comparison: '=q=', arguments: state.searchTerm },
          { selector: `${prefix}definition_nl`, comparison: '=q=', arguments: state.searchTerm },
          { selector: `${prefix}options.label_en`, comparison: '=like=', arguments: state.searchTerm },
          { selector: `${prefix}options.label_nl`, comparison: '=like=', arguments: state.searchTerm }
        ])
      }

      operands.push({ operator: 'OR', operands: searchTermoperands })
    }
    if (operands.length > 0) {
      return transformToRSQL({ operator: 'AND', operands })
    } else {
      return null
    }
  },
  isSearchResultEmpty: (state: ApplicationState): boolean => {
    return !!(state.searchTerm && state.gridVariables && state.gridVariables.length === 0)
  },
  hasManagerRole: (state: ApplicationState) => state.context.context.roles.includes('ROLE_LIFELINES_MANAGER')
}
