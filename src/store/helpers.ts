import Assessment from '@/types/Assessment'
import ApplicationState from '@/types/ApplicationState'
import { Cart, Selection } from '@/types/Cart'
import GridSelection from '@/types/GridSelection'
import Filter from '@/types/Filter'
import { Variable } from '@/types/Variable'

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

export const tryAction = (action: any): any =>
  (context: any, payload: any) =>
    action(context, payload).catch(
      (error: any) => context.commit('setToast', { message: getErrorMessage(error), type: 'danger' }))

export const toCart = ({ gridSelection, facetFilter, assessments, variables }: ApplicationState) : Cart => {
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
  return { selection: selections, filters: facetFilter }
}

export const fromCart = (cart: Cart, { assessments, variables }: ApplicationState) : {facetFilter: Filter, gridSelection: GridSelection} => {
  const gridSelection: GridSelection = {}
  cart.selection.forEach((selection: Selection) => {
    const assessment: Assessment | undefined = Object.values(assessments).find(it => it.name === selection.assessment)
    if (assessment === undefined) {
      throw new Error(`Cannot find assessment with name ${selection.assessment}.`)
    }
    const assessmentId = assessment.id
    selection.variables.forEach(variableName => {
      const variable: Variable | undefined = Object.values(variables).find(it => it.name === variableName)
      if (variable === undefined) {
        throw new Error(`Cannot find variable with name ${variableName}.`)
      }
      const variableId: number = variable.id
      if (!gridSelection.hasOwnProperty(variableId)) {
        gridSelection[variableId] = []
      }
      gridSelection[variableId].push(assessmentId)
    })
  })
  return { facetFilter: cart.filters, gridSelection }
}
