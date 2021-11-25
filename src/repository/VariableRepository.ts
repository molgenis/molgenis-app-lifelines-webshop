// @ts-ignore
import { encodeRsqlValue } from '@molgenis/rsql'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { VariableWithVariants } from '@/types/Variable'

/**
 * Combine tree (variable with subvariables) into list of variables and subvariables
 */
const flattenResponseItem = (accum: any[], current: any) => {
  accum.push(current)
  if (current.subvariables) {
    current.subvariables.forEach((subvariable:any) => {
      accum.push(subvariable)
    })
  }
  return accum
}

/**
 * Takes a list of VariableWithVariants possibly containing duplicates and returns the set
 * VariableWithVariants <a,b> are considered equal if and only if a.id = b.id
 */
const removeDuplicates = (variables: VariableWithVariants[]): VariableWithVariants[] => {
  const variableMap = variables.reduce((accum:Record<number, VariableWithVariants>, variable:VariableWithVariants) => {
    accum[variable.id] = variable
    return accum
  }, {})

  return Object.values(variableMap)
}

export const fetchVariables = async (searchTermQuery: string, treeSelected: number) => {
  let variables:VariableWithVariants[]
  const subvariableAttrs = 'id,name,label,subvariable_of,definition_en,definition_nl,options(label_en,code),variants(id,assessment_id)'

  if (treeSelected >= 0) {
    // we need to have specific subsection: query in subsection table
    const attrs = `~id,id,subsection_id,variable_id(id,name,label,subvariable_of,subvariables(${subvariableAttrs}),variants(id,assessment_id),definition_en,definition_nl,options(label_en,code))`
    const response = await api.get(`/api/v2/lifelines_subsection_variable?q=${encodeRsqlValue(searchTermQuery)}&attrs=${attrs}&num=10000&sort=variable_id`)
    variables = response.items
      .map((subVariable: any) => subVariable.variable_id)
      .reduce(flattenResponseItem, [])
      .map(toVariable)
  } else {
    // query variable table
    const attrs = `id,name,label,subvariable_of,subvariables(${subvariableAttrs}),variants(id,assessment_id),definition_en,definition_nl,options(label_en,code)`
    const response = await api.get(`/api/v2/lifelines_variable?q=${encodeRsqlValue(searchTermQuery)}&attrs=${attrs}&num=10000&sort=id`)
    variables = response.items
      .reduce(flattenResponseItem, [])
      .map(toVariable)
  }
  return removeDuplicates(variables)
}

export const toVariable = (response: any):VariableWithVariants => {
  return {
    id: response.id,
    label: response.label ? response.label : '',
    name: response.name ? response.name : '',
    subsections: response.subsections,
    variants: response.variants ? response.variants.map((variant: any) => ({
      id: variant.id,
      assessmentId: variant.assessment_id
    })) : [],
    options: response.options ? response.options.map((option: any) => ({
      label_en: option.label_en,
      code: option.code
    })) : [],
    subvariableOf: response.subvariable_of ? response.subvariable_of : null,
    subvariables: response.subvariables || [],
    definitionEn: response.definition_en ? response.definition_en : '',
    definitionNl: response.definition_nl ? response.definition_nl : ''
  }
}
