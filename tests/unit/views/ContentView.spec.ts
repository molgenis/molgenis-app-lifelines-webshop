import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContentView from '@/views/ContentView.vue'
import Vuex, { Store } from 'vuex'
import Vue from 'vue'
Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

const localVue = createLocalVue()
localVue.use(Vuex)

let store: any
let isSignedIn: any

beforeEach(() => {
  isSignedIn = jest.fn()
  store = new Store({
    getters: {
      isSignedIn
    }
  })
})

describe('ContentView.vue', () => {
  it('Renders the content', () => {
    const wrapper = shallowMount(ContentView, { store, localVue })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#content-view').exists()).toBeTruthy()
  })

  describe('when signed in', () => {
    beforeEach(() => {
      isSignedIn.mockReturnValue(true)
    })
    it('should show the signed in msg', () => {
      const wrapper = shallowMount(ContentView, { store, localVue })
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-content-header')
    })
  })

  describe('when signed out', () => {
    beforeEach(() => {
      isSignedIn.mockReturnValue(false)
    })
    it('should show the signed out msg', () => {
      const wrapper = shallowMount(ContentView, { store, localVue })
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-signed-out-content-header')
    })
  })
})
