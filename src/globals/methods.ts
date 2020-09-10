import { VariableWithVariants } from '@/types/Variable'

function variableSetClass (variable:VariableWithVariants) {
  if (variable.subvariableOf) {
    return 'subvariable'
  }

  if (variable.subvariables && variable.subvariables.length > 0) {
    return 'subvariable-parent'
  }
}

export default { variableSetClass }
