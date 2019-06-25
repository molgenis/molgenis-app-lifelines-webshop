import ApplicationState from '@/types/applicationState'
import Variable from '@/types/Variable'

export default {
  updateGenderFilter (state: ApplicationState, selectedGenders: String[]) {
    state.facetFilter.gender = selectedGenders
  },
  updateSubcohortfilter (state: ApplicationState, selectedSubcohorts: String[]) {
    state.facetFilter.subcohort = selectedSubcohorts
  },
  updateSelectedAgeAt (state: ApplicationState, selectedAgeAt: any) {
    state.facetFilter.ageGroupAt1A = selectedAgeAt.ageGroupAt1A
    state.facetFilter.ageGroupAt2A = selectedAgeAt.ageGroupAt2A
    state.facetFilter.ageGroupAt3A = selectedAgeAt.ageGroupAt3A
  },
  updateYearOfBirthRangefilter (state: ApplicationState, yobRange: Number[]) {
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
  updateTreeSelection (state: ApplicationState, selection: Number) {
    state.treeSelected = selection
  },
  updateSection (state: ApplicationState, sections: String[]) {
    state.sectionList = sections
  },
  updateTreeStructure (state: ApplicationState, sections: String[]) {
    state.treeStructure = sections
  },
  updateSubSection (state: ApplicationState, subSections: String[]) {
    state.subSectionList = subSections
  },
  updateVariables (state: ApplicationState, variables: Variable[]) {
    state.variables = variables
  }
}
