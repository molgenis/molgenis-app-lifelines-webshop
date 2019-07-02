import FacetOption from '@/types/facetOption'
import Variable from '@/types/Variable'
import Count from '@/types/Count'
import Assessment from '@/types/Assessment'
import GridSelection from '@/types/GridSelection'

export default interface ApplicationState {
  genderOptions: FacetOption[],
  subcohortOptions: FacetOption[],
  ageGroupOptions: FacetOption[],
  ageAtOptions: FacetOption[],
  facetFilter: {
    gender: string[],
    subcohort: string[],
    ageGroupAt1A: string[],
    ageGroupAt2A: string[],
    ageGroupAt3A: string[],
    yearOfBirthRange: number[]
  },
  sectionList: string[],
  subSectionList: string[],
  treeStructure: Object[]
  variables: Variable[]
  variantCounts: Count[]
  assessments: Assessment[]
  treeSelected: number
  treeOpenSection: string
  gridSelection: GridSelection
}
