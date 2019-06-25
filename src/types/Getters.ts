import Assessment from '@/types/Assessment'
import GridCell from '@/types/GridCell'

export default interface Getters {
  variantIds: number[]
  rsql: string
  gridAssessments: Assessment[]
  grid: GridCell[][]
}
