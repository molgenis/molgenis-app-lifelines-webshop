import { shallowMount, createLocalVue } from '@vue/test-utils'
import MainView from '@/views/MainView.vue'
import state from '../fixtures/state'
import Vuex from 'vuex'
import '@/globals/variables'

describe('MainView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any
  let actions: any

  let mutations: any
  const mocks: any = { '$route': { params: {} } }
  const stubs: any = { 'toast-component': true }
  const isSearchResultEmpty = jest.fn()
  const isSignedIn = jest.fn()
  let setToastMock = jest.fn()
  const setLoading = jest.fn()

  beforeEach(() => {
    Object.assign(state, {
      state: { treeSelection: 3, gridSelection: { foo: { f: 1 }, bar: { b: 2 } } },
      toast: { type: 'danger', message: 'i am not a message' }
    })

    actions = {
      loadVariables: jest.fn(),
      loadAssessments: jest.fn(),
      loadOrderAndCart: jest.fn(),
      setSuccessMessage: jest.fn(),
      save: jest.fn()
    }
    mutations = {
      setLoading: setLoading,
      setToast: setToastMock,
      setSuccessMessage: jest.fn()
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
    const wrapper = shallowMount(MainView, { store, localVue, mocks, stubs })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#main-view').exists()).toBeTruthy()
  })

  it('loads an order, after loading variables and assessments, if a orderNumber route param is present', (done) => {
    actions.loadVariables.mockReturnValueOnce(Promise.resolve())
    actions.loadAssessments.mockReturnValueOnce(Promise.resolve())
    actions.loadOrderAndCart.mockReturnValueOnce(Promise.resolve(true))
    mocks.$route.params.orderNumber = 'abcde'
    shallowMount(MainView, { store, localVue, mocks, stubs })
    setTimeout(() => {
      expect(actions.loadOrderAndCart).toHaveBeenCalledWith(expect.anything(), 'abcde', undefined)
      done()
    }, 0)
  })

  it('when the activeTab changes and vars are selected, it should call loadVariables and set isCartLoading to tue', (done) => {
    actions.loadVariables.mockReturnValueOnce(Promise.resolve())
    const computed = {
      selectedVariableIds () {
        return 12
      }
    }
    const wrapper = shallowMount(MainView, {
      store, localVue, mocks, stubs, computed })
    wrapper.setData({ activeTab: 'selection' })
    // @ts-ignore
    expect(wrapper.vm.isCartLoading).toBeTruthy()
    done()
  })

  it('when the activeTab changes and no vars are selected, isCartLoading should remain false', (done) => {
    actions.loadVariables.mockReturnValueOnce(Promise.resolve())
    const computed = {
      selectedVariableIds () {
        return 0
      }
    }
    const wrapper = shallowMount(MainView, {
      store, localVue, mocks, stubs, computed
    })
    wrapper.setData({ activeTab: 'selection' })
    // @ts-ignore
    expect(wrapper.vm.isCartLoading).toBeFalsy()
    done()
  })
})
