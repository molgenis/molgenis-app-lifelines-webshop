import FacetOption from '@/types/facetOption'
import Variable from '@/types/Variable'
import Count from '@/types/Count'
import Assessment from '@/types/Assessment'

export default interface ApplicationState {
  genderOptions: FacetOption[],
  subcohortOptions: FacetOption[],
  ageGroupOptions: FacetOption[],
  ageAtOptions: FacetOption[],
  facetFilter: {
    gender: String[],
    subcohort: String[],
    ageGroupAt1A: String[],
    ageGroupAt2A: String[],
    ageGroupAt3A: String[],
    yearOfBirthRange: Number[]
  },
  sectionList: String[],
  subSectionList: String[],
  variables: Variable[]
  variantCounts: Count[]
  assessments: Assessment[]
  treeStructure: Object[]
  treeSelected: Number
  gridSelection: Object[]
}
