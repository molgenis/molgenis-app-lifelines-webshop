import { finalVariableSetSort } from '@/services/variableSetOrderService'

describe('finalVariableSetSort', () => {
  it('sort the variable into its holding sets', () => {
    const out:any = [{
      id: 2,
      subvariables: [ { id: 3 }, { id: 4 }, { id: 5 } ]
    }, {
      id: 3,
      subvariable_of: { id: 2 }
    }, {
      id: 5,
      subvariable_of: { id: 2 }
    }, {
      id: 4,
      subvariable_of: { id: 2 }
    }, {
      id: 1
    }, {
      id: 6
    }]
    const data:any = [{
      id: 3,
      subvariable_of: { id: 2 }
    }, {
      id: 2,
      subvariables: [ { id: 3 }, { id: 4 }, { id: 5 } ]
    }, {
      id: 1
    }, {
      id: 6
    }, {
      id: 5,
      subvariable_of: { id: 2 }
    }, {
      id: 4,
      subvariable_of: { id: 2 }
    }]
    expect(finalVariableSetSort(data)).toEqual(out)
  })
})
