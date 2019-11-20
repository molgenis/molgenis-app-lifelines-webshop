import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'

import CartView from '@/views/CartView.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import flushPromises from 'flush-promises'

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('CartView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  let stubs = {
    RouterLink: RouterLinkStub
  }

  let mocks = {
    $router: {
      push: jest.fn()
    }
  }

  let store: any
  let actions: any

  beforeEach(() => {
    let state: any
    actions = {
      save: jest.fn()
    }

    state = {
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
    const wrapper = shallowMount(CartView, { stubs, store, localVue })
    expect(wrapper.find('#cart-view').exists()).toBeTruthy()
    expect(wrapper.findAll('li').at(0).text()).toEqual('var 123 ( assessment1, assessment3 )')
    expect(wrapper.findAll('li').at(1).text()).toEqual('var 456 ( assessment3 )')
  })

  it('renders a save button that saves the current state', async () => {
    actions.save.mockResolvedValue('12345')
    const wrapper = shallowMount(CartView, { stubs, store, localVue, mocks })
    wrapper.find('.save').trigger('click')
    await flushPromises()
    expect(mocks.$router.push).toHaveBeenCalledWith({ name: 'load', params: { orderNumber: '12345' } })
  })
})
