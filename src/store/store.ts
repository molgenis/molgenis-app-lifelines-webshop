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
    updateAgefilter (state: ApplicationState, selectedAgeGroups: String[]) {
      // state.facetFilter.age = selectedAgeGroups
    },
    updateYearOfBirthRangefilter (state: ApplicationState, yobRange: Number[]) {
      state.facetFilter.yearOfBirthRange = yobRange
    }
  },
  actions: {

  }
})
