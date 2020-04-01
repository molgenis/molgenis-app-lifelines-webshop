import { shallowMount, Wrapper } from '@vue/test-utils'
import GridView from '@/views/GridView.vue'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('GridView', () => {
  let store: any
  let getters
  let mutations
  let actions
  let wrapper: Wrapper<Vue>
  let state: any

  let loadGridDataMock: any
  let loadGridVariables: any

  let toggleGridRowMock: any
  let toggleGridColumnMock: any
  let toggleGridSelectionMock: any
  let toggleAllMock: any

  beforeEach(() => {
    state = {
      facetFilter: { hideZeroData: true },
      searchTermQueryMock: null,
      rsqlMock: '',
      treeSelected: -1,
      gridVariables: [],
      subSectionList: ['subsection1', 'subsection2', 'subsection3']
    }
    loadGridDataMock = jest.fn()
    loadGridVariables = jest.fn()

    actions = {
      loadGridVariables: loadGridVariables,
      loadGridData: loadGridDataMock,
      loadAssessments: jest.fn()
    }

    getters = {
      searchTermQuery: (state: any) => state.searchTermQueryMock,
      rsql: (state: any) => state.rsqlMock,
      gridAssessments: () => [],
      gridColumns: () => [],
      gridRows: () => [],
      gridActive: () => [],
      gridSelections: () => [],
      numberOfSelectedItems: () => 0,
      isSignedIn: () => true,
      isGridLoading: () => false,
      isSearchResultEmpty: () => false,
      gridVariables: () => [],
      findZeroRowsAndCols: () => { return { cols: [], rows: [] } }
    }

    toggleGridRowMock = jest.fn()
    toggleGridColumnMock = jest.fn()
    toggleGridSelectionMock = jest.fn()
    toggleAllMock = jest.fn()

    mutations = {
      toggleGridRow: toggleGridRowMock,
      toggleGridColumn: toggleGridColumnMock,
      toggleGridSelection: toggleGridSelectionMock,
      toggleAll: toggleAllMock
    }

    store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations
    })
  })

  describe('On creation', () => {
    it('Renders the gridView', () => {
      wrapper = shallowMount(GridView, { store })
      expect(wrapper.find('#grid-view').exists()).toBeTruthy()
    })
  })

  describe('When searchTermQuery changes', () => {
    it('loadGridVariables action gets called', () => {
      wrapper = shallowMount(GridView, { store })
      store.state.searchTermQueryMock = 'subsection_id==3'
      expect(loadGridVariables).toHaveBeenCalled()
    })
  })

  describe('When rsql changes', () => {
    it('loadGridData action gets called (again)', () => {
      state.rsqlMock = 'abc'
      wrapper = shallowMount(GridView, { store })
      state.rsqlMock = 'efg'
      expect(loadGridDataMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('When handleGridCellToggle gets called', () => {
    it('toggleGridSelection mutation should be called', () => {
      wrapper = shallowMount(GridView, {
        store,
        computed: {
          gridVariables: () => [{ id: 1 }, { id: 2 }, { id: 3 }],
          gridColumns: () => [{ id: 1 }, { id: 2 }]
        }
      })

      let rowIndex = 2
      let colIndex = 1
      // @ts-ignore
      wrapper.vm.handleGridCellToggle(rowIndex, colIndex)
      expect(toggleGridSelectionMock).toHaveBeenCalled()
    })
  })
})
