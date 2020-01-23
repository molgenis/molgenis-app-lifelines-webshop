import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import { routes } from '@/router'
import OrdersView from '@/views/OrdersView.vue'
import moment from 'moment'
import Vuex from 'vuex'
import orders from '../fixtures/orders'
import mutations from '@/store/mutations'
import '@/globals/variables'

describe('OrdersView.vue', () => {
  let localVue: any
  let store: any

  const hasManagerRole = jest.fn()
  const sendApproveTrigger = jest.fn()
  const copyOrder = jest.fn()

  const stubs = {
    RouterLink: RouterLinkStub
  }

  function getWrapper ({ router = false }) {
    const params:any = { localVue, store, stubs }
    if (router) {
      params.router = new Router({ routes })
    }

    return mount(OrdersView, params)
  }

  let actions = {
    deleteOrder: jest.fn(),
    loadOrders: jest.fn(() => {
      return {
        items: orders,
        total: orders.length
      }
    }),
    sendApproveTrigger,
    copyOrder
  }

  let getters = {
    hasManagerRole
  }

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.filter('moment', function (value: string, format: string) { return moment(value).utc().format(format) })
    localVue.filter('i18n', (value: string) => `#${value}#`)
    localVue.use(Vuex)
    localVue.use(BootstrapVue)

    let state: any = {
      orders
    }

    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations
    })
  })

  describe('When component is mounted', () => {
    let wrapper:any

    beforeEach(async (done) => {
      const params = {
        localVue,
        store,
        router: new Router({ routes })
      }
      hasManagerRole.mockReturnValue(true)
      wrapper = mount(OrdersView, params)
      done()
    })

    it('renders orders view', () => {
      expect(wrapper.find('#orders-view').exists()).toBeTruthy()
    })

    it('shows title', () => {
      expect(wrapper.find('#orders-title').text()).toBe('lifelines-webshop-orders-title')
    })

    it('fetches orders when mounted', () => {
      expect(actions.loadOrders).toHaveBeenCalled()
    })

    it('shows orders table when loaded', () => {
      expect(wrapper.find('table').isVisible()).toBeTruthy()
    })

    it('checks content of order tables', () => {
      expect(wrapper.find('table')).toMatchSnapshot()
    })

    it('should render a row for each order', () => {
      expect(wrapper.findAll('tbody tr').length).toBe(2)
    })

    it('should not show any modal by default', () => {
      expect(wrapper.find('.modal-dialog').exists()).toBe(false)
    })

    describe('when the user clicks delete', () => {
      beforeEach(() => {
        wrapper.find('.t-btn-order-delete').trigger('click')
      })
      it('should show the confirmation modal', () => {
        expect(wrapper.find('.modal-dialog').exists()).toBe(true)
        wrapper.find('.t-btn-confirm-delete').trigger('click')
        expect(actions.deleteOrder).toHaveBeenCalled()
      })
    })

    describe('when the user clicks state dropdown', () => {
      beforeEach(() => {
        // Click on Approved (4th item)
        wrapper.find('.dropdown-update-state .dropdown-item:nth-child(4)').trigger('click')
      })

      it.only('should show the order state modal', () => {
        expect(wrapper.find('.modal-dialog').exists()).toBe(true)
      })

      it('approve order success', () => {
        wrapper.find('.t-btn-confirm-state').trigger('click')

        sendApproveTrigger.mockResolvedValue('200')
        const approveBtn = wrapper.find('.dropdown-update-state')
        expect(approveBtn.find('span').text()).toEqual('Approve')

        expect(actions.sendApproveTrigger).toHaveBeenCalled()
      })

      // it('approve order fail', () => {
      //   sendApproveTrigger.mockRejectedValue('500')

      //   const approveBtn = wrapper.find('.btn.btn-success')
      //   expect(approveBtn.find('span').text()).toEqual('Approve')
      //   approveBtn.trigger('click')

      //   expect(actions.sendApproveTrigger).toHaveBeenCalled()
      // })
    })
  })

  // describe('Copy order', () => {
  //   let wrapper:any

  //   beforeEach(() => {
  //     localVue.use(Router)
  //     hasManagerRole.mockReturnValue(true)
  //     wrapper = getWrapper({ router: true })

  //     store.commit('setOrders', orders)
  //   })

  //   it('should add a copy button of each order', () => {
  //     const copyButtons = wrapper.findAll('.copy-btn')
  //     expect(copyButtons.length).toEqual(2)
  //   })

  //   it('should call the copy action when clicked', () => {
  //     const copyButton = wrapper.find('.copy-btn')
  //     copyButton.trigger('click')
  //     expect(actions.copyOrder).toHaveBeenCalled()
  //   })
  // })
})
