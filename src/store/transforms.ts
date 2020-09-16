import Assessment from '@/types/Assessment'
import CartSection from '@/types/CartSection'
import GridSelection from '@/types/GridSelection'
import groupBy from 'lodash.groupby'
import property from 'lodash.property'
import { Section } from '@/types/Section.ts'
import { TreeParent } from '@/types/Tree'
import { VariableWithVariants, Variable } from '@/types/Variable'
import Variant from '@/types/Variant'
import { RowColSet } from '@/types/Getters'
import { sortAlphabetically } from '@/services/variableSetOrderService'

const transforms:any = {}

transforms.assessments = (apiItems:any) => {
  const assessments = apiItems.reduce((accum: { [key: number]: Assessment }, assessment: Assessment) => {
    accum[assessment.id] = assessment
    return accum
  }, {})
  return assessments
}

transforms.cartTree = (gridSelection:GridSelection, treeStructure:any, sections:TreeParent[], subSectionList:any, variables:{ [key: number]: Variable }): CartSection[] => {
  const selectedVariableIds: number[] = Object.keys(gridSelection) as unknown as number[]
  const selectedVariables: Variable[] = selectedVariableIds
    .filter((id: number) => variables.hasOwnProperty(id))
    .map((id: number) => variables[id])
    // if variables occur in more than one subsection, duplicate them, adding one variable for each subsection
  const flatVariables = selectedVariables
    .flatMap((variable) => variable.subsections.map((subsection) => ({ ...variable, subsection })))
  const variablesPerSubsection = groupBy(flatVariables, property('subsection'))

  const cartSections = treeStructure.map((section: TreeParent) => {
    const subsections = section.list
      .filter((subsectionId) => variablesPerSubsection.hasOwnProperty(subsectionId))
      .map((subsectionId) => {
        return {
          name: subSectionList[subsectionId],
          variables: variablesPerSubsection[subsectionId]
        }
      })

    return { ...sections[section.key], subsections }
  }).filter((section:any) => section.subsections.length > 0)

  // sort variables withing subsections
  cartSections.forEach((section:CartSection) => section.subsections.forEach(subSection => subSection.variables.sort(sortAlphabetically)))

  return cartSections
}

transforms.helpers = {
  findEmpty: (grid: Array<Array<number>>) => {
    return grid.reduce((previous, current, index) => {
      if (current.every((value:number) => value === 0)) {
        previous.push(index)
      }
      return previous
    }, [])
  },
  transpose: (matrix: Array<Array<number>>) => {
    return (matrix && matrix.length && matrix[0].map && matrix[0].map(function (_, c) { return matrix.map(function (r) { return r[c] }) })) || []
  }
}

transforms.findZeroRowsAndCols = (grid:any) => {
  let rows: number[] = []
  let cols: number[] = []

  if (grid) {
    rows = transforms.helpers.findEmpty(grid)
    cols = transforms.helpers.findEmpty(transforms.helpers.transpose(grid))
  } else {
    return { rows: [], cols: [] }
  }
  return { rows, cols }
}

transforms.grid = (gridRows:VariableWithVariants[], gridColumns:any, variantCounts:any) => {
  if (gridRows === null) { return null }
  let grid = gridRows.map((variable: VariableWithVariants) => {
    const _assessments = gridColumns.map((assessment: Assessment) => {
      if (variantCounts === null) { return NaN }

      const variants: Variant[] = variable.variants.filter((variant: Variant) => variant.assessmentId === assessment.id)
      const _variantCounts: number[] = []

      // Get all counts for this variant.
      variants.forEach((variant: Variant) => {
        // @ts-ignore
        const variantCount = variantCounts.find((variantCount:any) => variant.id === variantCount.variantId)
        if (variantCount) {
          _variantCounts.push(variantCount.count)
        } else {
          _variantCounts.push(0)
        }
      })

      if (_variantCounts.every((value) => value === 0)) {
        return 0
      }
      if (_variantCounts.every((value) => value <= 0)) { return -1 } else {
        // Filter out any below threshold.
        const positiveVariantCounts = _variantCounts.filter((value) => value >= 0)
        // Sum it.
        return positiveVariantCounts.reduce((sum: number, nextValue: number) => sum + nextValue)
      }
    })

    return _assessments
  })

  return grid
}

