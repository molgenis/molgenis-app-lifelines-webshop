import ApplicationState from '@/types/ApplicationState'
import { Cart, Selection, CartFilter } from '@/types/Cart'
import GridSelection from '@/types/GridSelection'
import Filter from '@/types/Filter'
import FacetOption from '@/types/FacetOption'
import Vue from 'vue'

export const getErrorMessage = (response: any) =>
  response.errors
    ? response.errors[0].code
      ? `${response.errors[0].message} (${response.errors[0].code})`
      : response.errors[0].message
    : response.status
      ? response.statusText
        ? `${response.statusText} (${response.status})`
        : `Error status: ${response.status}`
      : response.message
        ? response.message
        : 'Unknown error'

export const tryAction = (action: any): any => {
  return (context: any, payload: any) => {
    const errorHandler = (error: any) => {
      context.commit('setToast', { message: getErrorMessage(error), type: 'danger', textType: 'light', title: 'Error' })
      // @ts-ignore
      // The exception is also logged to console, but not during tests.
      console.trace ? console.trace(error) : console.log(error)
    }

    return action(context, payload).catch(errorHandler)
  }
}

export const successMessage = (message: string, commit: any) => {
  commit('setToast', { message, type: 'success', textType: 'light', title: 'Success', timeout: Vue.prototype.$global.toastTimeoutTime })
}

const toCartSelection = ({ gridSelection, assessments, variables }: ApplicationState) : Selection[] => {
  const selections: Selection[] = []
  Object.keys(gridSelection).forEach((variableKey: string) => {
    const variableId: number = parseInt(variableKey, 10)
    const variableName: string = variables[variableId].name
    const assessmentNames: string[] = gridSelection[variableId].map(assessmentId => assessments[assessmentId].name)
    assessmentNames.forEach(assessmentName => {
      let selection = selections.find(it => it.assessment === assessmentName)
      if (selection === undefined) {
        selection = { assessment: assessmentName, variables: [] }
        selections.push(selection)
      }
      selection.variables.push(variableName)
    })
  })
  return selections
}

const toCartId = (options: FacetOption[], id: string, groupName: string): string => {
  const option = options.find(candidateOption => candidateOption.value === id)
  if (option === undefined) {
    throw new Error(`Cannot find ${groupName} facet option with id ${id}`)
  }
  return option.text
}

const toCartFilters = ({ genderOptions, subcohortOptions, ageGroupOptions, facetFilter }: ApplicationState) : CartFilter => {
  const result: CartFilter = {}
  if (facetFilter.ageGroupAt1A.length > 0) {
    result.ageGroupAt1A = facetFilter.ageGroupAt1A.map(id => toCartId(ageGroupOptions, id, 'ageGroupAt1A'))
  }
  if (facetFilter.ageGroupAt2A.length > 0) {
    result.ageGroupAt2A = facetFilter.ageGroupAt2A.map(id => toCartId(ageGroupOptions, id, 'ageGroupAt2A'))
  }
  if (facetFilter.ageGroupAt3A.length > 0) {
    result.ageGroupAt3A = facetFilter.ageGroupAt3A.map(id => toCartId(ageGroupOptions, id, 'ageGroupAt3A'))
  }
  if (facetFilter.gender.length > 0) {
    result.gender = facetFilter.gender.map(id => toCartId(genderOptions, id, 'gender'))
  }
  if (facetFilter.subcohort.length > 0) {
    result.subcohort = facetFilter.subcohort.map(id => toCartId(subcohortOptions, id, 'subcohort'))
  }
  if (facetFilter.yearOfBirthRange.length > 0) {
    result.yearOfBirthRange = facetFilter.yearOfBirthRange
  }
  return result
}

export const toCart = (state: ApplicationState) : Cart => {
  return { selection: toCartSelection(state), filters: toCartFilters(state) }
}

const gridSelectionFromCart = (cartSelection: Selection[], { variables, assessments }: ApplicationState) : GridSelection => {
  const gridSelection: GridSelection = {}
  const lookupMap:any = { assessments: {}, variables: {} }

  for (const assessment of Object.values(assessments)) {
    lookupMap.assessments[assessment.name] = assessment
  }

  for (const variable of Object.values(variables)) {
    lookupMap.variables[variable.name] = variable
  }

  for (const selection of cartSelection) {
    const assessment = lookupMap.assessments[selection.assessment]
    if (assessment === undefined) {
      throw new Error(`Cannot find assessment with name ${selection.assessment}.`)
    }

    selection.variables.forEach(variableName => {
      const variable = lookupMap.variables[variableName]
      if (variable === undefined) {
        throw new Error(`Cannot find variable with name ${variableName}.`)
      }

      if (!gridSelection.hasOwnProperty(variable.id)) {
        gridSelection[variable.id] = []
      }
      gridSelection[variable.id].push(assessment.id)
    })
  }

  return gridSelection
}

const toFilterId = (options: FacetOption[], text: string, groupName: string): string => {
  const option = options.find(candidateOption => candidateOption.text === text)
  if (option === undefined) {
    throw new Error(`Cannot find ${groupName} facet option with text ${text}`)
  }
  return option.value
}

const facetFilterFromCart = (filters: CartFilter, { ageGroupOptions, genderOptions, subcohortOptions }: ApplicationState) : Filter => ({
  ageGroupAt1A: (filters.ageGroupAt1A || []).map(optionText => toFilterId(ageGroupOptions, optionText, 'ageGroupAt1A')),
  ageGroupAt2A: (filters.ageGroupAt2A || []).map(optionText => toFilterId(ageGroupOptions, optionText, 'ageGroupAt2A')),
  ageGroupAt3A: (filters.ageGroupAt3A || []).map(optionText => toFilterId(ageGroupOptions, optionText, 'ageGroupAt3A')),
  gender: (filters.gender || []).map(optionText => toFilterId(genderOptions, optionText, 'gender')),
  subcohort: (filters.subcohort || []).map(optionText => toFilterId(subcohortOptions, optionText, 'subcohort')),
  yearOfBirthRange: (filters.yearOfBirthRange || [])
})

export const fromCart = (cart: Cart, state: ApplicationState) : {facetFilter: Filter, gridSelection: GridSelection} => ({
  facetFilter: facetFilterFromCart(cart.filters, state),
  gridSelection: gridSelectionFromCart(cart.selection, state)
})
