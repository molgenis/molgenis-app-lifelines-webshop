const roundPow10 = (input: number, pow: number) => {
  return Math.round(input / Math.pow(10, pow)) * Math.pow(10, pow)
}

export const formatNumber = function (value: number): string {
  if (value < 15) {
    return value.toString()
  } else if (value < 99) {
    return `≈ ${roundPow10(value, 1)}`
  } else if (value < 999) {
    return `≈ ${roundPow10(value, 2)}`
  } else {
    return `${Math.round(value / 1000)}k`
  }
}