transforms.gridRows = (gridRows:VariableWithVariants[], gridColumns:any, variantCounts:any, findZeroRowsAndCols: RowColSet, hideZeroData: boolean) => {
  let grid = transforms.grid(gridRows, gridColumns, variantCounts)
  if (grid && hideZeroData) {
    grid = grid.filter((_:any, index:number) => !findZeroRowsAndCols.rows.includes(index))
  }
  return grid
}

transforms.gridAssessments = (variants:any, assessments:{ [key:number]: Assessment }, filterAssessments: [] | null = null) => {
  const assessmentIds: number[] = variants.reduce((acc: number[], variant: Variant) => acc.includes(variant.assessmentId) ? acc : [...acc, variant.assessmentId], [])
  const gridAssessments = Object.values(assessments).filter((assessment:any) => assessmentIds.includes(assessment.id))

  if (Array.isArray(filterAssessments)) {
    // @ts-ignore
    return gridAssessments.filter((i:any) => filterAssessments.includes(i.id))
  }

  return gridAssessments
}

transforms.gridColumns = (variants:any, assessments:{ [key:number]: Assessment }, filterAssessments: [] | null, findZeroRowsAndCols: RowColSet, hideZeroData: boolean) => {
  let results = transforms.gridAssessments(variants, assessments, filterAssessments)
  if (results && hideZeroData) {
    const assessmentsInOrder = Object.keys(assessments)
    // dont filter out rows that are disabled
    results = results.filter((_:any, index:number) => {
      if (assessmentsInOrder.length > index) {
        const id = assessmentsInOrder[index]
        // @ts-ignore
        if (filterAssessments && filterAssessments.includes(parseInt(id))) {
          return !findZeroRowsAndCols.cols.includes(index)
        } else {
          return true
        }
      }
      return false
    })
  }
  return results
}

transforms.gridSelections = (gridAssessments:any, gridSelection:any, gridVariables:VariableWithVariants[]) => {
  if (gridVariables === null) { return null }
  return gridVariables.map((variable:any) => {
    const variableSelections = gridSelection[variable.id]
    return gridAssessments.map((assessment:any) => !!variableSelections && variableSelections.includes(assessment.id))
  })
}

transforms.sections = (apiItems:any) => {
  return apiItems.reduce((sections: { [key: number]: Section }, item: any) => {
    sections[item.id] = item
    return sections
  }, {})
}

transforms.sectionTree = (apiItems:any) => {
  let structure: { [id: number]: number[] } = {}
  apiItems.map((item: any) => {
    if (item.section_id.id in structure) {
      structure[item.section_id.id].push(item.subsection_id.id)
    } else {
      structure[item.section_id.id] = [item.subsection_id.id]
    }
  })
  let treeStructure: TreeParent[] = []
  for (let [key, value] of Object.entries(structure)) {
    treeStructure.push({ key: (key as unknown) as number, list: value })
  }

  return treeStructure
}

transforms.subSectionList = (apiItems:any) => {
  let subSections: string[] = []
  apiItems.map((item: any) => { subSections[item.id] = item.name })
  return subSections
}

transforms.treeStructure = (sectionTree:TreeParent[], sections:{ [key:number]: Section }, subSectionList: string[]) => {
  return sectionTree.map((item: TreeParent) => {
    return {
      ...sections[item.key],
      children: item.list.map((id: number) => {
        return {
          name: subSectionList[id],
          id
        }
      })
    }
  })
}

transforms.variables = (variables:[]) => {
  const variableMap: { [key: number]: Variable } =
        variables.reduce((soFar: { [key: number]: Variable }, variable:any) => {
          if (!variable.subsections) {
            variable.subsections = []
          } else {
            variable.subsections = variable.subsections.split(',').map((i: string) => parseInt(i, 10))
          }
          soFar[variable.id] = variable
          return soFar
        }, {})

  return variableMap
}

transforms.gridVariablesFiltered = (gridVariables:any, findZeroRowsAndCols: RowColSet, hideZeroData: boolean) => {
  if (gridVariables && hideZeroData) {
    gridVariables = gridVariables.filter((_:any, index:number) => !findZeroRowsAndCols.rows.includes(index))
  }
  return gridVariables
}

transforms.variants = (gridVariables:any): Variant[] => {
  if (gridVariables === null) { return [] }

  return gridVariables.reduce((result: Variant[], variable: VariableWithVariants): Variant[] => {
    return variable.variants.reduce((accumulator: Variant[], variant: Variant) => {
      if (accumulator.some((candidate: Variant): boolean => candidate.id === variant.id)) {
        return accumulator
      } else {
        return [...accumulator, variant]
      }
    }, result)
  }, [])
}

export default transforms
