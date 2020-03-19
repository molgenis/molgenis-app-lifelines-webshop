import Assessment from '@/types/Assessment'
import CartSection from '@/types/CartSection'
import Filter from '@/types/Filter'
import GridSelection from '@/types/GridSelection'
import groupBy from 'lodash.groupby'
import property from 'lodash.property'
import { Section } from '@/types/Section.ts'
import { TreeParent } from '@/types/Tree'
import { VariableWithVariants, Variable } from '@/types/Variable'
import Variant from '@/types/Variant'

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

  return treeStructure.map((section: TreeParent) => {
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
}

transforms.helpers = {
  findEmpty: (set:any) => {
    return set.reduce((acc:any, array:any) => {
      array.sort() // if sorted and first and last array element is equal to 0 we know all elements are zerow
      if (array[0] === array[array.length - 1] && array[0] === 0) {
        acc.push(true)
      } else {
        acc.push(false)
      }
      return acc
    }, [])
  },
  transpose: (array:[]) => {
    // @ts-ignore
    return (array && array.length && array[0].map && array[0].map(function (_, c) { return array.map(function (r) { return r[c] }) })) || []
  }
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
        const variantCount = variantCounts.find((variantCount) => variant.id === variantCount.variantId)
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

transforms.gridAssessments = (variants:any, assessments:{ [key:number]: Assessment }, filterAssessments: [] | null = null, filterEmpty: boolean | null = null) => {
  const assessmentIds: number[] = variants.reduce((acc: number[], variant: Variant) => acc.includes(variant.assessmentId) ? acc : [...acc, variant.assessmentId], [])
  const gridAssessments = Object.values(assessments).filter((assessment:any) => assessmentIds.includes(assessment.id))

  if (filterEmpty !== null) {

  }

  if (Array.isArray(filterAssessments)) {
    // @ts-ignore
    return gridAssessments.filter((i:any) => filterAssessments.includes(i.id))
  }

  return gridAssessments
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
