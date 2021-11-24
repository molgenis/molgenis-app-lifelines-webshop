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
import { Context, ContextState } from '@molgenis/molgenis-ui-context/src/types'
import { SubSection } from './SubSection'

export type Toast = {
  type?: 'danger' | 'warning' | 'success' | 'info' | 'primary' | 'secondary'
  textType?: 'primary' | 'secondary' | 'light' | 'dark' | 'white' | 'black'
  message: string
  title?: string
  timeout?: number
}

export interface AppState {
  loading: number
  isSearching: boolean
  order: Order
  orderFormFields: FormField[]
  variables: { [key:number]: Variable }
  assessments: { [key:number]: Assessment }
  sections: { [key:number]: Section }
  subSectionList: { [key: number]: SubSection }
  toast: Toast[]
  genderOptions: FacetOption[]
  subcohortOptions: FacetOption[]
  ageGroupOptions: FacetOption[]
  ageAtOptions: FacetOption[]
  facetFilter: Filter
  treeStructure: TreeParent[]
  gridVariables: VariableWithVariants[] | null
  variantCounts: Count[] | null
  participantCount: number | null
  treeSelected: number
  treeOpenSection: number
  treeOpenPageSection: number
  gridSelection: GridSelection
  searchExact: boolean
  searchTerm: string | null
  filteredSubsections: number[] | null
  filteredSections: number[] | null
  orders: Order[] | null
  ordersTotal: number
}

// we start using the store only after the context is loaded
interface LoadedContextState extends ContextState {
    context: Context
}

export default interface ApplicationState extends AppState {
  context: LoadedContextState
}
