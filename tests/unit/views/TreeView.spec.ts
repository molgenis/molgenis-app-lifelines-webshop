import { mount, createLocalVue, Wrapper } from '@vue/test-utils'
import TreeView from '@/views/TreeView.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import ApplicationState from '@/types/applicationState'

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('TreeView.vue', () => {
  let wrapper: Wrapper<Vue>
  let state: ApplicationState
  let commitMock = jest.fn()

  beforeEach(() => {
    state = {
      toast: null,
      variantCounts: [],
      assessments: [],
      gridSelection: {},
      variables: [],
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
      },
      treeStructure: [{
        name: 'parent',
        open: true,
        children: [
          {
            id: 10,
            name: 'child'
          }
        ]
      }],
      sectionList: [],
      subSectionList: [],
      treeSelected: -1
    }

    wrapper = mount(TreeView, {
      stubs: {
        'font-awesome-icon': '<div/>'
      },
      mocks: {
        $store: {
          state,
          commit: commitMock,
          dispatch: jest.fn()
        }
      },
      localVue
    })
  })

  it('Can select child item', () => {
    expect(wrapper.exists()).toBeTruthy()
    wrapper.find('[title="parent"]').trigger('click')
    wrapper.find('[title="child"]').trigger('click')
    expect(commitMock.mock.calls).toEqual([ [ 'updateTreeSelection', 10 ] ])
  })
})
