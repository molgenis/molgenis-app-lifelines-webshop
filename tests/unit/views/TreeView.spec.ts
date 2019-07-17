import { mount, createLocalVue, Wrapper } from '@vue/test-utils'
import TreeView from '@/views/TreeView.vue'
import Vue from 'vue'
import Vuex from 'vuex'
import ApplicationState from '@/types/ApplicationState'
import emptyState from '@/store/state'

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.filter('i18n', (value: string) => value) // Add dummy filter for i18n

describe('TreeView.vue', () => {
  let wrapper: Wrapper<Vue>
  let store: any
  let treeUpdate = jest.fn()
  let treeOpenUpdate = jest.fn()
  let actions = {
    loadSections: jest.fn(),
    loadSubSections: jest.fn(),
    loadSectionTree: jest.fn()
  }

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        filteredTreeStructure: () => [{
          name: 'parent',
          id: 5,
          open: true,
          children: [
            {
              id: 10,
              name: 'child'
            }
          ]
        }]
      },
      state: {
        treeSelected: -1,
        treeOpenSection: -1
      },
      actions,
      mutations: {
        updateTreeSelection: treeUpdate,
        updateTreeOpenSection: treeOpenUpdate
      }
    })

    wrapper = mount(TreeView, {
      stubs: {
        'font-awesome-icon': '<div/>'
      },
      store,
      localVue
    })
  })

  it('Will load needed data', () => {
    expect(actions.loadSections.mock.calls.length).toBe(1)
    expect(actions.loadSubSections.mock.calls.length).toBe(1)
    expect(actions.loadSectionTree.mock.calls.length).toBe(1)
  })

  it('Can update state', () => {
    expect(wrapper.exists()).toBeTruthy()
    wrapper.find('[title="parent"]').trigger('click')
    expect(treeOpenUpdate.mock.calls).toEqual([[{ 'treeOpenSection': -1, 'treeSelected': -1 }, 5]])
    wrapper.find('[title="child"]').trigger('click')
    expect(treeUpdate.mock.calls).toEqual([[{ 'treeOpenSection': -1, 'treeSelected': -1 }, 10]])
  })
})
