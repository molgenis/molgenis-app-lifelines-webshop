import { shallowMount, createLocalVue, config, mount } from '@vue/test-utils'
import ContentView from '@/views/ContentView.vue'
import Vuex, { Store } from 'vuex'
import Vue from 'vue'
import store from '@/store/store'
const i18n = require('../../../i18n.schemas')

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ContentView.vue', () => {
  it('Renders the content', () => {
    const wrapper = shallowMount(ContentView, { store, localVue })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#content-view').exists()).toBeTruthy()
  })

  describe('when signed in', () => {
    let wrapper: any
    beforeEach(() => {
      store.commit('setContext', { ...store.state.context, authenticated: true })
      wrapper = shallowMount(ContentView, { store, localVue })
    })
    it('should show the signed in msg', () => {
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-content-header')
    })
  })

  describe('when signed out', () => {
    let wrapper: any
    beforeEach(() => {
      store.commit('setContext', { ...store.state.context, authenticated: false })
      wrapper = shallowMount(ContentView, { store, localVue })
    })
    it('should show the signed out msg', () => {
      expect(wrapper.find('h3').text()).toEqual('lifelines-webshop-signed-out-content-header')
    })
  })

  describe('when grid variables are empty', () => {
    let wrapper: any
    beforeEach(() => {
      wrapper = shallowMount(ContentView, { store, localVue })
    })
    it('should not be shown', () => {
      expect(wrapper.find('.search-info').text()).toEqual('')
    })
  })

  describe('when grid variables are available', () => {
    let wrapper: any
    beforeEach(() => {
      store.commit('updateGridVariables', [0, 1, 2])

      const i18nMock = (key: string, value: any) => {
        let translation = i18n.en[key]
        if (value) {
          for (let prop in value) {
            translation = translation.replace(`{{${prop}}}`, value[prop])
          }
        }
        return translation
      }
      // @ts-ignore (this is set in setup.js, but need to override for interpolation)
      config.mocks.$t = jest.fn(i18nMock)
      wrapper = shallowMount(ContentView, { store, localVue })
    })

    describe('and when grid variables are set', () => {
      it('should show i18n message and the variable count', () => {
        expect(wrapper.find('.search-info').text()).toEqual('3 variable found.')
      })
    })

    describe('and when grid variables are set and subsection selected', () => {
      beforeEach(() => {
        store.commit('updateTreeSelection', 0)
        store.commit('updateSubSections', ['mySelectedSubsection'])
      })
      it('should show the subsection name in the i18n message', () => {
        expect(wrapper.find('.search-info').text()).toEqual('3 variable found in subsection "mySelectedSubsection".')
      })
    })

    describe('and when searchterm is given', () => {
      beforeEach(() => {
        store.commit('updateSearchTerm', 'searchMe')
      })
      it('should show the search term in the i18n message', () => {
        expect(wrapper.find('.search-info').text()).toEqual('3 variable found using search term "searchMe" in subsection "mySelectedSubsection".')
      })

      // This test exists because we made an explicit computed getter/setter
      // to a Vuex store property. It can be removed once we automated
      // this getter/setter mapping pattern.
      it('computed vuex state getter/setter is bound to v-model', () => {
        // Default state in the store false.
        expect(store.state.searchExact).toBe(false)
        const elemWrapper = wrapper.find('input[name=exact-match]')
        elemWrapper.setChecked()
        expect(elemWrapper.element.checked).toBe(true)
        expect(store.state.searchExact).toBe(true)
      })
    })
  })

  describe('When "search all" link is clicked', () => {
    let wrapper: any
    let handleClearSubsection: any
    beforeEach(() => {
      handleClearSubsection = jest.fn()
      wrapper = shallowMount(ContentView, { store, localVue, methods: { handleClearSubsection } })
    })
    it('should call the handleClearSubsection function', async (done) => {
      wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(handleClearSubsection).toHaveBeenCalled()
      done()
    })
  })

  describe('When selectedSubselection is called', () => {
    let wrapper: any
    beforeEach(() => {
      store.commit('treeSelected', 2)
      store.commit('treeOpenSection', 5)
      wrapper = shallowMount(ContentView, { store, localVue })
    })

    it('should reset the subselection tree', () => {
      wrapper.vm.handleClearSubsection()
      expect(store.state.treeSelected).toBe(-1)
      expect(store.state.treeOpenSection).toBe(-1)
    })
  })
})
