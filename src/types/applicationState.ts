import FacetOption from '@/types/facetOption'

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
    gender: String[],
    subcohort: String[],
    ageGroupAt1A: String[],
    ageGroupAt2A: String[],
    ageGroupAt3A: String[],
    yearOfBirthRange: Number[]
  },
  sectionList: String[],
  subSectionList: String[],
  treeStructure: Object[]
  treeSelected: String | null
}
