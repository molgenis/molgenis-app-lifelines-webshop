import Variant from './Variant'
export interface Variable {
  id: number
  name: string
  label: string
  subsections: number[]
  subvariable_of: Variable
  subvariables: Variable[]
}

export interface VariableWithVariants extends Variable {
  variants: Variant[]
}
