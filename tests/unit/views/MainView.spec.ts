import { shallowMount, createLocalVue } from '@vue/test-utils'
import MainView from '@/views/MainView.vue'
import Vuex from 'vuex'

describe('MainView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any

  beforeEach(() => {
    let state: any

    state = {
      toast: { type: 'danger', message: 'i am not a message' }
    }

    store = new Vuex.Store({
      state
    })
  })

  it('renders sidebar and content', () => {
    const wrapper = shallowMount(MainView, { store, localVue })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#main-view').exists()).toBeTruthy()
  })

  it('has a toast component that gets passed a type and message', () => {
    const wrapper = shallowMount(MainView, { store, localVue })

    expect(wrapper.find('toast-component-stub').exists()).toBeTruthy()
    expect(wrapper.find('toast-component-stub').attributes('type')).toEqual('danger')
    expect(wrapper.find('toast-component-stub').attributes('message')).toEqual('i am not a message')
  })
})
