import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils'
import SidebarView from '@/views/SidebarView.vue'
import emptyState from '@/store/state'
import Vue from 'vue'
import Vuex from 'vuex'
import ApplicationState from '@/types/ApplicationState'

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('SidebarView.vue', () => {
  let wrapper: Wrapper<Vue>
  let state: ApplicationState
  let commitMock = jest.fn()

  beforeEach(() => {
    state = { ...emptyState }
    wrapper = shallowMount(SidebarView, {
      mocks: {
        $store: {
          state,
          commit: commitMock
        }
      },
      localVue
    })
  })

  it('Renders the sidebar', () => {
    expect(wrapper.find('#Sidebar-view').exists()).toBeTruthy()
  })

  it('Should contain gender and cohort facets', () => {
    expect(wrapper.find('toggle-facet-stub[facetid="gender"]').exists()).toBeTruthy()
    expect(wrapper.find('toggle-facet-stub[facetid="cohort"]').exists()).toBeTruthy()
  })

  it('should commit the new gender filter to the store when selectedGenderOptions is updated', () => {
    // @ts-ignore
    wrapper.vm.selectedGenderOptions = ['1']
    expect(commitMock).toBeCalledWith('updateGenderFilter', ['1'])
  })

  it('should commit the new subcohort filter to the store when selectedsubcohortOptions is updated', () => {
    // @ts-ignore
    wrapper.vm.selectedSubcohortOptions = ['123']
    expect(commitMock).toBeCalledWith('updateSubcohortfilter', ['123'])
  })

  it('should commit the new selectedAgeAt filter to the store when updated', () => {
    // @ts-ignore
    wrapper.vm.selectedAgeAt = {
      ageGroupAt1A: [],
      ageGroupAt2A: [],
      ageGroupAt3A: ['0-17', '65+']
    }
    expect(commitMock).toBeCalledWith('updateSelectedAgeAt', {
      ageGroupAt1A: [],
      ageGroupAt2A: [],
      ageGroupAt3A: ['0-17', '65+']
    })
  })

  it('should commit the new selectedAgeRange filter to the store when updated', () => {
    // @ts-ignore
    wrapper.vm.selectedAgeRange = [2000, 2011]
    expect(commitMock).toBeCalledWith('updateYearOfBirthRangefilter', [2000, 2011])
  })

  it('should cache the current age data, clear the age data in the store and activate the new age filter, initilizing it with the cached data', () => {
    wrapper.setData({ activeAgeFacetId: 'yob' })
    expect(commitMock).toBeCalledWith('removeAgeAtFilter')

    wrapper.setData({ activeAgeFacetId: 'age' })
    expect(commitMock).toBeCalledWith('removeYearOfBirthRangefilter')
  })

  describe('handleAgeToggle', () => {
    describe('when toggeling the yob facet when it is collapsed', () => {
      beforeEach(() => {
        // @ts-ignore
        wrapper.vm.handleAgeToggle({ collapsed: true, facetId: 'yob' })
      })
      it('yob should become the active facet', () => {
        // @ts-ignore
        expect(wrapper.vm.activeAgeFacetId).toBe('yob')
      })
    })
    describe('when toggeling the yob facet when it is open', () => {
      beforeEach(() => {
        // @ts-ignore
        wrapper.vm.handleAgeToggle({ collapsed: false, facetId: 'yob' })
      })
      it('age should become the facet', () => {
        // @ts-ignore
        expect(wrapper.vm.activeAgeFacetId).toBe('age')
      })
    })
    describe('when toggeling the age facet when it is collapsed', () => {
      beforeEach(() => {
        // @ts-ignore
        wrapper.vm.handleAgeToggle({ collapsed: true, facetId: 'age' })
      })
      it('age should become the active facet', () => {
        // @ts-ignore
        expect(wrapper.vm.activeAgeFacetId).toBe('age')
      })
    })
    describe('when toggeling the age facet when it is open', () => {
      beforeEach(() => {
        // @ts-ignore
        wrapper.vm.handleAgeToggle({ collapsed: false, facetId: 'age' })
      })
      it('yob should become the facet', () => {
        // @ts-ignore
        expect(wrapper.vm.activeAgeFacetId).toBe('yob')
      })
    })
  })
})
