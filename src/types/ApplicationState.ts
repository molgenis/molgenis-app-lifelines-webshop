import FacetOption from '@/types/FacetOption'
import { Variable, VariableWithVariants } from '@/types/Variable'
import Count from '@/types/Count'
import Assessment from '@/types/Assessment'
import GridSelection from '@/types/GridSelection'
import Filter from './Filter'
import { Section } from '@/types/Section.ts'
import { TreeParent } from '@/types/Tree'
import FormField from './FormField'
import { Order } from './Order'
import { ContextState } from '@molgenis/molgenis-ui-context/src/types'

export type Toast = {
  type: 'danger' | 'success',
  message: string
}

export interface AppState {
  order: Order,
  orderFormFields: FormField[]
  variables: { [key:number]: Variable },
  assessments: { [key:number]: Assessment },
  sections: { [key:number]: Section },
  subSectionList: string[],
  toast: Toast | null,
  genderOptions: FacetOption[],
  subcohortOptions: FacetOption[],
  ageGroupOptions: FacetOption[],
  ageAtOptions: FacetOption[],
  facetFilter: Filter,
  treeStructure: TreeParent[]
  gridVariables: VariableWithVariants[]
  variantCounts: Count[]
  participantCount: number | null
  treeSelected: number
  treeOpenSection: number
  treeOpenPageSection: number
  gridSelection: GridSelection
  searchTerm: string | null
  filteredSubsections: number[] | null
  filteredSections: number[] | null
  isGridLoading: boolean,
  orders: Order[] | null
}

export default interface ApplicationState extends AppState {
  context?: ContextState
}
