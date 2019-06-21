import FacetOption from '@/types/facetOption'

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
    }
  }
