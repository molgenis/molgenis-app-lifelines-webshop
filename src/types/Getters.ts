import Assessment from '@/types/Assessment'
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
  findZeroRowsAndCols: RowColSet
}

export interface RowColSet {
  rows: number[]
  cols: number[]
}
