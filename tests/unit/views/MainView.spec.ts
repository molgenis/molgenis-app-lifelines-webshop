import { shallowMount, createLocalVue } from '@vue/test-utils'
import MainView from '@/views/MainView.vue'
import Vuex from 'vuex'

describe('MainView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any
  let actions: any
  let state: any
  const mocks: any = { '$route': { params: {} } }
  const isSearchResultEmpty = jest.fn()

  beforeEach(() => {
    state = {
      state: { treeSelection: 3 },
      toast: { type: 'danger', message: 'i am not a message' }
    }
    actions = {
      loadVariables: jest.fn(),
      loadAssessments: jest.fn(),
      load: jest.fn(),
      save: jest.fn()
    }
    store = new Vuex.Store({
      state,
      actions,
      getters: {
        isSearchResultEmpty
      }
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
