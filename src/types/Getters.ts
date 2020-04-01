import Assessment from '@/types/Assessment'
import GridCell from '@/types/GridCell'
import GridSelection from '@/types/GridSelection'
import { TreeNode } from './TreeNode'
import Variant from './Variant'

export default interface Getters {
  isSignedIn: boolean
  variants: Variant[]
  variantIds: number[]
  rsql: string
  grid: number[][]
  gridActive: number[][]
  gridAssessments: Assessment[]
  gridColumns: Assessment[]
  gridSelections: boolean[][]
  treeStructure: TreeNode[]
  searchTermQuery: string | null
  isSearchResultEmpty: boolean
  numberOfSelectedItems: Number
  findZeroRowsAndCols: { cols: number[], rows: number[] }
}
