import { mount, createLocalVue, RouterLinkStub, shallowMount } from '@vue/test-utils'
import mutations from '@/store/mutations'
import { assessments, cartTree, variables } from '../fixtures/grid'

import CartView from '@/views/CartView.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import BootstrapVue from 'bootstrap-vue'

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('CartView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  let state:any

  let stubs:any = {
    RouterLink: RouterLinkStub,
    'toast-component': true
  }

  let mocks:any = {
    $router: {
      push: jest.fn()
    }
  }

  let store: any
  let actions: any

  const getters = {
    cartTree: () => cartTree,
    hasManagerRole: () => true,
    isSignedIn: () => false,
    selectedVariableIds: () => []
  }

  beforeEach(() => {
    actions = {
      save: jest.fn(),
      loadAllVariables: jest.fn()
    }

    state = {
      gridSelection: {
        100: [200, 201],
        101: [202]
      },
      variables,
      assessments
    }

    store = new Vuex.Store({
      state,
      actions,
      mutations,
      getters
    })
  })

  it('renders cart view, showing the assessment labels sorted alphabetically', () => {
    const wrapper = mount(CartView, { stubs, store, localVue })
    expect(wrapper.findAll('li').at(0).text()).toEqual(`${variables[0].label} ( 1A, 2C )`)
    expect(wrapper.findAll('li').at(1).text()).toEqual(`${variables[1].label} ( 2B )`)
    expect(wrapper.find('#cart-view')).toMatchSnapshot()
  })

  it('renders a save button that saves the current state', async () => {
    actions.save.mockResolvedValue('12345')
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    wrapper.find('.save').trigger('click')
    await flushPromises()
    expect(mocks.$router.push).toHaveBeenCalledWith({ name: 'load', params: { orderNumber: '12345' } })
  })

  it('has the first selection open on start', async () => {
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    expect(wrapper.find('#accordion-0').isVisible()).toBeTruthy()
  })

  it('has a collapsable menu', async () => {
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')
    expect(wrapper.find('#accordion-0').isVisible()).toBeFalsy()
  })

  it('has a collapsable menu', async () => {
    const wrapper = mount(CartView, { stubs, store, localVue, mocks })
    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')
    expect(wrapper.find('#accordion-0').isVisible()).toBeFalsy()
  })

  it('removes closed menu items', async () => {
    const wrapper:any = mount(CartView, { stubs, store, localVue, mocks })
    expect(wrapper.vm.openItems).toHaveLength(1)

    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')

    expect(wrapper.vm.openItems).toHaveLength(0)
  })

  it('adds open menu items', async () => {
    const wrapper:any = mount(CartView, { stubs, store, localVue, mocks })
    const cartHeader = wrapper.find('.hoverable')
    cartHeader.trigger('click')
    // the first element closes on click.
    expect(wrapper.vm.openItems).toHaveLength(0)
    cartHeader.trigger('click')
    // the element is openened
    expect(wrapper.vm.openItems).toHaveLength(1)
  })

  it('select all available variables', async () => {
    state.gridSelection = {}
    const wrapper = shallowMount(CartView, { stubs, localVue, store, mocks })
    wrapper.find('.t-toggle-all-variables').trigger('click')
    expect(actions.loadAllVariables).toHaveBeenCalled()
  })

  it('deselect all selected variables', async () => {
    const mocks = { $store: { commit: jest.fn(), actions, getters, state } }
    const wrapper = shallowMount(CartView, { stubs, localVue, mocks })
    wrapper.find('.t-toggle-all-variables').trigger('click')
    expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('updateGridSelection', {})
  })

  it('shows loading msg if cartLoading is set to true', async () => {
    const propsData = {
      isCartLoading: true
    }
    const mocks = { $store: { commit: jest.fn(), actions, getters, state } }
    const wrapper = shallowMount(CartView, { stubs, localVue, mocks, propsData })
    expect(wrapper.find('p.font-italic').text()).toEqual('Fetching cart details. One moment, please..')
  })

  it('when not signed in, loading should be false', async () => {
    const mocks = { $store: { commit: jest.fn(), actions, getters, state } }
    const wrapper = shallowMount(CartView, { stubs, localVue, mocks })
    // @ts-ignore
    expect(wrapper.vm.loading).toEqual(false)
  })
})
