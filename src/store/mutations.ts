import ApplicationState from '@/types/applicationState'
import Variable from '@/types/Variable'
import Assessment from '@/types/Assessment'
import Count from '@/types/Count'
import Vue from 'vue'
import GridSelection from '@/types/GridSelection'

export default {
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
  updateSection (state: ApplicationState, sections: string[]) {
    state.sectionList = sections
  },
  updateTreeStructure (state: ApplicationState, sections: string[]) {
    state.treeStructure = sections
  },
  updateSubSection (state: ApplicationState, subSections: string[]) {
    state.subSectionList = subSections
  },
  updateVariables (state: ApplicationState, variables: Variable[]) {
    state.variables = variables
  },
  updateAssessments (state: ApplicationState, assessments: Assessment[]) {
    state.assessments = assessments
  },
  updateVariantCounts (state: ApplicationState, variantCounts: Count[]) {
    state.variantCounts = variantCounts
  },
  toggleGridSelection ({ gridSelection }: { gridSelection: GridSelection },
    { variableId, assessmentId }: { variableId: number, assessmentId: number }) {
    if (!gridSelection.hasOwnProperty(variableId)) {
      Vue.set(gridSelection, variableId, [assessmentId])
    } else {
      const selectedAssessments = gridSelection[variableId]
      const assessmentIndex = selectedAssessments.indexOf(assessmentId)
      if (assessmentIndex >= 0) {
        selectedAssessments.splice(assessmentIndex, 1)
      } else {
        selectedAssessments.push(assessmentId)
      }
    }
  }
}
