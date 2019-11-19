import { shallowMount, createLocalVue } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Vuex from 'vuex'

describe('HomeView', () => {
  let wrapper: any
  let localVue: any
  let store: any
  let state: any
  let getters: any

  describe('when the user is not signed in', () => {
    beforeEach(() => {
      localVue = createLocalVue()
      localVue.use(Vuex)

      state = {
        isContextLoaded: true
      }
      getters = {
        isSignedIn: () => false
      }
      store = new Vuex.Store({
        state,
        getters
      })

      wrapper = shallowMount(HomeView, { store, localVue })
    })

    it('should render the HomeView', () => {
      expect(wrapper.find('h3').text()).toEqual('Loading')
    })
  })

  describe('when the user is signed in', () => {
    beforeEach(() => {
      localVue = createLocalVue()
      localVue.use(Vuex)

      state = {
        isContextLoaded: true
      }
      getters = {
        isSignedIn: () => true
      }
      store = new Vuex.Store({
        state,
        getters
      })

      wrapper = shallowMount(HomeView, { store, localVue })
    })

    it('should render the HomeView', () => {
      expect(wrapper.find('h3').text()).toEqual('Loading')
    })
  })
})
