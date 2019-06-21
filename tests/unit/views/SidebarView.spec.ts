import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils'
import SidebarView from '@/views/SidebarView.vue'
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
    state = {
      genderOptions: [{ value: '1', text: 'Male' }],
      subcohortOptions: [{ value: '101', text: 'baseline' }],
      ageGroupOptions: [],
      ageAtOptions: [],
      facetFilter: {
        gender: [],
        subcohort: [],
        ageGroupAt1A: [],
        ageGroupAt2A: [],
        ageGroupAt3A: [],
        yearOfBirthRange: []
      }
    }

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
})
