import getters from '@/store/getters'
import emptyState from '@/store/state'
import Getters from '@/types/Getters';

describe('getters', () => {
  const emptyGetters: Getters = {
    variantIds: [],
    rsql: '',
    grid: [],
    gridAssessments: []
  }
  describe('rsql', () => {
    it('filters subcohorts', () => {
      const state = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          subcohort:['ABCDE', 'FGHIJ']
        }
      }
      const gettersParam = {
        ...emptyGetters,
        variantIds: [1, 2]
      }
      expect(getters.rsql(state, gettersParam))
        .toBe('variant_id=in=(1,2);ll_nr.subcohortABCDE_group==true;ll_nr.subcohortFGHIJ_group==true')
    })
  })

})