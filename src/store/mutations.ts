import ApplicationState, { Toast } from '@/types/ApplicationState'
import { Variable, VariableWithVariants } from '@/types/Variable'
import Assessment from '@/types/Assessment'
import Count from '@/types/Count'
import Vue from 'vue'
import GridSelection from '@/types/GridSelection'
import Filter from '@/types/Filter'
import { Section } from '@/types/Section.ts'
import { TreeParent } from '@/types/Tree'
import { Order, OrderState } from '@/types/Order'
import FormField from '@/types/FormField'

export default {
  changeOrderStatus (state: ApplicationState, status: OrderState) {
    state.order.state = status
  },
  async deleteOrder (state: ApplicationState, orderNumber:String) {
    if (state.orders) {
      state.orders = state.orders.filter((order) => order.orderNumber !== orderNumber)
    }
  },
  setOrderFormFields (state: ApplicationState, formFields: FormField[]) {
    state.orderFormFields = formFields
  },
  setLoading (state: ApplicationState, toggle: boolean) {
    if (toggle) {
      state.loading += 1
    } else if (state.loading > 0) {
      state.loading -= 1
    }
  },
  setToast (state: ApplicationState, toast: Toast) {
    state.toast.unshift(toast)
  },
  clearToast (state: ApplicationState) {
    state.toast = []
  },
  removeToast (state: ApplicationState, toast: Toast) {
    state.toast = state.toast.filter(base => {
      return base.message !== toast.message
    })
  },
  setProjectNumberRequiredFunction (state: ApplicationState, required: () => boolean) {
    const projectNumber = state.orderFormFields.find((item) => item.id === 'projectNumber')
    if (projectNumber) {
      projectNumber.required = required
    }
  },
  setOrderDetails (state: ApplicationState, order: Order) {
    state.order.name = order.name
    state.order.projectNumber = order.projectNumber
    state.order.applicationForm = order.applicationForm
  },
  restoreOrderState (state: ApplicationState, loadOrderResponse: Order) {
    state.order = {
      orderNumber: loadOrderResponse.orderNumber,
      email: loadOrderResponse.email,
      name: loadOrderResponse.name,
      projectNumber: loadOrderResponse.projectNumber,
      applicationForm: loadOrderResponse.applicationForm,
      state: loadOrderResponse.state,
      creationDate: loadOrderResponse.creationDate,
      updateDate: loadOrderResponse.updateDate,
      submissionDate: loadOrderResponse.submissionDate,
      contents: loadOrderResponse.contents,
      user: loadOrderResponse.user
    }
  },
  setOrders (state: ApplicationState, response:any) {
    state.orders = response.items
    state.ordersTotal = response.total
  },
  updateFacetFilter (state: ApplicationState, facetFilter: Filter) {
    state.facetFilter = facetFilter
  },
  updateGenderFilter (state: ApplicationState, selectedGenders: string[]) {
    state.facetFilter.gender = selectedGenders
  },
  updateSubcohortfilter (state: ApplicationState, selectedSubcohorts: string[]) {
    state.facetFilter.subcohort = selectedSubcohorts
  },
  updateSelectedAgeAt (state: ApplicationState, selectedAgeAt: any) {
    state.facetFilter.ageGroupAt1A = selectedAgeAt.ageGroupAt1A
    state.facetFilter.ageGroupAt2A = selectedAgeAt.ageGroupAt2A
    state.facetFilter.ageGroupAt3A = selectedAgeAt.ageGroupAt3A
  },
  updateYearOfBirthRangefilter (state: ApplicationState, yobRange: number[]) {
    state.facetFilter.yearOfBirthRange = yobRange
  },
  removeYearOfBirthRangefilter (state: ApplicationState) {
    state.facetFilter.yearOfBirthRange = []
  },
  removeAgeAtFilter (state: ApplicationState) {
    state.facetFilter.ageGroupAt1A = []
    state.facetFilter.ageGroupAt2A = []
    state.facetFilter.ageGroupAt3A = []
  },
  updateTreeSelection (state: ApplicationState, selection: number) {
    state.treeSelected = selection
  },
  updateTreeOpenSection (state: ApplicationState, treeOpenSection: number) {
    state.treeOpenSection = treeOpenSection
    if (treeOpenSection !== -1) {
      state.treeOpenPageSection = treeOpenSection
    }
  },
  updateSections (state: ApplicationState, sections: {[key:number]: Section}) {
    state.sections = sections
  },
  updateSubSections (state: ApplicationState, subSections: string[]) {
    state.subSectionList = subSections
  },
  updateSectionTree (state: ApplicationState, sections: TreeParent[]) {
    state.treeStructure = sections
  },
  updateVariables (state: ApplicationState, variables: {[key:number]: Variable}) {
    state.variables = variables
  },
  updateGridVariables (state: ApplicationState, gridVariables: VariableWithVariants[] | null) {
    state.gridVariables = gridVariables
  },
  updateAssessments (state: ApplicationState, assessments: { [key:number]: Assessment }) {
    state.assessments = assessments
  },
  updateVariantCounts (state: ApplicationState, variantCounts: Count[] | null) {
    state.variantCounts = variantCounts
  },
  updateParticipantCount: (state: ApplicationState, participantCount: number | null) => {
    state.participantCount = participantCount
  },
  updateGridSelection (state: ApplicationState, gridSelection: GridSelection) {
    state.gridSelection = gridSelection
  },
  updateSearchTerm (state: ApplicationState, searchTerm: string|null) {
    state.searchTerm = searchTerm
  },
  updateFilteredSections (state: ApplicationState, sections: number[]) {
    state.filteredSections = sections
  },
  updateFilteredSubsections (state: ApplicationState, subsections: number[]) {
    state.filteredSubsections = subsections
  },
  toggleGridColumn (
    { gridSelection, gridVariables }: {gridSelection: GridSelection, gridVariables: Variable[] | null},
    { assessmentId } : {assessmentId: number}
  ) {
    if (gridVariables === null) { return }
    // Check if all variables(rows) for this column are already selected.
    const columnSelected = gridVariables.every((variable) => {
      return gridSelection.hasOwnProperty(variable.id) && gridSelection[variable.id].includes(assessmentId)
    })

    if (columnSelected) {
      // Deselect all variables in this column.
      gridVariables.forEach((variable) => {
        const assessmentIndex = gridSelection[variable.id].indexOf(assessmentId)
        if (assessmentIndex >= 0) {
          gridSelection[variable.id].splice(assessmentIndex, 1)
          if (gridSelection[variable.id].length === 0) {
            Vue.delete(gridSelection, variable.id)
          }
        }
      })
    } else {
      gridVariables.forEach((variable) => {
        if (!gridSelection[variable.id]) {
          Vue.set(gridSelection, variable.id, [assessmentId])
        } else {
          const selectedAssessments = gridSelection[variable.id]
          if (!selectedAssessments.includes(assessmentId)) {
            selectedAssessments.push(assessmentId)
          }
        }
      })
    }
  },
  toggleGridRow ({ gridSelection, treeSelected }: { gridSelection: GridSelection, treeSelected: number }, { variableId, gridAssessments }: {variableId: number, gridAssessments: Assessment[] }) {
    if (gridSelection.hasOwnProperty(variableId) && (gridSelection[variableId].length === gridAssessments.length)) {
      Vue.delete(gridSelection, variableId)
    } else {
      Vue.set(gridSelection, variableId, gridAssessments.map((it) => it.id))
    }
  },
  toggleAll ({ gridSelection, gridVariables, treeSelected, treeStructure }: {gridSelection: GridSelection, gridVariables: VariableWithVariants[] | null, treeSelected: number, treeStructure: object[]}, { gridAssessments }: {gridAssessments: Assessment[] }) {
    if (gridVariables === null) { return }
    // For each variable all assessments are selected
    const allSelected = gridVariables.every((variable) => {
      return gridSelection.hasOwnProperty(variable.id) && (gridSelection[variable.id].length === gridAssessments.length)
    })
    if (allSelected) {
      gridVariables.forEach((variable) => {
        Vue.delete(gridSelection, variable.id)
      })
    } else {
      gridVariables.forEach((variable) => {
        Vue.set(gridSelection, variable.id, gridAssessments.map((it) => it.id))
      })
    }
  },
  toggleGridSelection ({ gridSelection }: { gridSelection: GridSelection }, { variableId, assessmentId }: { variableId: number, assessmentId: number }) {
    if (!gridSelection.hasOwnProperty(variableId)) {
      Vue.set(gridSelection, variableId, [assessmentId])
    } else {
      const selectedAssessments = gridSelection[variableId]
      const assessmentIndex = selectedAssessments.indexOf(assessmentId)
      if (assessmentIndex >= 0) {
        if (selectedAssessments.length === 1) {
          Vue.delete(gridSelection, variableId)
        } else {
          selectedAssessments.splice(assessmentIndex, 1)
        }
      } else {
        selectedAssessments.push(assessmentId)
      }
    }
  }
}
