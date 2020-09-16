import { VariableWithVariants, Variable, VariableBase, CartVariable, CartVariableBase } from '@/types/Variable'

const sortAlphabetically = (a: VariableBase, b:VariableBase) => {
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
  variableSets.forEach((setVariable:Variable) => {
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

// Variables in the cart have a more limited set of properties
// By not being able to have a 'variableSets' (speed, database reasons) the sorting will need to be done slighty difrent
export const finalVariableSetSortCart = (gridVariables: CartVariable[]) => {
  let orderedVariables:CartVariable[] = []
  let childVariables:CartVariable[] = []

  // 1: Split variables from sub variables
  gridVariables.forEach((variable:any) => {
    if (!variable.subvariable_of) {
      orderedVariables.push(variable)
    } else {
      childVariables.push(variable)
    }
  })

  orderedVariables.sort(sortAlphabetically)
  childVariables.sort(sortAlphabetically)

  // Step 2: select variables with subvariables
  orderedVariables.forEach((nonChildVariable:CartVariable) => {
    // Step 3: add subvariables in correct order
    let offset = 1
    childVariables.forEach((childVariable:CartVariable) => {
      if (childVariable.subvariable_of && childVariable.subvariable_of.id === nonChildVariable.id) {
        const index:number = orderedVariables.findIndex((item:CartVariable) => item.id === nonChildVariable.id)
        orderedVariables.splice(index + offset, 0, childVariable)
        offset++
      }
    })
  })
  return orderedVariables
}
