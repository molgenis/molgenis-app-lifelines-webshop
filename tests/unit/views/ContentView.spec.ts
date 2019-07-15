import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContentView from '@/views/ContentView.vue'
import Vuex, { Store } from 'vuex'
import SearchComponent from '@/components/search/SearchComponent.vue'
import mutations from '@/store/mutations'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ContentView.vue', () => {
  const filterSections = jest.fn()
  const filterSubsections = jest.fn()
  const loadGridVariables = jest.fn()
  const updateSearchTerm = jest.fn()
  const isSearchResultEmpty = jest.fn()
  const store = new Store({
    state: { treeSelection: 3 },
    actions: {
      filterSections,
      filterSubsections,
      loadGridVariables
    },
    mutations: {
      updateSearchTerm
    },
    getters: {
      isSearchResultEmpty
    }
  })

  it('Renders the content', () => {
    const wrapper = shallowMount(ContentView, { store, localVue })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('#Content-view').exists()).toBeTruthy()
  })

  it('updates search term and dispatches filter actions when the search term changes', () => {
    const wrapper = shallowMount(ContentView, { store, localVue })

    wrapper.find(SearchComponent).vm.$emit('seachChanged', 'mini')

    expect(updateSearchTerm).toHaveBeenCalled()
    expect(filterSections).toHaveBeenCalled()
    expect(filterSubsections).toHaveBeenCalled()
    expect(loadGridVariables).toHaveBeenCalled()
  })
})
