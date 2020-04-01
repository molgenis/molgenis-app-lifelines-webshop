import mutations from '@/store/mutations'
import state from '../fixtures/state'
import orders from '../fixtures/orders'
import { OrderState } from '@/types/Order'
import { Toast } from '@/types/ApplicationState'
import { VariableWithVariants } from '@/types/Variable'
import initialState from '@/store/state'

const gridVariables:VariableWithVariants[] = [
  {
    id: 100,
    label: 'A',
    name: 'A1',
    variants: [
      { assessmentId: 200, id: 300 },
      { assessmentId: 201, id: 301 },
      { assessmentId: 202, id: 302 }],
    subsections: [1],
    subvariableOf: null,
    subvariables: [],
    options: [],
    definitionEn: '',
    definitionNl: ''
  },
  {
    id: 101,
    label: 'B',
    name: 'B2',
    variants: [
      { assessmentId: 203, id: 303 },
      { assessmentId: 204, id: 304 },
      { assessmentId: 205, id: 305 }],
    subsections: [1],
    subvariableOf: null,
    subvariables: [],
    options: [],
    definitionEn: '',
    definitionNl: ''
  },
  {
    id: 102,
    label: 'C',
    name: 'C3',
    variants: [
      { assessmentId: 200, id: 300 },
      { assessmentId: 201, id: 301 },
      { assessmentId: 202, id: 302 },
      { assessmentId: 203, id: 303 },
      { assessmentId: 204, id: 304 },
      { assessmentId: 205, id: 305 }],
    subsections: [1],
    subvariableOf: null,
    subvariables: [],
    options: [],
    definitionEn: '',
    definitionNl: ''
  }]

