import { shallowMount, createLocalVue } from '@vue/test-utils'
import CountView from '@/views/CountView.vue'
import Vuex, { Store } from 'vuex'

describe('CountView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const stubs = { 'loading': '<div class="loading" />' }

  let loadParticipantCount: any
  let store: any
  let state: any

  beforeEach(() => {
    loadParticipantCount = jest.fn()
    state = {
      participantCount: null,
      rsql: ''
    }
    store = new Store({
      state,
      getters: {
        rsql: (state) => state.rsql
      },
      actions: {
        loadParticipantCount
      }
    })
  })

  it('renders nothing if state is empty', () => {
    const wrapper = shallowMount(CountView, { store, localVue, stubs })
    expect(wrapper.find('.participant-count').exists()).toBe(false)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('dispatches loadParticipantCount action if rsql changes', () => {
    shallowMount(CountView, { store, localVue })
    state.rsql = 'rsql'
    expect(loadParticipantCount).toHaveBeenCalled()
  })

  it('renders participantCount', () => {
    state.participantCount = 123456
    const wrapper = shallowMount(CountView, { store, localVue, stubs })
    expect(wrapper.find('.participant-count').text()).toEqual('123k participants')
    expect(wrapper.find('.loading').exists()).toBe(false)
  })
})
