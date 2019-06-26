import getters from '@/store/getters'
import emptyState from '@/store/state'
import Getters from '@/types/Getters';
import ApplicationState from '@/types/applicationState';

describe('getters', () => {
  const emptyGetters: Getters = {
    variantIds: [],
    rsql: '',
    grid: [],
    gridAssessments: []
  }
  describe('rsql', () => {
    const gettersParam = {
      ...emptyGetters,
      variantIds: [1, 2]
    }
    it('filters subcohorts', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          subcohort:['ABCDE', 'FGHIJ']
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);ll_nr.subcohortABCDE_group==true;ll_nr.subcohortFGHIJ_group==true')
    })
    it('filters gender', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          gender:["1", "2"]
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);(ll_nr.gender_group==1,ll_nr.gender_group==2)')
    })
    it('filters age at 1A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt1A: ['1', '2']
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);(ll_nr.age_group_at_1a==1,ll_nr.age_group_at_1a==2)')
    })
    it('filters age at 2A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt2A: ['1', '2']
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);(ll_nr.age_group_at_2a==1,ll_nr.age_group_at_2a==2)')
    })
    it('filters age at 3A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt3A: ['1', '2']
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);(ll_nr.age_group_at_3a==1,ll_nr.age_group_at_3a==2)')
    })
    it('filters year of birth', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          yearOfBirthRange: [1960, 1980]
        }
      }
      expect(getters.rsql(state, gettersParam)).toBe('variant_id=in=(1,2);ll_nr.year_of_birth=ge=1960;ll_nr.year_of_birth=le=1980')
    })
    it('combines filters', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt1A: ['1'],
          gender: ['2'],
          subcohort: ['DEF']
        }
      }
      expect(getters.rsql(state, gettersParam))
        .toBe('variant_id=in=(1,2);ll_nr.age_group_at_1a==1;ll_nr.subcohortDEF_group==true;ll_nr.gender_group==2')
    })
  })

})