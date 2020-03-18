import Assessment from '@/types/Assessment'
import GridCell from '@/types/GridCell'
import { TreeNode } from './TreeNode'
import Variant from './Variant'

export default interface Getters {
  isSignedIn: boolean
  variants: Variant[]
  variantIds: number[]
  rsql: string
  gridAssessments: Assessment[]
  gridAssessmentsActive: Assessment[]
  grid: number[][]
  gridActive: number[][]
  gridSelections: boolean[][]
  treeStructure: TreeNode[]
  searchTermQuery: string | null
  isSearchResultEmpty: boolean
  numberOfSelectedItems: Number
}
