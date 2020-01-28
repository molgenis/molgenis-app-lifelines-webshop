import getters from '@/store/getters'
import emptyState from '../fixtures/state'
import Getters from '@/types/Getters'
import ApplicationState from '@/types/ApplicationState'
import Variant from '@/types/Variant'
import Assessment from '@/types/Assessment'
import { VariableWithVariants } from '@/types/Variable'
import { TreeNode } from '@/types/TreeNode'
import { Section } from '@/types/Section'
import CartSection from '@/types/CartSection'
import state from '@/store/state'

describe('getters', () => {
  const emptyGetters: Getters = {
    isSignedIn: false,
    variants: [],
    variantIds: [],
    rsql: '',
    grid: [],
    gridAssessments: [],
    searchTermQuery: null,
    treeStructure: [],
    gridSelections: [],
    isSearchResultEmpty: false,
    numberOfSelectedItems: 0
  }

  const variant1: Variant = { id: 1, assessmentId: 1 }
  const variant2: Variant = { id: 2, assessmentId: 2 }
  const variant3: Variant = { id: 3, assessmentId: 1 }

  const assessment1A: Assessment = { id: 1, name: '1A' }
  const assessment2A: Assessment = { id: 2, name: '2A' }
  const assessment3A: Assessment = { id: 3, name: '3A' }
  const assessment1B: Assessment = { id: 4, name: '1B' }

  const section1: Section = { id: 1, name: 'Section 1' }
  const section2: Section = { id: 2, name: 'Section 2' }

  const variable11: VariableWithVariants = {
    id: 11,
    label: 'variable 11',
    name: 'VAR11',
    variants: [variant2, variant1],
    subsections: [1]
  }
  const variable12: VariableWithVariants = {
    id: 12,
    label: 'variable 12',
    name: 'VAR12',
    variants: [variant1],
    subsections: [1, 2]
  }
  const variable13: VariableWithVariants = {
    id: 13,
    label: 'variable 13',
    name: 'VAR13',
    variants: [variant3],
    subsections: [3]
  }

  describe('cartTree', () => {
    it('should be empty if variables have not yet been loaded', () => {
      expect(getters.cartTree({ ...emptyState })).toEqual([])
    })
    it('should group selection by sections and subsections', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: { 11: variable11, 12: variable12, 13: variable13 },
        sections: { 1: section1, 2: section2 },
        subSectionList: ['subsection 0', 'subsection 1', 'subsection 2', 'subsection 3'],
        treeStructure: [
          { key: 1, list: [1, 3] },
          { key: 2, list: [2] }
        ],
        gridSelection: { 11: [1, 2], 13: [1] }
      }
      const expected: CartSection[] = [{
        id: 1,
        name: 'Section 1',
        subsections: [{
          name: 'subsection 1',
          variables: [{
            ...variable11,
            subsection: 1
          }]
        }, {
          name: 'subsection 3',
          variables: [{
            ...variable13,
            subsection: 3
          }]
        }]
      }]
      expect(getters.cartTree(state)).toEqual(expected)
    })
    it('should duplicate variables that occur in multiple subsections', () => {
      const state: ApplicationState = {
        ...emptyState,
        variables: { 11: variable11, 12: variable12, 13: variable13 },
        sections: { 1: section1, 2: section2 },
        subSectionList: ['subsection 0', 'subsection 1', 'subsection 2', 'subsection 3'],
        treeStructure: [
          { key: 1, list: [1, 3] },
          { key: 2, list: [2] }
        ],
        gridSelection: { 12: [1] }
      }
      const expected: CartSection[] = [
        {
          id: 1,
          name: 'Section 1',
          subsections: [{
            name: 'subsection 1',
            variables: [{
              ...variable12,
              subsection: 1
            }]
          }]
        }, {
          id: 2,
          name: 'Section 2',
          subsections: [{
            name: 'subsection 2',
            variables: [{
              ...variable12,
              subsection: 2
            }]
          }]
        }]
      expect(getters.cartTree(state)).toEqual(expected)
    })
  })

  describe('isSignedIn', () => {
    it('is false when context is not authenticated', () => {
      expect(getters.isSignedIn({ ...emptyState, context: { context: { authenticated: false } } as any })).toBe(false)
    })
    it('is true when context is authenticated', () => {
      expect(getters.isSignedIn({ ...emptyState, context: { context: { authenticated: true } } as any })).toBe(true)
    })
  })

  describe('variants', () => {
    it('determines unique variants from variables', () => {
      const state: ApplicationState = {
        ...emptyState,
        gridVariables: [variable11, variable12, variable13]
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
      expect(getters.rsql(state)).toBe('ll_nr.subcohortABCDE_group==true,ll_nr.subcohortFGHIJ_group==true')
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
        gridVariables: [variable11, variable12],
        variantCounts: [{ variantId: 1, count: 10 }, { variantId: 2, count: 100 }]
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridAssessments: [ assessment1A, assessment2A ],
        variants: [variant1, variant2, variant3]
      }
      expect(getters.grid(state, gettersParam)).toEqual([[10, 100], [10, 0]])
    })
    it('returns NaN if counts are missing', () => {
      const state: ApplicationState = {
        ...emptyState,
        gridVariables: [variable11, variable12]
      }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridAssessments: [ assessment1A, assessment2A ],
        variants: [variant1, variant2, variant3]
      }
      expect(getters.grid(state, gettersParam)).toEqual([[NaN, NaN], [NaN, NaN]])
    })
  })

  describe('gridSelections', () => {
    it('computes grid selections', () => {
      const state: ApplicationState = {
        ...emptyState,
        gridVariables: [variable11, variable12, variable13],
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
  describe('numberOfSelectedItems', () => {
    it('count the number of "true" grid selections', () => {
      const state: ApplicationState = { ...emptyState }
      const gettersParam: Getters = {
        ...emptyGetters,
        gridSelections: [[true, true], [true, false], [false, false]]
      }
      expect(getters.numberOfSelectedItems(state, gettersParam)).toEqual(3)
    })
  })
  describe('treeStructure', () => {
    describe('when section data has not been loaded', () => {
      const state: ApplicationState = {
        ...emptyState
      }
      const gettersParam: Getters = {
        ...emptyGetters
      }
      it('should return a empty array', () => {
        expect(getters.treeStructure(state, gettersParam)).toEqual([])
      })
    })

    describe('when section was loaded but subsection was not', () => {
      const state: ApplicationState = {
        ...emptyState,
        sections: {
          1: {
            id: 1,
            name: 'section'
          }
        }
      }
      const gettersParam: Getters = {
        ...emptyGetters
      }
      it('should return the section list', () => {
        expect(getters.treeStructure(state, gettersParam)).toEqual([{ 'id': 1, 'name': 'section' }])
      })
    })

    describe('when sections, subSections and treeStructure are loaded', () => {
      const state: ApplicationState = {
        ...emptyState,
        sections: {
          1: {
            id: 1,
            name: 'section'
          }
        },
        subSectionList: ['sub-section1'],
        treeStructure: [{ key: 1, list: [0] }]
      }

      const gettersParam: Getters = {
        ...emptyGetters
      }
      it('should return the complete tree structure', () => {
        expect(getters.treeStructure(state, gettersParam)).toEqual([{ 'children': [{ 'id': 0, 'name': 'sub-section1' }], 'id': 1, 'name': 'section' }])
      })
    })
  })

  describe('searchTermQuery', () => {
    it('should be null if the search term is null', () => {
      expect(getters.searchTermQuery(emptyState)).toBeNull()
    })

    it('should give rsql that searches variable name and label for the search term', () => {
      expect(getters.searchTermQuery({ ...emptyState, searchTerm: 'hello' })).toBe('name=q=hello,label=q=hello')
    })

    it('should escape rsql characters', () => {
      expect(getters.searchTermQuery({ ...emptyState, searchTerm: 'a==b' })).toBe('name=q=\'a==b\',label=q=\'a==b\'')
    })

    it('should give rsql that filters subsection', () => {
      expect(getters.searchTermQuery({ ...emptyState, treeSelected: 3 })).toBe('subsection_id==3')
    })

    it('should give rsql that searches within subsection', () => {
      expect(getters.searchTermQuery({ ...emptyState, treeSelected: 3, searchTerm: 'hello' })).toBe('subsection_id==3;(variable_id.name=q=hello,variable_id.label=q=hello)')
    })
  })
  describe('isGridLoading', () => {
    it('is initially false', () => {
      expect(getters.isGridLoading(emptyState)).toBe(false)
    })
    it('is true while loading variantCounts', () => {
      expect(getters.isGridLoading({ ...emptyState, gridVariables: [], treeSelected: 1 })).toBe(true)
    })
    it('is true while loading gridVariables', () => {
      expect(getters.isGridLoading({ ...emptyState, variantCounts: [], treeSelected: 1 })).toBe(true)
    })
    it('is false when loaded', () => {
      expect(getters.isGridLoading({ ...emptyState, gridVariables: [], variantCounts: [], treeSelected: 1 })).toBe(false)
    })
  })

  describe('isSearchResultEmpty', () => {
    it('should be false is no search term is given', () => {
      expect(getters.isSearchResultEmpty(emptyState)).toBeFalsy()
    })

    it('should be false if search term is given but search result in non empty', () => {
      let searchTermState = { ...emptyState }
      searchTermState.treeSelected = 0
      searchTermState.searchTerm = 'test'
      searchTermState.gridVariables = [variable11, variable12]
      expect(getters.isSearchResultEmpty(searchTermState)).toBeFalsy()
    })

    it('should be true if search term is given and search results are loading', () => {
      let searchTermState = { ...emptyState }
      searchTermState.treeSelected = 0
      searchTermState.searchTerm = 'test'
      searchTermState.gridVariables = null
      expect(getters.isSearchResultEmpty(searchTermState)).toBe(false)
    })

    it('should be true if search term is given but search result are empty', () => {
      let searchTermState = { ...emptyState }
      searchTermState.treeSelected = 0
      searchTermState.searchTerm = 'test'
      searchTermState.gridVariables = []
      expect(getters.isSearchResultEmpty(searchTermState)).toBe(true)
    })
  })

  describe('hasManagerRole', () => {
    it('is false when user is not a manager', () => {
      const testState = { ...emptyState, context: { context: { roles: ['some_role'] } } as any }
      expect(getters.hasManagerRole(testState)).toBe(false)
    })
    it('is true when user is a manager', () => {
      const testState = { ...emptyState, context: { context: { roles: ['ROLE_LIFELINES_MANAGER'] } } as any }
      expect(getters.hasManagerRole(testState)).toBe(true)
    })
  })
})
