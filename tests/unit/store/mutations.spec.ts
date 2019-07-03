import mutations from '@/store/mutations'
import state from '@/store/state'

describe('mutations', () => {
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
        gridSelection: {}
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }] })
      expect(state.gridSelection).toEqual({ 123: [1, 2] })
    })

    it('removes if all already selected', () => {
      const state = {
        gridSelection: { 123: [1, 2, 3], 456: [1] }
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 456: [1] })
    })

    it('selects all if one already selected', () => {
      const state = {
        gridSelection: { 123: [1] }
      }
      mutations.toggleGridRow(state, { variableId: 123, gridAssessments: [{ id: 1, name: 'a1' }, { id: 2, name: 'a2' }, { id: 3, name: 'a3' }] })
      expect(state.gridSelection).toEqual({ 123: [1, 2, 3] })
    })
  })
  describe('toggleGridColumn', () => {
    it('selects if none selected', () => {
      const state = {
        gridSelection: {},
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
      expect(state.gridSelection).toEqual({ 1: [3], 2: [], 3: [] })
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
