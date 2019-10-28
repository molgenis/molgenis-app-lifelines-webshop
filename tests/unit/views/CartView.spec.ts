import { shallowMount, createLocalVue } from '@vue/test-utils'
import CartView from '@/views/CartView.vue'
import Vuex from 'vuex'
import Vue from 'vue'
Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('CartView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any
  let actions: any

  beforeEach(() => {
    let state: any
    actions = {
      save: jest.fn()
    }

    state = {
      isSignedIn: true,
      gridSelection: {
        123: [1, 2],
        456: [3]
      },
      variables: {
        123: {
          id: 123,
          name: 'var123',
          label: 'var 123'
        },
        456: {
          id: 456,
          name: 'var456',
          label: 'var 456'
        }
      },
      assessments: {
        1: {
          id: 1,
          name: 'assessment1'
        },
        2: {
          id: 1,
          name: 'assessment3'
        },
        3: {
          id: 1,
          name: 'assessment3'
        }
      }
    }

    store = new Vuex.Store({
      state,
      actions
    })
  })

  it('renders cart view', () => {
    const wrapper = shallowMount(CartView, { store, localVue })
    expect(wrapper.find('#cart-view').exists()).toBeTruthy()
    expect(wrapper.findAll('li').at(0).text()).toEqual('var 123 ( assessment1, assessment3 )')
    expect(wrapper.findAll('li').at(1).text()).toEqual('var 456 ( assessment3 )')
  })

  it('renders an save button that saves the current state', () => {
    const wrapper = shallowMount(CartView, { store, localVue })
    wrapper.find('.save').trigger('click')
    expect(actions.save).toHaveBeenCalled()
  })
})
