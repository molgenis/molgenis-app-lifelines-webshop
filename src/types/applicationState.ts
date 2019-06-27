import FacetOption from '@/types/facetOption'
import Variable from '@/types/Variable'
import Count from '@/types/Count'
import Assessment from '@/types/Assessment'
import GridSelection from '@/types/GridSelection'

export type Toast = {
  type: 'danger' | 'success',
  message: string
}

export default interface ApplicationState {
  toast: Toast | null,
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
  variables: Variable[]
  variantCounts: Count[]
  assessments: Assessment[]
  treeStructure: Object[]
  treeSelected: number
  gridSelection: GridSelection
}
