import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Router from 'vue-router'
import { routes } from '@/router'
import OrdersView from '@/views/OrdersView.vue'
import moment from 'moment'
import Vuex from 'vuex'
import orders from '../fixtures/orders'
import Spinner from '@/components/animations/SpinnerAnimation.vue'
import mutations from '@/store/mutations'
import { OrderState } from '@/types/Order'

describe('OrdersView.vue', () => {
  let localVue: any
  let store: any

  const hasManagerRole = jest.fn()
  const sendApproveTrigger = jest.fn()

  let actions = {
    deleteOrder: jest.fn(),
    loadOrders: jest.fn(),
    sendApproveTrigger
  }

  let getters = {
    hasManagerRole
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.filter('moment', function (value: string, format: string) { return moment(value).utc().format(format) })
    localVue.filter('i18n', (value: string) => `#${value}#`)
    localVue.use(Vuex)

    let state: any = {
      orders: null
    }

    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations
    })
  })

  it('renders orders view', () => {
    const wrapper = shallowMount(OrdersView, { store, localVue })
    expect(wrapper.find('#orders-view').exists()).toBeTruthy()
  })

  it('shows title', () => {
    const wrapper = shallowMount(OrdersView, { store, localVue })
    expect(wrapper.find('#orders-title').text()).toBe('lifelines-webshop-orders-title')
  })

  it('fetches orders when mounted', () => {
    shallowMount(OrdersView, { store, localVue })
    expect(actions.loadOrders).toHaveBeenCalled()
  })

  it('shows a spinner while loading orders', () => {
    const wrapper = shallowMount(OrdersView, { store, localVue })
    expect(wrapper.find(Spinner).isVisible()).toBeTruthy()
    store.commit('setOrders', orders)
    expect(wrapper.find(Spinner).exists()).toBeFalsy()
  })

  it('shows orders table when loaded', () => {
    const wrapper = shallowMount(OrdersView, { store, localVue })
    store.commit('setOrders', orders)
    expect(wrapper.find('table').isVisible()).toBeTruthy()
  })

  it('checks content of order tables', () => {
    const wrapper = shallowMount(OrdersView, { store, localVue })
    store.commit('setOrders', orders)
    expect(wrapper.find('table')).toMatchSnapshot()
  })

  it('shows a confirmation modal after pressing the delete button', () => {
    localVue.use(Router)

    const wrapper = mount(OrdersView, {
      localVue,
      store,
      router: new Router({ routes })
    })
    store.commit('setOrders', orders)

    expect(wrapper.find('.modal-dialog').exists()).toBe(false)
    wrapper.find('.t-btn-order-delete').trigger('click')
    expect(wrapper.find('.modal-dialog').exists()).toBe(true)
    wrapper.find('.t-btn-confirm').trigger('click')
    expect(actions.deleteOrder).toHaveBeenCalled()
  })

  describe('Approve order', () => {
    let wrapper:any
    beforeEach(() => {
      localVue.use(Router)
      hasManagerRole.mockReturnValue(true)

      wrapper = mount(OrdersView, {
        localVue,
        store,
        router: new Router({ routes })
      })

      store.commit('setOrders', orders)
    })

    it('approve order success', () => {
      sendApproveTrigger.mockResolvedValue('200')
      console.log(wrapper.html())

      const approveBtn = wrapper.find('.btn.btn-success')
      expect(approveBtn.find('span').text()).toEqual('Approve')

      approveBtn.trigger('click')

      expect(actions.sendApproveTrigger).toHaveBeenCalled()
    })

    it('approve order fail', () => {
      sendApproveTrigger.mockRejectedValue('500')

      const approveBtn = wrapper.find('.btn.btn-success')
      expect(approveBtn.find('span').text()).toEqual('Approve')

      approveBtn.trigger('click')

      expect(actions.sendApproveTrigger).toHaveBeenCalled()
      console.log(wrapper.html())
    })
  })
})
