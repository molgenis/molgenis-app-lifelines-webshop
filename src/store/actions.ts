// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { tryAction, toCart, fromCart } from './helpers'
import { Variable } from '@/types/Variable'
import Assessment from '@/types/Assessment'
import { Section } from '@/types/Section.ts'
import { Cart } from '@/types/Cart'
import ApplicationState from '@/types/ApplicationState'
import Getters from '@/types/Getters'
import { buildFormData, generateOrderNumber } from '@/services/orderService.ts'
import FormField from '@/types/FormField'
import { OrderState } from '@/types/Order'
import moment from 'moment'
import { TreeParent } from '@/types/Tree'
import axios from 'axios'
import { setPermission } from '@/services/permissionService'
import orders from 'tests/unit/fixtures/orders'

const buildPostOptions = (formData: any, formFields: FormField[]) => {
  return {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: buildFormData(formData, formFields),
    method: 'POST',
    credentials: 'same-origin'
  }
}

const createOrder = async (formData: any, formFields: FormField[]) => {
  // Generate 'unique' order number
  formData.orderNumber = generateOrderNumber()
  formFields.push({ id: 'orderNumber', type: 'text' })

  const options = buildPostOptions(formData, formFields)

  let reTryCount = 0

  const trySubmission = () => {
    const orderNumber = generateOrderNumber().toString()
    options.body.set('orderNumber', orderNumber)
    return api.post('/api/v1/lifelines_order', options, true).then(() => {
      return orderNumber
    }, (error: any) => {
      // OrderNumber must be unique, just guess untill we find one
      if (reTryCount < 10) {
        reTryCount++
        return trySubmission()
      } else {
        return Promise.reject(error)
      }
    })
  }

  return trySubmission()
}

const updateOrder = async (formData: any, formFields: FormField[]) => {
  if (formData.applicationForm && (typeof formData.applicationForm.filename === 'string')) {
    formData.applicationForm = formData.applicationForm.filename
  }
  const options = buildPostOptions(formData, formFields)

  return api.post(`/api/v1/lifelines_order/${formData.orderNumber}?_method=PUT`, options, true).then(() => {
    return formData.orderNumber
  })
}

