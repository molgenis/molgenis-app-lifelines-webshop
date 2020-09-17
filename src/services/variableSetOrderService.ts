import { VariableWithVariants, Variable } from '@/types/Variable'

export const sortAlphabetically = (a: Variable, b:Variable) => {
  return a.name.localeCompare(b.name)
}

// Final re-sort. Make sure subvariables are below the containing variables
export const finalVariableSetSort = (gridVariables: VariableWithVariants[]) => {
  gridVariables.sort(sortAlphabetically)

  let orderedGridVariables:VariableWithVariants[] = []
  let variableSets:VariableWithVariants[] = []
  // Step 1: ADD all non sub variables
  gridVariables.forEach((variable:any) => {
    if (!variable.subvariableOf) {
      orderedGridVariables.push(variable)
    }
    if (variable.subvariables.length) {
      variableSets.push(variable)
    }
  })

  orderedGridVariables.sort(sortAlphabetically)

  // Step 2: select variables with subvariables
  variableSets.forEach((setVariable:VariableWithVariants) => {
    // Step 3: add subvariables in correct order
    let offset = 1
    gridVariables.forEach((variable:VariableWithVariants) => {
      if (variable.subvariableOf && variable.subvariableOf.id === setVariable.id) {
        const index:number = orderedGridVariables.findIndex((item:VariableWithVariants) => item.id === setVariable.id)
        orderedGridVariables.splice(index + offset, 0, variable)
        offset++
      }
    })
  })

  // Sort subvariables
  orderedGridVariables.forEach(ogv => {
    if (ogv.subvariables) {
      ogv.subvariables.sort(sortAlphabetically)
    }
  })
  return orderedGridVariables
}
