// Final re-sort. Make sure subvariables are below the containing variables
export const finalVariableSetSort = (gridVariables: any) => {
  let orderedGridVariables:any = []
  let variableSets:any = []
  // Step 1: ADD all non sub variables
  gridVariables.forEach((variable:any) => {
    if (!variable.subvariableOf) {
      orderedGridVariables.push(variable)
    }
    if (variable.subvariables && variable.subvariables.length > 0) {
      variableSets.push(variable)
    }
  })
  // Step 2: select variables with subvariables
  variableSets.forEach((setVariable:any) => {
    // Step 3: add subvariables in correct order
    gridVariables.forEach((variable:any) => {
      if (variable.subvariableOf && variable.subvariableOf.id === setVariable.id) {
        const index:number = orderedGridVariables.findIndex((item:any) => item.id === setVariable.id)
        orderedGridVariables.splice(index + 1, 0, variable)
      }
    })
  })
  console.assert(orderedGridVariables.length === gridVariables.length)
  return orderedGridVariables
}
