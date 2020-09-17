import { finalVariableSetSort, sortAlphabetically } from '@/services/variableSetOrderService'

describe('finalVariableSetSort', () => {
  // finalVariableSetSort takes a set of data and sorts so that subvariable are always after the parent variable
  // Note: the original order will be kept
  it('sorts the sub variables below its parent variable', () => {
    // data where the variable sets are not correctly together
    const data:any = [{
      id: 1, // Normal variable
      name: '1',
      subvariables: []
    }, {
      id: 3, // Sub variable
      name: '3',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }, {
      id: 2, // Parent variable
      name: '2',
      subvariables: [ { id: 3, name: '3' }, { id: 4, name: '4' }, { id: 5, name: '5' } ]
    }, {
      id: 6, // Normal variable
      name: '6',
      subvariables: []
    }, {
      id: 4, // Sub variable
      name: '4',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }, {
      id: 5, // Sub variable
      name: '5',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }]

    // Wished results
    const out:any = [{
      id: 1, // Normal variable
      name: '1',
      subvariables: []
    }, {
      id: 2, // Parent variable
      name: '2',
      subvariables: [ { id: 3, name: '3' }, { id: 4, name: '4' }, { id: 5, name: '5' } ]
    }, {
      id: 3, // Sub variable
      name: '3',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }, {
      id: 4, // Sub variable
      name: '4',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }, {
      id: 5, // Normal variable
      name: '5',
      subvariableOf: { id: 2, name: '2' },
      subvariables: []
    }, {
      id: 6, // Normal variable
      name: '6',
      subvariables: []
    }]
    expect(finalVariableSetSort(data)).toEqual(out)
  })

  describe('sortAlphabetically', () => {
    it('should sort the varaibles alphabetically by name prop', () => {
      const varaibles: any = [
        { name: 'z' },
        { name: 'A' },
        { name: 'b' }
      ]
      varaibles.sort(sortAlphabetically)

      expect(varaibles).toEqual(
        [
          { name: 'A' },
          { name: 'b' },
          { name: 'z' }
        ]
      )
    })
  })
})
