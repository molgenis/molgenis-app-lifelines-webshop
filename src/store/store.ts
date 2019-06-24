import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
import ApplicationState from '@/types/ApplicationState'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
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
    }
  },
  actions: {

  }
})
