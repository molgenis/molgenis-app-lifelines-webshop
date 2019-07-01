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

    it('appends assessment to variable', () => {
      const state = {
        gridSelection: { 123: [1] }
      }
      mutations.toggleGridSelection(state, { variableId: 123, assessmentId: 2 })
      expect(state.gridSelection).toEqual({ 123: [1, 2] })
    })
  })
})
