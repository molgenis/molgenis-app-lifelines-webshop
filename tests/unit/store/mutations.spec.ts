import mutations from '@/store/mutations'
import state from '../fixtures/state'
import orders from '../fixtures/orders'
import { OrderState } from '@/types/Order'

describe('mutations', () => {
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
      mutations.setOrders(baseAppState, orders)
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
      expect(baseAppState.toast).toEqual({ type: 'danger', message: 'message' })
    })
  })

  describe('clearToast', () => {
    it('clears the toast', () => {
      let baseAppState = Object.assign({}, state)
      mutations.setToast(baseAppState, { type: 'danger', message: 'message' })
      mutations.clearToast(baseAppState)
      expect(baseAppState.toast).toEqual(null)
    })
  })

  describe('updateTreeSelection', () => {
    it('updates the treeSelected number with the give number', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateTreeSelection(baseAppState, 99)
      expect(baseAppState.treeSelected).toEqual(99)
    })
  })

  describe('setOrderDetails', () => {
    it('sets the order form values', () => {
      let baseAppState = Object.assign({}, state)
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
        state: OrderState.Draft
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
        state: null,
        submissionDate: null,
        creationDate: null,
        updateDate: null
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
        state: OrderState.Draft
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
        state: OrderState.Draft
      })
    })
  })

  describe('updateFacetFilter', () => {
    it('replace facets with the passed facets', () => {
      let baseAppState = Object.assign({}, state)
      mutations.updateFacetFilter(baseAppState, {
        gender: ['female'],
        subcohort: [],
        ageGroupAt1A: [],
        ageGroupAt2A: ['65+'],
        ageGroupAt3A: [],
        yearOfBirthRange: []
      })
      expect(baseAppState.facetFilter).toEqual({
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
    it('selects if none selected', () => {
      const state = {
        gridSelection: {},
        treeSelected: -1
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }] })
      expect(state.gridSelection).toEqual({ 123: [1, 2] })
    })

    it('removes if all already selected', () => {
      const state = {
        gridSelection: { 123: [1, 2, 3], 456: [1] },
        treeSelected: -1
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 456: [1] })
    })

    it('selects all if one already selected', () => {
      const state = {
        gridSelection: { 123: [1] },
        treeSelected: -1
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 123: [1, 2, 3] })
    })
  })
  describe('toggleGridColumn', () => {
    it('selects if none selected', () => {
      const state = {
        gridSelection: {},
        treeSelected: -1,
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 },
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] } ]
      }
      mutations.toggleGridColumn(state, { assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 1: [2], 2: [2], 3: [2] })
    })

    it('removes if all already selected', () => {
      const state = {
        gridSelection: { 1: [2, 3], 2: [2], 3: [2] },
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 },
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] } ]
      }
      mutations.toggleGridColumn(state, { assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 1: [3] })
    })

    it('selects all if one already selected', () => {
      const state = {
        gridSelection: { 1: [2], 3: [3] },
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 },
              { assessmentId: 4, assessment_id: 4, id: 44 },
              { assessmentId: 5, assessment_id: 5, id: 55 },
              { assessmentId: 6, assessment_id: 6, id: 66 }] } ]
      }
      mutations.toggleGridColumn(state, { assessmentId: 3 })
      expect(state.gridSelection).toEqual({ 1: [2, 3], 2: [3], 3: [3] })
    })
  })

  describe('toggleAll', () => {
    it('selects if none selected', () => {
      const state = {
        gridSelection: {},
        treeSelected: -1,
        treeStructure: [],
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 55 },
              { assessmentId: 3, assessment_id: 3, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 }] } ]
      }
      mutations.toggleAll(state, { gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3] })
    })

    it('removes if all already selected', () => {
      const state = {
        gridSelection: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3] },
        treeSelected: -1,
        treeStructure: [],
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 55 },
              { assessmentId: 3, assessment_id: 3, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 }] } ]
      }
      mutations.toggleAll(state, { gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({})
    })

    it('selects all if one already selected', () => {
      const state = {
        gridSelection: { 1: [2] },
        treeSelected: -1,
        treeStructure: [],
        gridVariables: [
          { id: 1,
            label: 'A',
            name: 'A1',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 } ] },
          { id: 2,
            label: 'B',
            name: 'B2',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 1, assessment_id: 1, id: 55 },
              { assessmentId: 3, assessment_id: 3, id: 66 }] },
          { id: 3,
            label: 'C',
            name: 'C3',
            variants: [
              { assessmentId: 1, assessment_id: 1, id: 11 },
              { assessmentId: 2, assessment_id: 2, id: 22 },
              { assessmentId: 3, assessment_id: 3, id: 33 }] } ]
      }
      mutations.toggleAll(state, { gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3] })
    })
  })
})
