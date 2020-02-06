export const formatNumber = function (value: number): string {
  if (value < 9999) {
    return value.toString()
  } else {
    return `${Math.round(value / 1000)}k`
  }
}
