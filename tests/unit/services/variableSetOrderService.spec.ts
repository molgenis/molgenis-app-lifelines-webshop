import { finalVariableSetSort } from '@/services/variableSetOrderService'

describe('finalVariableSetSort', () => {
  // finalVariableSetSort takes a set of data and sorts so that subvariable are always after the parent variable
  // Note: the original order will be kept
  it('sorts the sub variables below its parent variable', () => {
    // data where the variable sets are not correctly together
    const data:any = [{
      id: 1 // Normal variable
    }, {
      id: 3, // Sub variable
      subvariable_of: { id: 2 }
    }, {
      id: 2, // Parent variable
      subvariables: [ { id: 3 }, { id: 4 }, { id: 5 } ]
    }, {
      id: 6 // Normal variable
    }, {
      id: 4, // Sub variable
      subvariable_of: { id: 2 }
    }, {
      id: 5, // Sub variable
      subvariable_of: { id: 2 }
    }]

    // Wished results
    const out:any = [{
      id: 1 // Normal variable
    }, {
      id: 2, // Parent variable
      subvariables: [ { id: 3 }, { id: 4 }, { id: 5 } ]
    }, {
      id: 3, // Sub variable
      subvariable_of: { id: 2 }
    }, {
      id: 4, // Sub variable
      subvariable_of: { id: 2 }
    }, {
      id: 5, // Normal variable
      subvariable_of: { id: 2 }
    }, {
      id: 6 // Normal variable
    }]
    expect(finalVariableSetSort(data)).toEqual(out)
  })
})
