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

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        treeStructure: () => [{
          name: 'parent',
          open: true,
          children: [
            {
              id: 10,
              name: 'child'
            }
          ]
        }]
      },
      actions: {
        loadSections: jest.fn(),
        loadSubSections: jest.fn(),
        loadSectionTree: jest.fn()
      },
      mutations: {
        updateTreeSelection: treeUpdate
      }
    })
    store.state.treeSelected = -1

    wrapper = mount(TreeView, {
      stubs: {
        'font-awesome-icon': '<div/>'
      },
      store,
      localVue
    })
  })

  it('Can select child item', () => {
    expect(wrapper.exists()).toBeTruthy()
    wrapper.find('[title="parent"]').trigger('click')
    wrapper.find('[title="child"]').trigger('click')
    expect(treeUpdate.mock.calls).toEqual([ [ { treeSelected: -1 }, 10 ] ])
  })
})
