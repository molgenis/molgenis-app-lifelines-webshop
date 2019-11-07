import { shallowMount, createLocalVue } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Vuex from 'vuex'

describe('HomeView', () => {
  let wrapper: any
  let localVue: any
  let store: any
  let state: any

  describe('when the context is not loaded', () => {
    beforeEach(() => {
      localVue = createLocalVue()
      localVue.use(Vuex)

      state = {
        isContextLoaded: false,
        isSignedIn: false
      }
      store = new Vuex.Store({
        state
      })

      wrapper = shallowMount(HomeView, { store, localVue })
    })

    it('should render the HomeView', () => {
      expect(wrapper.find('h3').text()).toEqual('Loading')
    })
  })

  describe('when the context is loaded', () => {
    beforeEach(() => {
      localVue = createLocalVue()
      localVue.use(Vuex)

      state = {
        isContextLoaded: true,
        isSignedIn: false
      }
      store = new Vuex.Store({
        state
      })

      wrapper = shallowMount(HomeView, { store, localVue })
    })

    it('should render the HomeView', () => {
      expect(wrapper.find('h3').text()).toEqual('Loading')
    })
  })

  describe('when the context is loaded and user is sigend in', () => {
    beforeEach(() => {
      localVue = createLocalVue()
      localVue.use(Vuex)

      state = {
        isContextLoaded: true,
        isSignedIn: true
      }
      store = new Vuex.Store({
        state
      })

      wrapper = shallowMount(HomeView, { store, localVue })
    })

    it('should render the HomeView', () => {
      expect(wrapper.find('h3').text()).toEqual('Loading')
    })
  })
})
