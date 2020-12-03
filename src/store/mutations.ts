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
import transforms from './transforms'

export default {
  setZeroDataVisibility (state: ApplicationState, visibility: boolean) {
    state.facetFilter.hideZeroData = visibility
  },
  assessmentsActive (state: ApplicationState, selectedAssessments: number[]) {
    state.facetFilter.assessment = selectedAssessments
  },
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
  setSuccessMessage (state: ApplicationState, message: string) {
    state.toast = [{
      message,
      type: 'success',
      textType: 'light',
      title: 'Success',
      timeout: Vue.prototype.$global.toastTimeoutTime
    }]
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
      requestId: loadOrderResponse.requestId,
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
  appendGridSelection (state: ApplicationState, gridSelection: GridSelection) {
    const selection = Object.assign(JSON.parse(JSON.stringify(state.gridSelection)), gridSelection)
    Vue.set(state, 'gridSelection', selection)
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
  toggleGridColumn (state: ApplicationState, assessmentId: number) {
    if (state.gridVariables === null) { return }
    let filteredGridVariables = state.gridVariables

    if (state.facetFilter.hideZeroData) {
      const variants = transforms.variants(state.gridVariables)
      const gridColumns = transforms.gridColumns(variants, state.assessments)
      const grid = transforms.grid(state.gridVariables, gridColumns, state.variantCounts)
      const rowColFilter = transforms.findZeroRowsAndCols(grid)

      filteredGridVariables = state.gridVariables.filter((_:any, index:number) => !rowColFilter.rows.includes(index))
    }

    // Check if all variables(rows) for this column are already selected.
    const columnSelected = filteredGridVariables.every((variable) => {
      return state.gridSelection.hasOwnProperty(variable.id) && state.gridSelection[variable.id].includes(assessmentId)
    })

    if (columnSelected) {
      // Deselect all visible variables in this column.
      filteredGridVariables.forEach((variable) => {
        const assessmentIndex = state.gridSelection[variable.id].indexOf(assessmentId)
        if (assessmentIndex >= 0) {
          state.gridSelection[variable.id].splice(assessmentIndex, 1)
          if (state.gridSelection[variable.id].length === 0) {
            Vue.delete(state.gridSelection, variable.id)
          }
        }
      })
    } else {
      filteredGridVariables.forEach((variable) => {
        if (!state.gridSelection[variable.id]) {
          Vue.set(state.gridSelection, variable.id, [assessmentId])
        } else {
          const selectedAssessments = state.gridSelection[variable.id]
          if (!selectedAssessments.includes(assessmentId)) {
            selectedAssessments.push(assessmentId)
          }
        }
      })
    }
  },
  /**
   * Toggle assessment selection (columns) on a variable(row) and
   * its sub-variables (optional extra rows).
   * @param state Vuex state
   * @param variableId Reference to the row to toggle
   * @param forceToggle Force toggle state, ignoring current cell selections
  */
  toggleGridRow (state:any, variableId: number) {
    const variable = state.gridVariables.find((i:any) => i.id === variableId)

    const variants = transforms.variants(state.gridVariables)
    const assessmentFilter = state.facetFilter.assessment

    let gridColumns: Assessment[] = transforms.gridAssessments(variants, state.assessments, assessmentFilter, true)
    const rowColFilter = transforms.findZeroRowsAndCols(transforms.grid(state.gridVariables, gridColumns, state.variantCounts))
    const filteredGridColumns = transforms.gridColumns(variants, state.assessments, assessmentFilter, rowColFilter, state.facetFilter.hideZeroData)
    const gridAssessments = transforms.gridAssessments(variants, state.assessments, state.facetFilter, false)

    const gridSelections:any = transforms.gridSelections(gridAssessments, state.gridSelection, state.gridVariables)

    const targetRows = [variable.id].concat(variable.subvariables.map((v:any) => v.id))

    const rowToggled = targetRows.every((variableId) => {
      const gridSelection = gridSelections[state.gridVariables.findIndex((i:any) => i.id === variableId)]
      const rowSelected = gridSelection.every((i:boolean, index: number) => {
        if (state.facetFilter.hideZeroData && rowColFilter.cols.includes(index)) {
          return true
        }
        return i
      })

      return rowSelected
    })

    for (const variableId of targetRows) {
      let hiddenSelected = []
      // Cells that are in the grid selection but part of an invisible row/column due to zero filtering.
      if (state.gridSelection[variableId]) {
        hiddenSelected = state.gridSelection[variableId].filter((i:any) => !filteredGridColumns.find((_i:any) => i === _i.id))
      }

      if (!rowToggled) {
        Vue.set(state.gridSelection, variableId, filteredGridColumns.map((assessment:any) => assessment.id))
      } else {
        if (hiddenSelected.length) {
          Vue.set(state.gridSelection, variableId, hiddenSelected)
        } else {
        // No hidden cells; just clear the whole selection row.
          Vue.delete(state.gridSelection, variableId)
        }
      }
    }
  },
  toggleAll (state:any) {
    const variants = transforms.variants(state.gridVariables)
    let gridColumns: Assessment[] = transforms.gridAssessments(variants, state.assessments, state.facetFilter.assessment, true)
    let filteredGridVariables = state.gridVariables
    const rowColFilter = transforms.findZeroRowsAndCols(transforms.grid(state.gridVariables, gridColumns, state.variantCounts))
    // Exclude hidden rows and columns from the selection.
    if (state.facetFilter.hideZeroData) {
      gridColumns = gridColumns.filter((_:any, index:number) => !rowColFilter.cols.includes(index))
      filteredGridVariables = state.gridVariables.filter((_:any, index:number) => !rowColFilter.rows.includes(index))
    }
    // For each variable all assessments are selected
    const allSelected = filteredGridVariables.every((variable:any) => {
      if (state.gridSelection.hasOwnProperty(variable.id) && state.gridSelection[variable.id].length) {
        const visibleSelectedRowCells = state.gridSelection[variable.id].filter((i:any) => gridColumns.find((_i) => i === _i.id))
        return visibleSelectedRowCells.length === gridColumns.length
      }
      return false
    })

    if (allSelected) {
      filteredGridVariables.forEach((variable:any) => {
        const hiddenSelectedRowCells = state.gridSelection[variable.id].filter((i:any) => !gridColumns.find((_i) => i === _i.id))
        // Deselect all visible cells in the row; keep the hidden selected cells.
        if (hiddenSelectedRowCells.length) {
          Vue.set(state.gridSelection, variable.id, hiddenSelectedRowCells)
        } else {
          Vue.delete(state.gridSelection, variable.id)
        }
      })
    } else {
      filteredGridVariables.forEach((variable:any) => {
        let hiddenSelectedRowCells:any = []
        if (state.gridSelection[variable.id]) {
          hiddenSelectedRowCells = state.gridSelection[variable.id].filter((i:any) => !gridColumns.find((_i) => i === _i.id))
        }
        // Select all visible cells in the row; add the already selected invisible ones as well.
        Vue.set(state.gridSelection, variable.id, gridColumns.map((it) => it.id).concat(hiddenSelectedRowCells))
      })
    }
  },
  /**
   * Toggle a selected cell in a variable row and its potential
   * sub-cells (sub-variable rows).
   * @param state Vuex store
   * @param options
   */
  toggleGridSelection (state:any, { variableId, assessmentId }: { variableId: number, assessmentId: number }) {
    const variable = state.gridVariables.find((v:any) => v.id === variableId)
    if (!variable) { throw new Error('invalid variable argument') }

    let cellLength = 1 + (variable.subvariables ? variable.subvariables.length : 0)

    // Keep track of all selected cells (variableId(row)/columnIndex)
    const selectedCells:any = {}
    if (state.gridSelection[variableId]) {
      const columnIndex = state.gridSelection[variableId].indexOf(assessmentId)
      if (columnIndex !== -1) { selectedCells[variableId] = columnIndex }
    }

    for (const subvariable of variable.subvariables) {
      const selection = state.gridSelection[subvariable.id]
      if (selection) {
        const columnIndex = selection.indexOf(assessmentId)
        if (columnIndex !== -1) { selectedCells[subvariable.id] = columnIndex }
      }
    }

    if (Object.keys(selectedCells).length === cellLength) {
      // Cell and sub-cells are toggled; untoggle all.
      for (const [variableId, columnIndex] of Object.entries(selectedCells)) {
        state.gridSelection[variableId].splice(columnIndex, 1)
        if (state.gridSelection[variableId].length === 0) {
          Vue.delete(state.gridSelection, variableId)
        }
      }
    } else {
      // Toggle all cells and sub-cells.
      if (!state.gridSelection[variableId]) {
        Vue.set(state.gridSelection, variableId, [assessmentId])
      } else if (!state.gridSelection[variableId].includes(assessmentId)) {
        state.gridSelection[variableId].push(assessmentId)
      }
      for (const subvariable of variable.subvariables) {
        if (!state.gridSelection[subvariable.id]) {
          Vue.set(state.gridSelection, subvariable.id, [assessmentId])
        } else if (!state.gridSelection[subvariable.id].includes(assessmentId)) {
          state.gridSelection[subvariable.id].push(assessmentId)
        }
      }
    }
  }
}
