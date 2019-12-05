import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import OrderView from '@/views/OrderView.vue'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'

describe('OrderView', () => {
  let wrapper: any
  let localVue: any
  let store: any
  let actions: any
  let state: any
  let mutations: any
  let mocks: any

  const touchedState = {
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

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    state = {
      toast: null,
      order: {},
      orderFormFields: [
        { id: 'projectNumber' },
        { id: 'name' },
        { id: 'applicationForm' }
      ]
    }
    actions = {
      save: jest.fn(),
      submit: jest.fn()
    }
    mutations = {
      setToast: jest.fn(),
      clearToast: jest.fn(),
      setOrderDetails: jest.fn(),
      setProjectNumberRequiredFunction: jest.fn(),
      setOrderFormFields: jest.fn()
    }
    store = new Vuex.Store({
      state,
      actions,
      mutations
    })

    const stubs = {
      RouterLink: RouterLinkStub
    }

    mocks = {
      $router: {
        push: jest.fn()
      }
    }

    wrapper = shallowMount(OrderView, { stubs, store, localVue, mocks })
  })

  it('should render the component', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('#order-form')).toBeDefined()
  })

  describe('when the order application form is a fileReference', () => {
    beforeEach(() => {
      wrapper.setData({ order: {
        applicationForm: {
          filename: 'my file'
        }
      } })
    })

    it('should use the filename as applicationForm value', () => {
      expect(wrapper.vm.orderFormData).toEqual({ applicationForm: 'my file' })
    })
  })

  describe('on form value changed', () => {
    beforeEach(() => {
      wrapper.vm.onValueChanged({ key1: 'new val' })
    })

    it('should update the form data', () => {
      expect(wrapper.vm.formData).toEqual({ key1: 'new val' })
    })
  })

  describe('on onSave', () => {
    let formState: any
    beforeEach(() => {
      formState = { ...touchedState }
    })

    describe('when the form is valid', () => {
      beforeEach((done) => {
        formState.$valid = true
        wrapper.setData({ formState: formState })
        wrapper.vm.onSave()
        done()
      })

      it('should call the save action', () => {
        expect(actions.save).toHaveBeenCalled()
      })
    })

    describe('when the form is invalid', () => {
      beforeEach((done) => {
        formState.$valid = false
        wrapper.setData({ formState: formState })
        actions.save.mockResolvedValue('12345')
        wrapper.vm.onSave()
        done()
      })

      it('should still call the save action', () => {
        expect(actions.save).toHaveBeenCalled()
      })

      it('should push the cart view to the router with the orderNumber', async () => {
        await flushPromises()
        expect(mocks.$router.push).toHaveBeenCalledWith({ name: 'load', params: { orderNumber: '12345' } })
      })
    })
  })

  describe('on onSubmit', () => {
    let formState: any
    beforeEach(() => {
      formState = { ...touchedState }
    })

    describe('when the form is valid', () => {
      beforeEach((done) => {
        formState.$valid = true
        wrapper.setData({ formState: formState })
        wrapper.vm.onSubmit()
        done()
      })

      it('should call the save action', () => {
        expect(actions.submit).toHaveBeenCalled()
      })

      it('should push the orders view into the router', async () => {
        await flushPromises()
        expect(mocks.$router.push).toHaveBeenCalledWith({ name: 'orders' })
      })
    })

    describe('when the form is invalid', () => {
      beforeEach((done) => {
        actions.submit.mockReset()
        wrapper.setData({ formState: formState, formData: { projectNumber: '' } })
        wrapper.vm.onSubmit()
        done()
      })

      it('should not call the submit action', () => {
        expect(actions.submit).not.toHaveBeenCalled()
      })
    })
  })
})
