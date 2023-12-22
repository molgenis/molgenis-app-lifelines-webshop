import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import OrdersView from '@/views/OrdersView.vue'
import moment from 'moment'
import Vuex from 'vuex'
import orders from '../fixtures/orders'
import '@/globals/variables'
import transforms from '@/store/transforms'
import { gridSelectionFromCart, successMessage } from '@/store/helpers'
// @ts-ignore
import { get } from '@molgenis/molgenis-api-client'
import axios from 'axios'

jest.mock('@/store/transforms', () => {
  return {
    assessments: jest.fn(),
    cartTree: jest.fn(),
    helpers: jest.fn(),
    findZeroRowsAndCols: jest.fn(),
    grid: jest.fn(),
    gridRows: jest.fn(),
    gridAssessments: jest.fn(),
    gridColumns: jest.fn(),
    gridSelections: jest.fn(),
    sections: jest.fn(),
    sectionTree: jest.fn(),
    subSectionList: jest.fn(),
    treeStructure: jest.fn(),
    variables: jest.fn(),
    gridVariablesFiltered: jest.fn(),
    variants: jest.fn()
  }
})

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: jest.fn((url) => {
      if (url.includes('/api/v2/lifelines_order/')) {
        return {
          contents: {
            id: 1
          },
          name: 'testName'
        }
      } else if (url.includes('/files/')) {
        return {
          filters: {},
          selection: []
        }
      } else {
        return {
          items: []
        }
      }
    })
  }
})

jest.mock('axios')
jest.mock('js-file-download', () => jest.fn(() => {}))
jest.mock('@/store/helpers', () => {
  return {
    gridSelectionFromCart: jest.fn(),
    successMessage: jest.fn()
  }
})

