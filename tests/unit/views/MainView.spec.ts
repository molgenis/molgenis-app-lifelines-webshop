import { shallowMount, createLocalVue } from '@vue/test-utils'
import MainView from '@/views/MainView.vue'
import state from '@/store/state'
import Vuex from 'vuex'

describe('MainView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any
  let actions: any

  let mutations: any
  const mocks: any = { '$route': { params: {} } }
  const isSearchResultEmpty = jest.fn()
  const isSignedIn = jest.fn()
  let setToastMock = jest.fn()

  beforeEach(() => {
    Object.assign(state, {
      state: { treeSelection: 3 },
      toast: { type: 'danger', message: 'i am not a message' }
    })

    actions = {
      loadVariables: jest.fn(),
      loadAssessments: jest.fn(),
      load: jest.fn(),
      save: jest.fn()
    }
    mutations = {
      setToast: setToastMock
    }
    store = new Vuex.Store({
      state,
      actions,
      getters: {
        isSearchResultEmpty,
        isSignedIn
      },
      mutations
    })
  })

  it('renders sidebar and content', () => {
    const wrapper = shallowMount(MainView, { store, localVue, mocks })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#main-view').exists()).toBeTruthy()
  })

  it('has a toast component that gets passed a type and message', () => {
    const wrapper = shallowMount(MainView, { store, localVue, mocks })

    expect(wrapper.find('toast-component-stub').exists()).toBeTruthy()
    expect(wrapper.find('toast-component-stub').attributes('type')).toEqual('danger')
    expect(wrapper.find('toast-component-stub').attributes('message')).toEqual('i am not a message')
  })

  it('should show a toast telling the user to signin to select/order if the user is not signed in an no other toest is shown', () => {
    state.toast = null

    shallowMount(MainView, { store, localVue, mocks })

    expect(setToastMock).toHaveBeenCalledWith(expect.anything(), { 'message': 'Please sign in to select and order variables', 'type': 'info' })
  })

  it('loads an order, after loading variables and assessments, if a orderNumber route param is present', (done) => {
    actions.loadVariables.mockReturnValueOnce(Promise.resolve())
    actions.loadAssessments.mockReturnValueOnce(Promise.resolve())

    mocks.$route.params.orderNumber = 'abcde'
    shallowMount(MainView, { store, localVue, mocks })

    setTimeout(() => {
      expect(actions.load).toHaveBeenCalledWith(expect.anything(), 'abcde', undefined)
      done()
    }, 0)
  })
})
