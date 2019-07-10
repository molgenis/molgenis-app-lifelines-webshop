import ApplicationState, { Toast } from '@/types/ApplicationState'
import { Variable, VariableWithVariants } from '@/types/Variable'
import Assessment from '@/types/Assessment'
import Count from '@/types/Count'
import Vue from 'vue'
import GridSelection from '@/types/GridSelection'
import Filter from '@/types/Filter'
import { Section } from '@/types/Section.ts'

export default {
  setToast (state: ApplicationState, toast: Toast) {
    state.toast = toast
  },
  clearToast (state: ApplicationState) {
    state.toast = null
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
  updateTreeOpenSection (state: ApplicationState, treeOpenSection: string) {
    state.treeOpenSection = treeOpenSection
  },
  updateSections (state: ApplicationState, sections: {[key:number]: Section}) {
    state.sections = sections
  },
  updateSubSections (state: ApplicationState, subSections: string[]) {
    state.subSectionList = subSections
  },
  updateSectionTree (state: ApplicationState, sections: string[]) {
    state.treeStructure = sections
  },
  updateVariables (state: ApplicationState, variables: {[key:number]: Variable}) {
    state.variables = variables
  },
  updateGridVariables (state: ApplicationState, gridVariables: VariableWithVariants[]) {
    state.gridVariables = gridVariables
  },
  updateAssessments (state: ApplicationState, assessments: { [key:number]: Assessment }) {
    state.assessments = assessments
  },
  updateVariantCounts (state: ApplicationState, variantCounts: Count[]) {
    state.variantCounts = variantCounts
  },
  updateGridSelection (state: ApplicationState, gridSelection: GridSelection) {
    state.gridSelection = gridSelection
  },
  toggleGridColumn ({ gridSelection, gridVariables }: {gridSelection: GridSelection, gridVariables: Variable[]}, { assessmentId } : {assessmentId: number}) {
    const allSelected = gridVariables.every((variable) => gridSelection.hasOwnProperty(variable.id) && gridSelection[variable.id].includes(assessmentId))
    if (allSelected) {
      gridVariables.forEach((variable) => {
        const selectedAssessments = gridSelection[variable.id]
        const assessmentIndex = selectedAssessments.indexOf(assessmentId)
        if (assessmentIndex >= 0) {
          selectedAssessments.splice(assessmentIndex, 1)
        }
      })
    } else {
      gridVariables.forEach((variable) => {
        if (!gridSelection.hasOwnProperty(variable.id)) {
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
  toggleGridRow ({ gridSelection }: { gridSelection: GridSelection }, { variableId, gridAssessments }: {variableId: number, gridAssessments: Assessment[] }) {
    if (gridSelection.hasOwnProperty(variableId) && (gridSelection[variableId].length === gridAssessments.length)) {
      Vue.delete(gridSelection, variableId)
    } else {
      Vue.set(gridSelection, variableId, gridAssessments.map((it) => it.id))
    }
  },
  toggleAll ({ gridSelection, gridVariables }: {gridSelection: GridSelection, gridVariables: VariableWithVariants[]}, { gridAssessments }: {gridAssessments: Assessment[] }) {
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
  toggleGridSelection ({ gridSelection }: { gridSelection: GridSelection },
    { variableId, assessmentId }: { variableId: number, assessmentId: number }) {
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
