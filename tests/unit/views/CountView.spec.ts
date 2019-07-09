import { shallowMount, createLocalVue } from '@vue/test-utils'
import CountView from '@/views/CountView.vue'
import Vuex, { Store } from 'vuex'
import state from '@/store/state'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

describe('CountView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const loadParticipantCount = jest.fn()
  const store = new Store({
    state,
    getters,
    mutations,
    actions: {
      loadParticipantCount
    }
  })

  it('renders nothing if state is empty', () => {
    store.commit('updateParticipantCount', null)
    const wrapper = shallowMount(CountView, { store, localVue })
    expect(wrapper.find('.participant-count').exists()).toBeFalsy()
  })

  it('dispatches loadParticipantCount action if rsql changes', () => {
    store.commit('updateParticipantCount', null)
    const wrapper = shallowMount(CountView, { store, localVue })
    store.commit('updateGenderFilter', ['1'])
    expect(loadParticipantCount).toHaveBeenCalled()
  })

  it('renders participantCount', () => {
    store.commit('updateParticipantCount', 123456)
    const wrapper = shallowMount(CountView, { store, localVue })
    expect(wrapper.find('.participant-count').text()).toEqual('123k participants')
  })
})
