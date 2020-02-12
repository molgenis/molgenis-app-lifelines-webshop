import Variant from './Variant'
export interface Variable {
  id: number
  name: string
  label: string
  subsections: number[]
  subvariableOf: Variable | null
  definitionEn: string
  definitionNl: string
}

export interface VariableWithVariants extends Variable {
  variants: Variant[]
  options: string[]
  subvariables: Variable[]
}
