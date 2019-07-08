import FacetOption from '@/types/FacetOption'
import { Variable, VariableWithVariants } from '@/types/Variable'
import Count from '@/types/Count'
import Assessment from '@/types/Assessment'
import GridSelection from '@/types/GridSelection'
import Filter from './Filter'

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
  facetFilter: Filter,
  sectionList: string[],
  subSectionList: string[],
  treeStructure: Object[]
  variables: { [key:number]: Variable }
  gridVariables: VariableWithVariants[]
  variantCounts: Count[]
  assessments: { [key:number]: Assessment }
  treeSelected: number
  treeOpenSection: string
  gridSelection: GridSelection
}
