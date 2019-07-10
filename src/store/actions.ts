// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { tryAction, toCart, fromCart } from './helpers'
import { Variable } from '@/types/Variable'
import Assessment from '@/types/Assessment'
import { Section } from '@/types/Section.ts'
import { Cart } from '@/types/Cart'
import ApplicationState from '@/types/ApplicationState'
import router from '@/router'

export default {
  loadSections: tryAction(async ({ commit, state } : any) => {
    if (!Object.keys(state.sections).length) {
      const response = await api.get('/api/v2/lifelines_section?num=10000')
      commit('updateSections', response.items.reduce((sections: { [key:number]: Section }, item:any) => {
        sections[item.id] = item
        return sections
      }, {}))
    }
  }),
  loadSubSections: tryAction(async ({ commit, state } : any) => {
    if (state.subSectionList.length === 0) {
      const response = await api.get('/api/v2/lifelines_sub_section?num=10000')
      let subSections:String[] = []
      response.items.map((item:any) => { subSections[item.id] = item.name })
      commit('updateSubSections', subSections)
    }
  }),
  loadSectionTree: tryAction(async ({ commit, state } : any) => {
    if (state.treeStructure.length === 0) {
      const response = await api.get('/api/v2/lifelines_tree?num=10000')
      let structure: any = {}
      response.items.map((item: any) => {
        if (item.section_id.id in structure) {
          structure[item.section_id.id].push(item.subsection_id.id)
        } else {
          structure[item.section_id.id] = [item.subsection_id.id]
        }
      })
      let treeStructure: Array<Object> = []
      for (let [key, value] of Object.entries(structure)) {
        treeStructure.push({ key: key, list: value })
      }
      commit('updateSectionTree', treeStructure)
    }
  }),
  loadAssessments: tryAction(async ({ commit }: any) => {
    const response = await api.get('/api/v2/lifelines_assessment')
    commit('updateAssessments', response.items.reduce((accum: { [key:number]: Assessment }, assessment: Assessment) => {
      accum[assessment.id] = assessment
      return accum
    }, {}))
  }),
  loadVariables: tryAction(async ({ state, commit } : any) => {
    const [response0, response1] = await Promise.all([
      api.get('/api/v2/lifelines_variable?attrs=id,name,label&num=10000&sort=id'),
      api.get('/api/v2/lifelines_variable?attrs=id,name,label&num=10000&start=10000&sort=id')
    ])
    const variables: Variable[] = [...response0.items, ...response1.items]
    const variableMap: {[key:number]: Variable} =
      variables.reduce((soFar: {[key:number]: Variable}, variable: Variable) => {
        soFar[variable.id] = variable
        return soFar
      }, {})
    commit('updateVariables', variableMap)
  }),
  loadGridVariables: tryAction(async ({ state, commit } : any) => {
    commit('updateGridVariables', [])
    const subsectionId = state.treeSelected
    const response = await api.get(`/api/v2/lifelines_subsection_variable?q=subsection_id==${subsectionId}&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id))&num=10000&sort=variable_id`)
    if (state.treeSelected === subsectionId) {
      commit('updateGridVariables', response.items
      // map assessment_id to assessmentId somewhere deep in the structure
        .map((sv: any) => ({
          ...sv.variable_id,
          variants: sv.variable_id.variants
            .map((variant: any) => ({
              ...variant,
              assessmentId: variant.assessment_id
            }))
        })))
    }
  }),
  loadGridData: tryAction(async ({ commit, getters }: any) => {
    commit('updateVariantCounts', [])
    let url = '/api/v2/lifelines_who_when?aggs=x==variant_id'
    const rsql = getters.rsql
    if (rsql) {
      url = `${url}&q=${encodeURIComponent(rsql)}`
    }
    const { aggs: { matrix, xLabels } } = await api.get(url)
    if (getters.rsql === rsql) {
      const variantCounts = matrix.map((cell: any, index: number) => ({
        variantId: parseInt(xLabels[index].id),
        count: cell[0]
      }))
      commit('updateVariantCounts', variantCounts)
    }
  }),
  save: tryAction(async ({ state, commit }: {state: ApplicationState, commit: any}) => {
    const body = { contents: JSON.stringify(toCart(state)) }
    const response = await api.post('/api/v1/lifelines_cart', { body: JSON.stringify(body) })
    const location: string = response.headers.get('Location')
    const id: string = location.substring(location.lastIndexOf('/') + 1)
    commit('setToast', { type: 'success', message: 'Saved order with id ' + id })
    router.push({ name: 'load', params: { cartId: id } })
  }),
  load: tryAction(async ({ state, commit }: {state: ApplicationState, commit: any}, id: string) => {
    const response = await api.get(`/api/v2/lifelines_cart/${id}`)
    const cart: Cart = JSON.parse(response.contents)
    const { facetFilter, gridSelection } = fromCart(cart, state)
    commit('updateFacetFilter', facetFilter)
    commit('updateGridSelection', gridSelection)
    commit('setToast', { type: 'success', message: 'Loaded order with id ' + id })
  })
}
