import Assessment from '@/types/Assessment'
import GridCell from '@/types/GridCell'
import Variant from './Variant'

export default interface Getters {
  variants: Variant[]
  variantIds: number[]
  rsql: string
  gridAssessments: Assessment[]
  grid: number[][]
}
