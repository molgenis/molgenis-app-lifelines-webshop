import { shallowMount, createLocalVue } from '@vue/test-utils'
import CartView from '@/views/CartView.vue'
import Vuex from 'vuex'
import * as assessmentsRepository from '@/repository/assessmentsRepository.ts'

jest.mock('@/repository/assessmentsRepository.ts', () => ({
  getAssessments: jest.fn()
}))

const mockedAssesments = {
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

describe('CartView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let store: any

  beforeEach(() => {
    let state: any

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
      }
    }

    store = new Vuex.Store({
      state
    })
  })

  it('renders cart view', (done) => {
    // @ts-ignore
    assessmentsRepository.getAssessments.mockResolvedValue(mockedAssesments)
    const wrapper = shallowMount(CartView, { store, localVue })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#cart-view').exists()).toBeTruthy()
    localVue.nextTick(() => {
      expect(wrapper.findAll('li').at(0).text()).toEqual('var 123  ( assessment1,assessment3 )')
      expect(wrapper.findAll('li').at(1).text()).toEqual('var 456  ( assessment3 )')
      done()
    })
  })
})
