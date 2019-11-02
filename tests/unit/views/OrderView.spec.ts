import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import OrderView from '@/views/OrderView.vue'
import Vuex from 'vuex'

describe('OrderView', () => {
  let wrapper: any
  let localVue: any
  let store: any
  let actions: any
  let state: any
  let saveMock: any
  let mutations: any

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    saveMock = jest.fn()
    state = {
      toast: null,
      order: {},
      orderFormFields: []
    }
    actions = {
      save: saveMock
    }
    mutations = {
      setToast: jest.fn(),
      clearToast: jest.fn(),
      setOrderDetails: jest.fn()
    }
    store = new Vuex.Store({
      state,
      actions,
      mutations
    })
    wrapper = shallowMount(OrderView, { store, localVue })
  })

  it('should render the component', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('#order-form')).toBeDefined()
  })

  describe('on form value changed', () => {
    beforeEach(() => {
      wrapper.vm.onValueChanged({ key1: 'new val' })
    })

    it('should update the form data', () => {
      expect(wrapper.vm.formData).toEqual({ key1: 'new val' })
    })
  })

  describe('on onSubmit', () => {
    let formState: any
    beforeEach(() => {
      formState = {
        projectNumber: {
          $touched: true
        },
        name: {
          $touched: true
        },
        applicationForm: {
          $touched: true
        }
      }
    })

    describe('when the form is valid', () => {
      beforeEach((done) => {
        formState.$valid = true
        wrapper.setData({ formState: formState })
        wrapper.vm.onSubmit()
        done()
      })

      it('should call the save action', () => {
        expect(saveMock).toHaveBeenCalled()
      })
    })

    describe('when the form is invalid', () => {
      beforeEach((done) => {
        formState.$valid = false
        wrapper.setData({ formState: formState })
        wrapper.vm.onSubmit()
        done()
      })

      it('should not call the save action', () => {
        expect(saveMock).not.toHaveBeenCalled()
      })
    })
  })
})
