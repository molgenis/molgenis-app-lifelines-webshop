// @ts-ignore
import api from '@molgenis/molgenis-api-client'

export default {
  async loadSections  ({ commit } : any) {
    const response = await api.get('/api/v2/lifelines_section?num=10000')
    let sections:String[] = []
    response.items.map((item:any) => { sections[item.id] = item.name })
    commit('updateSections', sections)
  },
  async loadSubSections  ({ commit } : any) {
    const response = await api.get('/api/v2/lifelines_sub_section?num=10000')
    let subSections:String[] = []
    response.items.map((item:any) => { subSections[item.id] = item.name })
    commit('updateSubSections', subSections)
  },
  async loadSectionTree  ({ commit } : any) {
    const response = await api.get('/api/v2/lifelines_tree?num=10000')
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
    commit('updateSectionTree', treeStructure)
  },

  async loadAssessments ({ commit }: any) {
    const response = await api.get('/api/v2/lifelines_assessment')
    commit('updateAssessments', response.items)
  },
  async loadVariables ({ state, commit } : any) {
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
  },
  async loadGridData ({ commit, getters }: any) {
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
  }
}