export default {
  loadOrders: tryAction(async ({ commit }: any) => {
    commit('setOrders', null)
    const response = await api.get('/api/v2/lifelines_order?num=10000')
    commit('setOrders', response.items)
  }),
  deleteOrder: tryAction(async ({ dispatch, commit }: any, orderId: string) => {
    commit('setOrders', null)
    await api.delete_(`/api/v2/lifelines_order/${orderId}`)
    commit('setToast', { type: 'success', message: `Deleted order with order number ${orderId}` })
    dispatch('loadOrders')
  }),
  loadSections: tryAction(async ({ commit, state }: any) => {
    if (!Object.keys(state.sections).length) {
      const response = await api.get('/api/v2/lifelines_section?num=10000')
      commit('updateSections'
        , response.items.reduce((sections: { [key: number]: Section }, item: any) => {
          sections[item.id] = item
          return sections
        }, {}))
    }
  }),
  loadSubSections: tryAction(async ({ commit, state }: any) => {
    if (state.subSectionList.length === 0) {
      const response = await api.get('/api/v2/lifelines_sub_section?num=10000')
      let subSections: string[] = []
      response.items.map((item: any) => { subSections[item.id] = item.name })
      commit('updateSubSections', subSections)
    }
  }),
  loadSectionTree: tryAction(async ({ commit, state }: any) => {
    if (state.treeStructure.length === 0) {
      const response = await api.get('/api/v2/lifelines_tree?num=10000')
      let structure: { [id: number]: number[] } = {}
      response.items.map((item: any) => {
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
      commit('updateSectionTree', treeStructure)
    }
  }),
  loadAssessments: tryAction(async ({ commit }: any) => {
    const response = await api.get('/api/v2/lifelines_assessment')
    commit('updateAssessments', response.items.reduce((accum: { [key: number]: Assessment }, assessment: Assessment) => {
      accum[assessment.id] = assessment
      return accum
    }, {}))
  }),
  loadVariables: tryAction(async ({ state, commit }: any) => {
    const [response0, response1] = await Promise.all([
      api.get('/api/v2/lifelines_variable?attrs=id,name,label,subsections&num=10000&sort=id'),
      api.get('/api/v2/lifelines_variable?attrs=id,name,label,subsections&num=10000&start=10000&sort=id')
    ])
    const variables = [...response0.items, ...response1.items]

    const variableMap: { [key: number]: Variable } =
      variables.reduce((soFar: { [key: number]: Variable }, variable) => {
        if (!variable.subsections) {
          variable.subsections = []
        } else {
          variable.subsections = variable.subsections.split(',').map((i:string) => parseInt(i, 10))
        }
        soFar[variable.id] = variable
        return soFar
      }, {})

    commit('updateVariables', variableMap)
  }),
  loadGridVariables: tryAction(async ({ state, commit, getters }: { state: ApplicationState, commit: any, getters: Getters }) => {
    commit('updateGridVariables', null)
    const subsectionId = state.treeSelected
    const searchTermQuery = getters.searchTermQuery
    let q = `subsection_id==${subsectionId}`
    if (searchTermQuery !== null) {
      q = `${q};${searchTermQuery}`
    }
    const response = await api.get(`/api/v2/lifelines_subsection_variable?q=${encodeURIComponent(q)}&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id),definition_en,definition_nl,options(label_en))&num=10000&sort=variable_id`)
    if ((state.treeSelected === subsectionId) && (searchTermQuery === getters.searchTermQuery)) {
      commit('updateGridVariables', response.items
        // map assessment_id to assessmentId somewhere deep in the structure
        .map((sv: any) => ({
          ...sv.variable_id,
          variants: sv.variable_id.variants
            .map((variant: any) => ({
              ...variant,
              assessmentId: variant.assessment_id
            })),
          options: sv.variable_id.options.map((option: any) => ({
            label_en: option['label_en']
          }))
        })))
    }
  }),
  loadParticipantCount: tryAction(async ({ commit, getters }: any) => {
    commit('updateParticipantCount', null)
    let url = '/api/v2/lifelines_who?num=0'
    const rsql = getters.rsql
    if (rsql) {
      url = `${url}&q=${encodeURIComponent(rsql.replace(/ll_nr\./g, ''))}`
    }
    const response = await api.get(url)
    if (getters.rsql === rsql) {
      commit('updateParticipantCount', response.total)
    }
  }),
  loadGridData: tryAction(async ({ commit, getters }: any) => {
    commit('updateVariantCounts', null)
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
  save: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }) => {
    const formFields = [...state.orderFormFields, { id: 'contents', type: 'text' }]

    const { context: { email, username } } = state.context

    const formData = {
      ...state.order,
      contents: JSON.stringify(toCart(state)),
      updateDate: moment().toISOString(),
      email,
      user: username
    }

    if (state.order.orderNumber) {
      await updateOrder(formData, formFields)
      commit('setToast', { type: 'success', message: 'Saved order with order number ' + state.order.orderNumber })
      return state.order.orderNumber
    } else {
      const creationDateField = { id: 'creationDate', type: 'date' }
      const orderNumber = await createOrder(formData, [...formFields, creationDateField]).catch(() => {
        return Promise.reject(new Error('Failed to create order'))
      })
      const newOrderResponse = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
      commit('restoreOrderState', newOrderResponse)
      commit('setToast', { type: 'success', message: 'Saved order with order number ' + orderNumber })
      return orderNumber
    }
  }),
  submit: tryAction(async ({ state, commit, dispatch }: { state: ApplicationState, commit: any, dispatch: any }) => {
    const formFields = [...state.orderFormFields, { id: 'contents', type: 'text' }]

    const { context: { email, username } } = state.context

    const now = moment().toISOString()
    const formData = {
      ...state.order,
      contents: JSON.stringify(toCart(state)),
      updateDate: now,
      submissionDate: now,
      email,
      user: username
    }
    // ts enums are numbers, the backends expects strings
    // @ts-ignore
    formData.state = OrderState[OrderState.Submitted]
    let orderNumber = state.order.orderNumber

    if (orderNumber) {
      await updateOrder(formData, formFields)
    } else {
      orderNumber = await createOrder(formData, formFields).catch(() => {
        return Promise.reject(new Error('Failed to submit order'))
      })
    }
    const newOrderResponse = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
    commit('restoreOrderState', newOrderResponse)
    dispatch('givePermissionToOrder')
    dispatch('sendSubmissionTrigger')
    commit('setToast', { type: 'success', message: 'Submitted order with order number ' + orderNumber })
  }),
  load: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }, orderNumber: string) => {
    const response = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
    const cart: Cart = JSON.parse(response.contents)
    const { facetFilter, gridSelection } = fromCart(cart, state)
    commit('restoreOrderState', response)
    commit('updateFacetFilter', facetFilter)
    commit('updateGridSelection', gridSelection)
    commit('setToast', { type: 'success', message: 'Loaded order with orderNumber ' + orderNumber })
  }),
  givePermissionToOrder: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }) => {
    if (state.order.orderNumber === null) {
      throw new Error('Can not set permission if orderNumber is not set')
    }

    setPermission(state.order.orderNumber, 'lifelines_order', 'LIFELINES_MANAGER', 'WRITE')

    if (state.order.applicationForm && state.order.applicationForm.id) {
      setPermission(state.order.applicationForm.id, 'sys_FileMeta', 'LIFELINES_MANAGER', 'WRITE')
    }
  }),
  sendSubmissionTrigger: async () => {
    return axios.post('/edge-server/trigger?type=submit').catch((err: any) => {
      console.log('Send submit trigger failed')
      console.log(err)
    })
  },
  sendApproveTrigger: tryAction(async ({ state }: { state: ApplicationState }, orderNumber: string) => {
    return axios.post(`/edge-server/trigger?type=approve&ordernumber=${orderNumber}`)
  })
}
