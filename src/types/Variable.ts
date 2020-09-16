import Variant from './Variant'

export interface VariableBase {
  id: number
  name: string
}

export interface Variable extends VariableBase{
  label: string
  subsections: number[]
  subvariableOf: Variable | null
  definitionEn: string
  definitionNl: string
}

export interface VariableWithVariants extends Variable{
  variants: Variant[]
  options: string[]
  subvariables: Variable[]
}

export interface CartVariableBase extends VariableBase{
  _href: string
}

export interface CartVariable extends CartVariableBase {
  subsection: number
  subsections: number[]
  // eslint-disable-next-line camelcase
  subvariable_of: CartVariableBase | null
}
