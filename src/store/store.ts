import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'

import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
