import FacetOption from '@/types/facetOption'

export default interface ApplicationState {
  genderOptions: FacetOption[],
  subcohortOptions: FacetOption[],
  ageGroupOptions: FacetOption[],
  ageAtOptions: FacetOption[],
  facetFilter: {
    gender: Strin    ageAtOptions: FacetOption[],    facetFilter: {      gender: String[],        subcohort: String[],      ageGroupAt1A: String[,],s  aeGroupAt2A: String[],	      ageGroupAt3A: String]t,
      yearOfBirthRange: Number[]
    }
  }	  sectionLis
t: String ,
  subSectionList: String[],
  treeStructure: Object[]
  treeSelected: String | null
}