describe('mutations', () => {
  describe('changeOrderStatus', () => {
    it('updates the orderStatus with given value', () => {
      const baseAppState = { ...state }
      mutations.changeOrderStatus(baseAppState, OrderState.Rejected)
      expect(baseAppState.order.state).toEqual('Rejected')
    })
  })

  describe('deleteOrder', () => {
    it('should skip delete if orders list is empty', () => {
      const deleteState:any = {
        orders: null
      }
      mutations.deleteOrder(deleteState, 'invalid number')
      expect(deleteState.orders).toEqual(null)
    })

    it('should remove order if its in the orders list', () => {
      const deleteState:any = {
        orders: [
          { orderNumber: '123' },
          { orderNumber: '456' }
        ]
      }
      mutations.deleteOrder(deleteState, '456')
      expect(deleteState.orders).toEqual([{ orderNumber: '123' }])
    })
  })

  describe('setOrderFormFields', () => {
    it('sets the orderFormFields', () => {
      const baseAppState = { ...state }
      mutations.setOrderFormFields(baseAppState, [{ id: 'test', type: 'demo' }])
      expect(baseAppState.orderFormFields).toEqual([{ id: 'test', type: 'demo' }])
    })
  })

  describe('setOrders', () => {
    it('sets the orders', () => {
      const baseAppState = { ...state }
      const response = { items: orders, total: orders.length }
      mutations.setOrders(baseAppState, response)
      expect(baseAppState.orders).toEqual(orders)
    })
  })

  describe('setProjectNumberRequiredFunction', () => {
    it('sets projectNumber required function', () => {
      const baseAppState = { ...state }
      const requiredFunction = () => true
      mutations.setProjectNumberRequiredFunction(baseAppState, requiredFunction)
      expect(baseAppState.orderFormFields[0].required).toBe(requiredFunction)
    })
  })

  describe('updateParticipantCount', () => {
    it('updates participant count', () => {
      const baseAppState = { ...state }
      mutations.updateParticipantCount(baseAppState, 12)
      expect(baseAppState.participantCount).toBe(12)
    })

    it('sets participant count to null', () => {
      const baseAppState = { ...state, participantCount: 12 }
      mutations.updateParticipantCount(baseAppState, null)
      expect(baseAppState.participantCount).toBeNull()
    })
  })

  describe('updateFilteredSections', () => {
    it('updates filtered sections', () => {
      const baseAppState = { ...state }
      mutations.updateFilteredSections(baseAppState, [1, 2])
      expect(baseAppState.filteredSections).toEqual([1, 2])
    })
  })

  describe('updateFilteredSubsections', () => {
    it('updates filtered subsections', () => {
      const baseAppState = { ...state }
      mutations.updateFilteredSubsections(baseAppState, [1, 2])
      expect(baseAppState.filteredSubsections).toEqual([1, 2])
    })
  })

  describe('update sections', () => {
    it('updates sections', () => {
      const baseAppState = { ...state }
      mutations.updateSections(baseAppState, { 0: { id: 1, name: 'test' } })
      expect(baseAppState.sections).toEqual({ 0: { id: 1, name: 'test' } })
    })
  })
  describe('update subsections', () => {
    it('updates subsections', () => {
      const baseAppState = { ...state }
      mutations.updateSubSections(baseAppState, ['one', 'two'])
      expect(baseAppState.subSectionList).toEqual(['one', 'two'])
    })
  })
  describe('update variables', () => {
    it('updates variables', () => {
      const baseAppState = { ...state }
      mutations.updateVariables(baseAppState, {
        0: {
          id: 1,
          label: 'test label',
          name: 'test',
          subsections: [1, 2, 3, 4],
          subvariableOf: null,
          definitionNl: '',
          definitionEn: ''
        }
      })
      expect(baseAppState.variables).toEqual({
        0:
        {
          id: 1,
          label: 'test label',
          name: 'test',
          subsections: [1, 2, 3, 4],
          subvariableOf: null,
          definitionNl: '',
          definitionEn: ''
        }
      })
    })
  })
  describe('update assessments', () => {
    it('updates assessments', () => {
      const baseAppState = { ...state }
      mutations.updateAssessments(baseAppState, { 0: { id: 1, name: 'test' } })
      expect(baseAppState.assessments).toEqual({ 0: { id: 1, name: 'test' } })
    })
  })
  describe('updateSearchTerm', () => {
    it('updates search term', () => {
      const baseAppState = { ...state }
      mutations.updateSearchTerm(baseAppState, 'hello')
      expect(baseAppState.searchTerm).toEqual('hello')
    })

    it('removes search term', () => {
      const baseAppState = { ...state }
      mutations.updateSearchTerm(baseAppState, null)
      expect(baseAppState.searchTerm).toEqual(null)
    })
  })

  describe('setToast', () => {
    it('replace the toast with the passed toast', () => {
      let baseAppState = Object.assign({}, state)
      mutations.setToast(baseAppState, { type: 'danger', message: 'message' })
      expect(baseAppState.toast).toEqual([{ type: 'danger', message: 'message' }])
    })
  })

  describe('clearToast', () => {
    it('clears the toast', () => {
      let baseAppState = Object.assign({}, state)
      mutations.setToast(baseAppState, { type: 'danger', message: 'message' })
      mutations.clearToast(baseAppState)
      expect(baseAppState.toast).toEqual([])
    })
  })

  describe('removeToast', () => {
    it('removeToast a single toast from the list', () => {
      let baseAppState = Object.assign({}, state)
      mutations.clearToast(baseAppState)
      let toastBase: Toast = { type: 'danger', message: 'message' }
      let toastBody: Toast = { type: 'danger', message: 'message2' }
      mutations.setToast(baseAppState, toastBase)
      mutations.setToast(baseAppState, toastBody)
      mutations.removeToast(baseAppState, toastBody)
      expect(baseAppState.toast).toEqual([toastBase])
    })
  })

  describe('updateTreeSelection', () => {
    it('updates the treeSelected number with the give number', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateTreeSelection(baseAppState, 99)
      expect(baseAppState.treeSelected).toEqual(99)
    })
  })

  describe('updateTreeOpenSelection', () => {
    it('updates the treeOpenSelected number with the given number', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateTreeOpenSection(baseAppState, 99)
      expect(baseAppState.treeOpenPageSection).toEqual(99)
    })
  })

  describe('setOrderDetails', () => {
    it('sets the order form values', () => {
      const baseAppState = { ...state }
      const order = {
        orderNumber: 'edit',
        name: 'name',
        projectNumber: 'projectNumber',
        applicationForm: {
          id: 'fileId',
          filename: 'fileName',
          url: 'fileUrl'
        },
        submissionDate: 'ignore',
        creationDate: 'ignore',
        updateDate: 'ignore',
        state: OrderState.Draft,
        contents: null,
        email: null,
        user: null
      }
      mutations.setOrderDetails(baseAppState, order)

      expect(baseAppState.order).toEqual({
        orderNumber: null,
        name: 'name',
        projectNumber: 'projectNumber',
        applicationForm: {
          id: 'fileId',
          filename: 'fileName',
          url: 'fileUrl'
        },
        state: 'Rejected',
        submissionDate: null,
        creationDate: null,
        updateDate: null,
        contents: null,
        email: null,
        user: null
      })
    })
  })

  describe('restoreOrderState', () => {
    it('sets the order fields from the response', () => {
      let baseAppState = Object.assign({}, state)
      const response = {
        href: 'href',
        meta: 'meta',
        orderNumber: 'edit',
        name: 'name',
        projectNumber: 'projectNumber',
        applicationForm: {
          id: 'fileId',
          filename: 'fileName',
          url: 'fileUrl'
        },
        submissionDate: 'edit',
        creationDate: 'creationDate',
        updateDate: 'updateDate',
        state: OrderState.Draft,
        contents: null,
        email: null,
        user: null
      }
      mutations.restoreOrderState(baseAppState, response)

      expect(baseAppState.order).toEqual({
        orderNumber: 'edit',
        name: 'name',
        projectNumber: 'projectNumber',
        applicationForm: {
          id: 'fileId',
          filename: 'fileName',
          url: 'fileUrl'
        },
        submissionDate: 'edit',
        creationDate: 'creationDate',
        updateDate: 'updateDate',
        state: OrderState.Draft,
        contents: null,
        email: null,
        user: null
      })
    })
  })

  describe('updateFacetFilter', () => {
    it('replace facets with the passed facets', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateFacetFilter(baseAppState, {
        assessment: [],
        gender: ['female'],
        subcohort: [],
        ageGroupAt1A: [],
        ageGroupAt2A: ['65+'],
        ageGroupAt3A: [],
        yearOfBirthRange: []
      })
      expect(baseAppState.facetFilter).toEqual({
        assessment: [],
        gender: ['female'],
        subcohort: [],
        ageGroupAt1A: [],
        ageGroupAt2A: ['65+'],
        ageGroupAt3A: [],
        yearOfBirthRange: []
      })
    })
  })

  describe('updateGenderFilter', () => {
    it('replace the filter genders with the selected genders', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateGenderFilter(baseAppState, ['female'])
      expect(baseAppState.facetFilter.gender).toEqual(['female'])
    })
  })

  describe('updateSubcohortfilter', () => {
    it('replace the filter subcohorts with the selected subcohorts', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateSubcohortfilter(baseAppState, ['ABCD'])
      expect(baseAppState.facetFilter.subcohort).toEqual(['ABCD'])
    })
  })

  describe('updateSelectedAgeAt', () => {
    it('replace the filter agegroup selections with passed ageAt', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateSelectedAgeAt(baseAppState, {
        ageGroupAt1A: ['a'],
        ageGroupAt2A: ['b'],
        ageGroupAt3A: ['c', 'd']
      })
      expect(baseAppState.facetFilter.ageGroupAt1A).toEqual(['a'])
      expect(baseAppState.facetFilter.ageGroupAt2A).toEqual(['b'])
      expect(baseAppState.facetFilter.ageGroupAt3A).toEqual(['c', 'd'])
    })
  })

  describe('updateYearOfBirthRangefilter', () => {
    it('replace the filter yob range with the selected yob range', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateYearOfBirthRangefilter(baseAppState, [1960, 2010])
      expect(baseAppState.facetFilter.yearOfBirthRange).toEqual([1960, 2010])
    })
  })

  describe('removeYearOfBirthRangefilter', () => {
    it('resets the year of birth range filter ', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateYearOfBirthRangefilter(baseAppState, [1960, 2010])
      expect(baseAppState.facetFilter.yearOfBirthRange).toEqual([1960, 2010])
      mutations.removeYearOfBirthRangefilter(baseAppState)
      expect(baseAppState.facetFilter.yearOfBirthRange).toEqual([])
    })
  })

  describe('removeAgeAtFilter', () => {
    it('resets the age at filter ', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateSelectedAgeAt(baseAppState, {
        ageGroupAt1A: ['a'],
        ageGroupAt2A: ['b'],
        ageGroupAt3A: ['c', 'd']
      })
      expect(baseAppState.facetFilter.ageGroupAt1A).toEqual(['a'])
      expect(baseAppState.facetFilter.ageGroupAt2A).toEqual(['b'])
      expect(baseAppState.facetFilter.ageGroupAt3A).toEqual(['c', 'd'])
      mutations.removeAgeAtFilter(baseAppState)
      expect(baseAppState.facetFilter.ageGroupAt1A).toEqual([])
      expect(baseAppState.facetFilter.ageGroupAt2A).toEqual([])
      expect(baseAppState.facetFilter.ageGroupAt3A).toEqual([])
    })
  })

  describe('updateGridSelection', () => {
    it('updates grid selection', () => {
      const myState = {
        ...state,
        gridSelection: {}
      }
      mutations.updateGridSelection(myState, { 1: [2, 3] })
      expect(myState.gridSelection).toEqual({ 1: [2, 3] })
    })
  })

  describe('toggleGridSelection', () => {
    it('selects if none selected', () => {
      const state = {
        gridSelection: {}
      }
      mutations.toggleGridSelection(state, { variableId: 123, assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 123: [2] })
    })

    it('removes if already selected', () => {
      const state = {
        gridSelection: { 123: [1, 2, 3] }
      }
      mutations.toggleGridSelection(state, { variableId: 123, assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 123: [1, 3] })
    })

    it('removes variable if last selected assessment is removed', () => {
      const state = {
        gridSelection: { 123: [1, 2, 3], 456: [4] }
      }
      mutations.toggleGridSelection(state, { variableId: 456, assessmentId: 4 })
      expect(state.gridSelection).toEqual({ 123: [1, 2, 3] })
    })

    it('appends assessment to variable', () => {
      const state = {
        gridSelection: { 123: [1] }
      }
      mutations.toggleGridSelection(state, { variableId: 123, assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 123: [1, 2] })
    })
  })
  describe('toggleGridRow', () => {
    let state:any

    beforeAll(() => {
      state = {
        assessments: {
          200: { id: 200, name: 'a1' },
          201: { id: 201, name: 'a2' },
          202: { id: 202, name: 'a3' }
        },
        facetFilter: { assessment: [200, 201, 202] },
        gridVariables,
        treeSelected: -1
      }
    })

    it('selects if none selected', () => {
      Object.assign(state, { gridSelection: {} })
      mutations.toggleGridRow(state, 100)
      expect(state.gridSelection).toEqual({ 100: [200, 201, 202] })
    })

    it('removes if all already selected', () => {
      Object.assign(state, { gridSelection: { 100: [200, 201, 202], 101: [200] } })
      mutations.toggleGridRow(state, 100)
      expect(state.gridSelection).toEqual({ 101: [200] })
    })

    it('selects all if one already selected', () => {
      Object.assign(state, { gridSelection: { 100: [200] } })

      mutations.toggleGridRow(state, 100)
      expect(state.gridSelection).toEqual({ 100: [200, 201, 202] })
    })
  })
  describe('toggleGridColumn', () => {
    let state:any

    beforeAll(() => {
      state = {
        assessments: {
          200: { id: 200, name: 'a1' },
          201: { id: 201, name: 'a2' },
          202: { id: 202, name: 'a3' }
        },
        facetFilter: { assessment: [1, 2, 3] },
        gridVariables,
        treeSelected: -1
      }
    })

    it('selects if none selected', () => {
      Object.assign(state, {
        gridSelection: { 100: [], 101: [], 102: [] }
      })

      mutations.toggleGridColumn(state, 200)
      expect(state.gridSelection).toEqual({ '100': [200], '101': [200], '102': [200] })
    })

    it('removes if all already selected', () => {
      Object.assign(state, {
        gridSelection: { 100: [200, 201, 202], 101: [200, 201, 202], 102: [200, 201, 202] }
      })

      mutations.toggleGridColumn(state, 200)
      expect(state.gridSelection).toEqual({ '100': [201, 202], '101': [201, 202], '102': [201, 202] })
    })

    it('selects all if one already selected', () => {
      Object.assign(state, { gridSelection: { 100: [200], 101: [201], 102: [] } })
      mutations.toggleGridColumn(state, 200)
      expect(state.gridSelection).toEqual({ '100': [200], '101': [201, 200], '102': [200] })
    })
  })

  describe('toggleAll', () => {
    let state:any

    beforeAll(() => {
      state = {
        assessments: {
          200: { id: 200, name: 'a1' },
          201: { id: 201, name: 'a2' },
          202: { id: 202, name: 'a3' }
        },
        facetFilter: { assessment: [200, 201, 202], hideZeroData: false },
        gridVariables,
        treeSelected: -1,
        variantCounts: []
      }
    })

    it('selects if none selected', () => {
      Object.assign(state, {
        gridSelection: {}
      })

      mutations.toggleAll(state)
      expect(state.gridSelection).toEqual({
        100: [200, 201, 202],
        101: [200, 201, 202],
        102: [200, 201, 202]
      })
    })

    it('removes if all already selected', () => {
      Object.assign(state, {
        gridSelection: {
          100: [200, 201, 202],
          101: [200, 201, 202],
          102: [200, 201, 202]
        }
      })

      mutations.toggleAll(state)
      expect(state.gridSelection).toEqual({ })
    })

    it('selects all if one already selected', () => {
      const state:any = {
        ...initialState,
        assessments: {
          200: { id: 200, name: 'a1' },
          201: { id: 201, name: 'a2' },
          202: { id: 202, name: 'a3' }
        },
        facetFilter: { assessment: [200, 201, 202] },
        gridSelection: { 100: [200] },
        treeSelected: -1,
        treeStructure: [],
        gridVariables
      }
      mutations.toggleAll(state)
      expect(state.gridSelection).toEqual({
        100: [200, 201, 202],
        101: [200, 201, 202],
        102: [200, 201, 202]
      })
    })
  })

  describe('setLoading', () => {
    it('does not mutate loading variable when toggle is set to false', () => {
      mutations.setLoading(state, false)
      expect(state.loading).toBe(0)
    })

    it('adds 1 to loading variable when toggle is set to true', () => {
      mutations.setLoading(state, true)
      expect(state.loading).toBe(1)
    })

    it('subtracts 1 from loading variable when toggle is set to false and state is 1', () => {
      state.loading = 1
      mutations.setLoading(state, false)
      expect(state.loading).toBe(0)
    })
  })
})
