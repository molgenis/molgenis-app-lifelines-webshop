import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContentView from '@/views/ContentView.vue'
import Vuex, { Store } from 'vuex'
import Vue from 'vue'
Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ContentView.vue', () => {
  const store = new Store({
    state: { treeSelection: 3 }
  })

  it('Renders the content', () => {
    const wrapper = shallowMount(ContentView, { store, localVue })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#content-view').exists()).toBeTruthy()
  })

  describe('when signed in', () => {
    let wrapper:any
    let store:any
    beforeEach(() => {
      store = new Store({
        state: { isSignedIn: true }
      })
      wrapper = shallowMount(ContentView, { store, localVue })
    })
    it('should show the signed in msg', () => {
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-content-header')
    })
  })

  describe('when signed out', () => {
    let wrapper:any
    let store:any
    beforeEach(() => {
      store = new Store({
        state: { isSignedIn: false }
      })
      wrapper = shallowMount(ContentView, { store, localVue })
    })
    it('should show the signed out msg', () => {
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-signed-out-content-header')
    })
  })
})
