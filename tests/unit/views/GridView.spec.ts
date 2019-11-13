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
      isSignedIn: true,
      treeSelected: -1,
      gridVariables: [],
      isGridLoading: false
    }
    loadGridDataMock = jest.fn()
    loadGridVariables = jest.fn()

    actions = {
      loadGridVariables: loadGridVariables,
      loadGridData: loadGridDataMock,
      loadAssessments: jest.fn()
    }

    getters = {
      rsql: jest.fn(),
      gridAssessments: () => [],
      grid: () => [],
      gridSelections: () => [],
      numberOfSelectedItems: () => 0
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

  describe('When treeSelected changes', () => {
    it('loadGridVariables action gets called', () => {
      let treeSelected = -1
      wrapper = shallowMount(GridView, {
        store,
        computed: {
          treeSelected: {
            get () {
              return treeSelected
            },
            set (value) {
              treeSelected = value
            }
          }
        }
      })

      /**
      * This is needed to trigger the watch that is actualy based on a mocked store
      *
      * Best to avoid watching store state
      */
      // @ts-ignore
      wrapper.setData({ treeSelected: 101 })
      // @ts-ignore
      wrapper.vm._computedWatchers['treeSelected'].value = 101
      // @ts-ignore
      wrapper.vm._watchers.forEach(watcher => {
        watcher.run()
      })
      expect(loadGridVariables).toHaveBeenCalled()
    })
  })

  describe('When rsql changes', () => {
    it('loadGridData action gets called (again)', () => {
      let rsql = 'abc'
      wrapper = shallowMount(GridView, {
        store,
        computed: {
          rsql: {
            get () {
              return rsql
            },
            set (value) {
              rsql = value
            }
          }
        }
      })

      /**
      * This is needed to trigger the watch that is actualy based on a mocked store
      *
      * Best to avoid watching store state
      */
      // @ts-ignore
      wrapper.setData({ rsql: 'efg' })
      // @ts-ignore
      wrapper.vm._computedWatchers['rsql'].value = 'efg'
      // @ts-ignore
      wrapper.vm._watchers.forEach(watcher => {
        watcher.run()
      })
      expect(loadGridDataMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('When handleGridRowToggle gets called', () => {
    it('handleGridRowToggle mutation should be called', () => {
      wrapper = shallowMount(GridView, { store })

      let variableId = 1024
      // @ts-ignore
      wrapper.vm.handleGridRowToggle(variableId)
      expect(toggleGridRowMock).toHaveBeenCalled()
    })
  })

  describe('When handleGridColumnToggle gets called', () => {
    it('toggleGridColumn mutation should be called', () => {
      wrapper = shallowMount(GridView, { store })

      let assessmentId = 56
      // @ts-ignore
      wrapper.vm.handleGridColumnToggle(assessmentId)
      expect(toggleGridColumnMock).toHaveBeenCalled()
    })
  })

  describe('When handleGridCellToggle gets called', () => {
    it('toggleGridSelection mutation should be called', () => {
      wrapper = shallowMount(GridView, {
        store,
        computed: {
          gridVariables: () => [{ id: 1 }, { id: 2 }, { id: 3 }],
          gridAssessments: () => [{ id: 1 }, { id: 2 }]
        }
      })

      let rowIndex = 2
      let colIndex = 1
      // @ts-ignore
      wrapper.vm.handleGridCellToggle(rowIndex, colIndex)
      expect(toggleGridSelectionMock).toHaveBeenCalled()
    })
  })

  describe('When handleGridAllToggle gets called', () => {
    it('toggleAll mutation should be called', () => {
      wrapper = shallowMount(GridView, { store })

      // @ts-ignore
      wrapper.vm.handleGridAllToggle()
      expect(toggleAllMock).toHaveBeenCalled()
    })
  })
})
