import ApplicationState from '@/types/ApplicationState'
// @ts-ignore
import { transformToRSQL } from '@molgenis/rsql'
import Getters from '@/types/Getters'
import Variant from '@/types/Variant'
import { VariableWithVariants } from '@/types/Variable'
import CartSection from '@/types/CartSection'

import 'core-js/fn/array/flat-map'

import transforms from './transforms'

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
    return transforms.grid(state.gridVariables, getters.gridAssessments, state.variantCounts)
  },
  gridRows: (state: ApplicationState, getters: Getters) => {
    return transforms.gridRows(state.gridVariables, getters.gridColumns, state.variantCounts, getters.findZeroRowsAndCols, state.hideZeroData)
  },
  gridAssessments: (state: ApplicationState, getters: Getters) => {
    return transforms.gridAssessments(getters.variants, state.assessments, null)
  },
  gridColumns: (state: ApplicationState, getters: Getters) => {
    return transforms.gridColumns(getters.variants, state.assessments, state.facetFilter.assessment, getters.findZeroRowsAndCols, state.hideZeroData)
  },
  gridVariables: (state: ApplicationState, getters: Getters) => {
    let variables = state.gridVariables
    if (variables && state.hideZeroData) {
      variables = variables.filter((_:any, index:number) => !getters.findZeroRowsAndCols.rows.includes(index))
    }
    return variables
  },
  /**
   * This is gridSelection with applied zero row/col filter
   * active assessment filtering. Useful to count the number
   * of variables when filtering is active.
   */
  gridSelectionFiltered: (state: ApplicationState, getters: Getters) => {
    const assessmentFilter = state.facetFilter.assessment
    const emptyRowsColsFilter = getters.findZeroRowsAndCols

    // Start with all assessments (columns).
    let assessments = transforms.gridColumns(getters.variants, state.assessments, assessmentFilter)

    // Filter out zero-assessments.
    if (state.hideZeroData) {
      let emptyAssessmentIds:number[] = []
      emptyAssessmentIds = emptyRowsColsFilter.cols.map((i) => assessments[i].id)

      assessments = assessments.filter((assessment:any) => !emptyAssessmentIds.includes(assessment.id))
    }

    // Filter out deselected filter assessments.
    assessments = assessments.filter((assessment:any) => assessmentFilter.includes(assessment.id))

    const assessmentIds = assessments.map((assessment:any) => assessment.id)
    const selection:any = {}

    Object.keys(state.gridSelection).forEach((variableId:any) => {
      // Filter columns
      const variableAssessments = state.gridSelection[variableId].filter((assessmentId) => assessmentIds.includes(assessmentId))
      // @ts-ignore
      const variableIndex = state.gridVariables.findIndex((i) => i.id === Number(variableId))

      if (state.hideZeroData) {
        if (!emptyRowsColsFilter.rows.includes(variableIndex) && variableAssessments.length) {
          selection[variableId] = variableAssessments
        }
      } else if (variableAssessments.length) {
        selection[variableId] = variableAssessments
      }
    })

    return selection
  },
  gridSelections: (state: ApplicationState, getters: Getters): boolean[][] | null => {
    let selections = transforms.gridSelections(getters.gridColumns, state.gridSelection, state.gridVariables)
    if (selections && state.hideZeroData) {
      selections = selections.filter((_:any, index:number) => !getters.findZeroRowsAndCols.rows.includes(index))
    }
    return selections
  },
  gridSelectionsFiltered: (state: ApplicationState, getters: Getters) => {
    return transforms.gridSelectionsFiltered(getters.gridColumns, state.gridSelection, state.gridVariables)
  },
  findZeroRowsAndCols: (state: ApplicationState, getters: Getters) => {
    return transforms.findZeroRowsAndCols(transforms.grid(state.gridVariables, getters.gridAssessments, state.variantCounts))
  },
  numberOfSelectedItems: (state: ApplicationState, getters: Getters): number =>
    getters.gridSelections.reduce((total: number, item: boolean[]) => {
      return total + item.filter(Boolean).length
    }, 0),
  selectedVariableIds: (state: ApplicationState, getters: Getters) => {
    return Object.keys(getters.gridSelectionFiltered).length
  },
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
  cartTree: (state: ApplicationState, getters: Getters): CartSection[] => {
    return transforms.cartTree(getters.gridSelectionFiltered, state.treeStructure, state.sections, state.subSectionList, state.variables)
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
