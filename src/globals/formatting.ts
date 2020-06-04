export const formatNumber = function (value: number): string {
  if (value < 15) {
    return value.toString()
  } else if (value < 99) {
    return `≈ ${value - (value % 10)}`
  } else if (value < 999) {
    return `≈ ${value - (value % 100)}`
  } else {
    return `${Math.round(value / 1000)}k`
  }
}