describe('OrdersView.vue', () => {
  let localVue: any
  let store: any
  let mutations: any

  const hasManagerRole = jest.fn(() => true)
  const copyOrder = jest.fn()

  let actions = {
    loadOrderAndCart: jest.fn(),
    deleteOrder: jest.fn(),
    updateRequestId: jest.fn(),
    loadOrders: jest.fn(() => {
      return {
        items: orders,
        total: orders.length
      };
    }),
    sendApproveTrigger: jest.fn(),
    copyOrder,
    save: jest.fn(),
    submit: jest.fn(),
    loadVariables: jest.fn(),
    loadAssessments: jest.fn(),
    fetchAllVariables: jest.fn(() => {
      return []
    })
  }

  let getters = {
    hasManagerRole
  }

  const router = new Router(
    {
      base: process.env.BASE_URL,
      routes: [
        {
          path: '/orders/:orderNumber?',
          name: 'orders',
          component: OrdersView,
          children: [
            {
              name: 'orderDelete',
              path: 'delete'
            },
            {
              name: 'orderStateChange',
              path: 'state/:state'
            }
          ]
        }
      ]
    }
  )

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.directive('b-popover', { /* stub */ })
    localVue.filter('moment', function (value: string, format: string) { return moment(value).utc().format(format) })
    localVue.filter('i18n', (value: string) => `#${value}#`)
    localVue.use(Vuex)
    localVue.use(BootstrapVue)
    localVue.use(Router)

    let state: any = {
      orders
    }

    mutations = {
      changeOrderStatus: jest.fn(),
      setToast: jest.fn()
    }

    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations
    })
  })

  describe('When component is mounted is shopper', () => {
    let wrapper:any

    beforeEach(async (done) => {
      const params = {
        localVue,
        store,
        router
      }
      hasManagerRole.mockReturnValue(false)
      wrapper = mount(OrdersView, params)
      done()
    })

    it('renders orders view', () => {
      expect(wrapper.find('#orders-view').exists()).toBeTruthy()
    })
  })

  describe('When component is mounted is manager', () => {
    let wrapper:any

    beforeEach(async (done) => {
      const params = {
        localVue,
        store,
        router
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

    it('should have a pdf download button', () => {
      expect(wrapper.find('.pdf-btn').exists()).toBe(true)
    })

    describe('when the user clicks on pdf download', () => {
      beforeEach(() => {
        wrapper.find('.pdf-btn').trigger('click')
      })
      it('should execute the pdf download method', () => {
        expect(get).toHaveBeenCalled()
      })
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

    describe('when the user edit request id', () => {
      beforeEach(() => {
        wrapper.find('.td-request-id .edit-btn').trigger('click')
      })
      it('should show the edit modal', () => {
        wrapper.html()
        expect(wrapper.find('.modal-dialog').exists()).toBe(true)
        wrapper.find('.t-btn-confirm-edit').trigger('click')
        expect(actions.updateRequestId).toHaveBeenCalled()
      })
    })

    describe('when the user changes the state to approve', () => {
      beforeEach(() => {
        // Click on Approved (4th item)
        wrapper.find('.dropdown-update-state .dropdown-item:nth-child(4)').trigger('click')
      })

      it('should show the order state modal', () => {
        expect(wrapper.find('.modal-dialog').exists()).toBe(true)
        expect(wrapper.find('.t-btn-confirm-state').text()).toEqual('lifelines-webshop-modal-button-update-state')
      })

      describe('when user clicks confirm btn in the modal', () => {
        beforeEach(async (done) => {
          actions.sendApproveTrigger.mockResolvedValue('200')
          wrapper.find('.t-btn-confirm-state').trigger('click')
          // needed to wait for async calls to store to finish
          await localVue.nextTick()
          done()
        })

        it('approve order success', () => {
          expect(actions.loadOrderAndCart).toHaveBeenCalled()
          expect(mutations.changeOrderStatus).toHaveBeenCalled()
          expect(actions.save).toHaveBeenCalled()
          expect(actions.sendApproveTrigger).toHaveBeenCalled()
        })
      })

      describe('when user clicks confirm btn in the modal but the approve fails', () => {
        beforeEach(async (done) => {
          actions.sendApproveTrigger.mockRejectedValue('500')
          wrapper.find('.t-btn-confirm-state').trigger('click')
          // needed to wait for async calls to store to finish
          await localVue.nextTick()
          await localVue.nextTick()
          done()
        })

        it('approve order success', () => {
          expect(mutations.setToast).toHaveBeenCalled()
        })
      })
    })

    describe('when the user changes the state to submitted', () => {
      describe('when user clicks confirm btn in the modal', () => {
        beforeEach(async (done) => {
          // Click on Submmited (3th item)
          wrapper.find('.dropdown-update-state .dropdown-item:nth-child(3)').trigger('click')
          actions.sendApproveTrigger.mockResolvedValue('200')
          wrapper.find('.t-btn-confirm-state').trigger('click')
          // needed to wait for async calls to store to finish
          await localVue.nextTick()
          done()
        })

        it('submit order success', () => {
          expect(actions.submit).toHaveBeenCalled()
        })
      })
    })

    describe('Copy order', () => {
      it('should add a copy button of each order', () => {
        const copyButtons = wrapper.findAll('.copy-btn')
        expect(copyButtons.length).toEqual(2)
      })

      describe('when the user click the copy btn', () => {
        beforeEach(() => {
          const copyButton = wrapper.find('.copy-btn')
          copyButton.trigger('click')
        })

        it('should call the copy action when clicked', () => {
          expect(actions.copyOrder).toHaveBeenCalled()
        })
      })
    })

    describe('handleContextChanged', () => {
      beforeEach(() => {
        wrapper.vm.handleContextChanged({
          sortBy: 'foo',
          sortDesc: false
        })
      })

      it('refresh the table', () => {
        expect(actions.loadOrders).toHaveBeenCalledWith(expect.anything(),
          {
            'filters': {
              'state': '',
              'text': ''
            },
            'num': 10,
            'sortBy': 'foo',
            'sortDesc': false,
            'start': 0
          },
          undefined
        )
      })
    })

    describe('handlePaginate', () => {
      beforeEach(() => {
        wrapper.vm.handlePaginate(4)
      })

      it('update the page start load the new orders', () => {
        expect(actions.loadOrders).toHaveBeenCalledWith(expect.anything(),
          {
            'filters': {
              'state': '',
              'text': ''
            },
            'num': 10,
            'sortBy': '',
            'sortDesc': false,
            'start': 30
          },
          undefined
        )
      })
    })

    describe('onSearchChange', () => {
      beforeEach(() => {
        wrapper.vm.onSearchChange('find me')
      })

      it('update search text and fetch orders', () => {
        expect(actions.loadOrders).toHaveBeenCalledWith(expect.anything(),
          {
            'filters': {
              'state': '',
              'text': 'find me'
            },
            'num': 10,
            'sortBy': '',
            'sortDesc': true,
            'start': 0
          },
          undefined
        )
      })
    })

    describe('pdfDownloadMethod', () => {
      it('should build a data object and call the service', async (done) => {
        actions.fetchAllVariables.mockResolvedValue([])
        transforms.cartTree.mockReturnValueOnce({ my: 'tree' })
        // @ts-ignore
        axios.post.mockResolvedValue({ data: 'mydata' })
        await wrapper.vm.downloadPdf('12345')
        expect(axios.post).toHaveBeenCalledWith(
          '/vuepdf/',
          {
            component: 'orders',
            state: {
              assessments: undefined,
              cartTree: { my: 'tree' },
              filters: {},
              gridSelection: undefined,
              order: {
                contents: {
                  id: 1
                },
                name: 'testName'
              }
            }
          },
          { responseType: 'blob' }
        );
        done()
      })
    })
  })
})
