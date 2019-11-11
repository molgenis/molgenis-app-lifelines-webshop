import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import OrdersView from '@/views/OrdersView.vue'
import moment from 'moment'
import Vuex from 'vuex'
import orders from '../fixtures/orders'
import Spinner from '@/components/animations/SpinnerAnimation.vue'
import mutations from '@/store/mutations'

describe('OrdersView.vue', () => {
  const localVue = createLocalVue()
  localVue.filter('moment', function (value: string, format: string) { return moment(value).utc().format(format) })
  localVue.filter('i18n', (value: string) => `#${value}#`)

  localVue.use(Vuex)
  localVue.use(VueRouter)
  let store: any
  let actions = {
    loadOrders: jest.fn()
  }

  beforeEach(() => {
    let state: any

    state = {
      orders: null
    }
    store = new Vuex.Store({
      state,
      actions,
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
    const wrapper = shallowMount(OrdersView, { store, localVue })
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
})
