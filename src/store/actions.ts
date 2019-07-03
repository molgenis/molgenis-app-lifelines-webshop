// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { tryAction } from './helpers'
import GridSelection from '@/types/GridSelection'

export default {
  loadTreeStructure: tryAction(({ commit } : any) => {
    // Show simple initial tree (only the parents)
    const sections = api.get('/api/v2/lifelines_section?num=100').then((response: any) => {
      let sections:String[][] = []
      response.items.map((item:any) => { sections[item.id] = item.name })
      commit('updateSection', sections)

      const treeStructure = response.items.map((item:any) => { return { 'name': item.name } })
      commit('updateTreeStructure', treeStructure)
      return sections
    })

    // Request details
    const subSections = api.get('/api/v2/lifelines_sub_section?num=1000').then((response: any) => {
      let subSections:String[] = []
      response.items.map((item:any) => { subSections[item.id] = item.name })
      commit('updateSection', subSections)
      return subSections
    })

    const tree = api.get('/api/v2/lifelines_tree?num=1000').then((response: any) => {
      let structure:any = {}
      response.items.map((item:any) => {
        if (item.section_id.id in structure) {
          structure[item.section_id.id].push(item.subsection_id.id)
        } else {
          structure[item.section_id.id] = [item.subsection_id.id]
        }
      })

      let treeStructure:Array<Object> = []
      for (let [key, value] of Object.entries(structure)) {
        treeStructure.push({ key: key, list: value })
      }
      return treeStructure
    })

    // Build final tree
    return Promise.all([sections, subSections, tree]).then(([sections, subSections, treeStructure]) => {
      const final = treeStructure.map((item:any) => {
        return {
          name: sections[item.key],
          children: item.list.map((id:number) => { return { name: subSections[id], id } })
        }
      })
      commit('updateTreeStructure', final)
    })
  }),
  loadAssessments: tryAction(async ({ commit }: any) => {
    const response = await api.get('/api/v2/lifelines_assessment')
    commit('updateAssessments', response.items)
  }),
  loadVariables: tryAction(async ({ state, commit } : any) => {
    commit('updateVariables', [])
    const response = await api.get(`/api/v2/lifelines_subsection_variable?q=subsection_id==${state.treeSelected}&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id))&num=10000`)
    commit('updateVariables', response.items
      // map assessment_id to assessmentId somewhere deep in the structure
      .map((sv: any) => ({
        ...sv.variable_id,
        variants: sv.variable_id.variants
          .map((variant: any) => ({
            ...variant,
            assessmentId: variant.assessment_id
          }))
      })))
  }),
  loadGridData: tryAction(async ({ commit, getters }: any) => {
    commit('updateVariantCounts', [])
    let url = '/api/v2/lifelines_who_when?aggs=x==variant_id'
    if (getters.rsql) {
      url = `${url}&q=${encodeURIComponent(getters.rsql)}`
    }
    const { aggs: { matrix, xLabels } } = await api.get(url)
    const variantCounts = matrix.map((cell: any, index: number) => ({
      variantId: parseInt(xLabels[index].id),
      count: cell[0]
    }))
    commit('updateVariantCounts', variantCounts)
  }),
  save: tryAction(async ({ state: { gridSelection } }: { state: {gridSelection: GridSelection} }) => {
    const body = { selection: JSON.stringify(gridSelection) }
    const response = await api.post('/api/v1/lifelines_cart', { body: JSON.stringify(body) })
    const location: string = response.headers.get('Location')
    const id: string = location.substring(location.lastIndexOf('/') + 1)
  }),
  load: tryAction(async ({ commit }:any, id: string) => {
    const response = await api.get(`/api/v2/lifelines_cart/${id}`)
    const gridSelection = JSON.parse(response.selection)
    commit('updateGridSelection', gridSelection)
  })
}
