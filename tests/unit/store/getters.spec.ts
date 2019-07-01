import getters from '@/store/getters'
import emptyState from '@/store/state'
import Getters from '@/types/Getters'
import ApplicationState from '@/types/applicationState'
import Variant from '@/types/Variant'
import Assessment from '@/types/Assessment'
import Variable from '@/types/Variable'

describe('getters', () => {
  const emptyGetters: Getters = {
    variants: [],
    variantIds: [],
    rsql: '',
    grid: [],
    gridAssessments: []
  }

  const variant1: Variant = { id: 1, assessmentId: 1 }
  const variant2: Variant = { id: 2, assessmentId: 2 }
  const variant3: Variant = { id: 3, assessmentId: 1 }

  const assessment1A: Assessment = { id: 1, name: '1A' }
  const assessment2A: Assessment = { id: 2, name: '2A' }
  const assessment3A: Assessment = { id: 3, name: '3A' }
  const assessment1B: Assessment = { id: 4, name: '1B' }

  const variable11: Variable = {
    id: 11,
    label: 'variable 11',
    name: 'VAR11',
    variants: [variant2, variant1]
  }
  const variable12: Variable = {
    id: 12,
    label: 'variable 12',
    name: 'VAR12',
    variants: [variant1]
  }
  const variable13: Variable = {
    id: 13,
    label: 'variable 13',
    name: 'VAR13',
    variants: [variant3]
  }

  describe('variants', () => {
    it('determines unique variants from variables', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: [variable11, variable12, variable13]
      }
      expect(getters.variants(state)).toEqual([variant2, variant1, variant3])
    })
    it('returns empty array for empty state', () => {
      expect(getters.variants(emptyState)).toEqual([])
    })
  })

  describe('variantIds', () => {
    it('takes the ids of the variants getter', () => {
      const gettersParam: Getters = {
        ...emptyGetters,
        variants: [variant1, variant2, variant3]
      }
      expect(getters.variantIds(emptyState, gettersParam)).toEqual([1, 2, 3])
    })
    it('returns empty array for empty variants getter', () => {
      expect(getters.variantIds(emptyState, emptyGetters)).toEqual([])
    })
  })

  describe('rsql', () => {
    it('filters subcohorts', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          subcohort: ['ABCDE', 'FGHIJ']
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.subcohortABCDE_group==true;ll_nr.subcohortFGHIJ_group==true')
    })
    it('filters gender', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          gender: ['1', '2']
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.gender_group==1,ll_nr.gender_group==2')
    })
    it('filters age at 1A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt1A: ['1', '2']
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.age_group_at_1a==1,ll_nr.age_group_at_1a==2')
    })
    it('filters age at 2A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt2A: ['1', '2']
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.age_group_at_2a==1,ll_nr.age_group_at_2a==2')
    })
    it('filters age at 3A', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          ageGroupAt3A: ['1', '2']
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.age_group_at_3a==1,ll_nr.age_group_at_3a==2')
    })
    it('filters year of birth', () => {
      const state: ApplicationState = {
        ...emptyState,
        facetFilter: {
          ...emptyState.facetFilter,
          yearOfBirthRange: [1960, 1980]
        }
      }
      expect(getters.rsql(state)).toBe('ll_nr.year_of_birth=ge=1960;ll_nr.year_of_birth=le=1980')
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
      expect(getters.rsql(state))
        .toBe('ll_nr.age_group_at_1a==1;ll_nr.subcohortDEF_group==true;ll_nr.gender_group==2')
    })
  })

  describe('gridAssessments', () => {
    it('determines assessments for selected variants', () => {
      const state: ApplicationState = {
        ...emptyState,
        assessments: [ assessment1A, assessment2A, assessment3A, assessment1B ]
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        variants: [variant1, variant2, variant3]
      }
      expect(getters.gridAssessments(state, gettersParam)).toEqual([assessment1A, assessment2A])
    })
  })

  describe('grid', () => {
    it('computes grid counts', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: [variable11, variable12],
        variantCounts: [{ variantId: 1, count: 10 }, { variantId: 2, count: 100 }]
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridAssessments: [ assessment1A, assessment2A ],
        variants: [variant1, variant2, variant3]
      }
      expect(getters.grid(state, gettersParam)).toEqual([[10, 100], [10, 0]])
    })
    it('returns zero if counts are missing', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: [variable11, variable12]
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridAssessments: [ assessment1A, assessment2A ],
        variants: [variant1, variant2, variant3]
      }
      expect(getters.grid(state, gettersParam)).toEqual([[0, 0], [0, 0]])
    })
  })

  describe('gridSelections', () => {
    it('computes grid selections', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: [variable11, variable12, variable13],
        gridSelection: { 11: [1, 2], 12: [1] }
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridAssessments: [ assessment1A, assessment2A ]
      }
      expect(getters.gridSelections(state, gettersParam))
        .toEqual([[true, true], [true, false], [false, false]])
    })
  })
})
