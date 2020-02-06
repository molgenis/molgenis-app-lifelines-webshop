import { formatNumber } from '../globals/formatting'
export const formatCount = function (value: number): string {
  if (value < 0) {
    return '1-15'
  } else if (isNaN(value)) {
    return '-'
  } else if (value > 0) {
    return formatNumber(value)
  }
  return value.toString()
}
