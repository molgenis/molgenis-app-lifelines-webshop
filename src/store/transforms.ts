import { gridSelectionFromCart } from '@/store/helpers'
import CartSection from '@/types/CartSection'
import Assessment from '@/types/Assessment'
import { Section } from '@/types/Section.ts'
import { TreeParent } from '@/types/Tree'
import { Variable } from '@/types/Variable'
import groupBy from 'lodash.groupby'
import property from 'lodash.property'

const transforms:any = {}

transforms.assessments = (apiItems:any) => {
  const assessments = apiItems.reduce((accum: { [key: number]: Assessment }, assessment: Assessment) => {
    accum[assessment.id] = assessment
    return accum
  }, {})
  return assessments
}

transforms.cartTree = (gridSelection:any, treeStructure:any, sections:any, subSectionList:any, variables:{ [key: number]: Variable }): CartSection[] => {
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

export default transforms
