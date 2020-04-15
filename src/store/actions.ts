// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { successMessage, tryAction, toCart, fromCart } from './helpers'
import { Cart } from '@/types/Cart'
import ApplicationState from '@/types/ApplicationState'
import Getters from '@/types/Getters'
import { buildFormData, generateOrderNumber, buildOrdersQuery } from '@/services/orderService.ts'
import FormField from '@/types/FormField'
import { OrderState } from '@/types/Order'
import moment from 'moment'
import axios from 'axios'
import { setRolePermission, setUserPermission } from '@/services/permissionService'
import transforms from './transforms'
import { finalVariableSetSort } from '@/services/variableSetOrderService'
import { QueryParams } from '@/types/QueryParams'
import { fetchVariables } from '@/repository/VariableRepository'

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

const cartToBlob = (cart: Cart) => {
  const cartDataString = JSON.stringify(cart)
  const blob = new Blob([cartDataString], { type: 'application/json' })
  // @ts-ignore just add name to blob so molgenis knows its a json file
  blob.name = 'cart.json'
  return blob
}

const createOrder = async (formData: any, formFields: FormField[]) => {
  formFields.push({ id: 'orderNumber', type: 'text' })

  const trySubmission = (reTryCount:number) => {
    var orderNr = generateOrderNumber()
    formData.orderNumber = orderNr
    const options = buildPostOptions(formData, formFields)
    return api.post('/api/v1/lifelines_order', options, true).then(() => {
      return orderNr
    }, (error: any) => {
      // OrderNumber must be unique, just guess until we find one
      if (reTryCount > 0) {
        return trySubmission(--reTryCount)
      } else {
        return Promise.reject(error)
      }
    })
  }
  return trySubmission(10)
}

const loadOrder = async ({ state, commit }: { state: ApplicationState, commit: any }, orderNumber: string) => {
  const response = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
  commit('restoreOrderState', response)
  return response
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

const getApplicationForm = async (applicationFormId: string, filename: string) => {
  const applicationForm = await api.get(`/files/${applicationFormId}`)
  const applicationFormBlob = await applicationForm.blob()
  // @ts-ignore just add name
  applicationFormBlob.name = filename
  return applicationFormBlob
}

export default {
  loadOrders: tryAction(async ({ commit }: any, query:QueryParams) => {
    const queryParams = buildOrdersQuery(query)
    const response = await api.get(`/api/v2/lifelines_order${queryParams}`)
    commit('setOrders', response)
  }),
  deleteOrder: tryAction(async ({ dispatch, commit }: any, orderNumber: string) => {
    await api.delete_(`/api/v2/lifelines_order/${orderNumber}`)
    commit('deleteOrder', orderNumber)
    successMessage(`Deleted order with order number ${orderNumber}`, commit)
  }),
  loadSections: tryAction(async ({ commit, state }: any) => {
    if (!Object.keys(state.sections).length) {
      const response = await api.get('/api/v2/lifelines_section?num=10000')
      commit('updateSections', transforms.sections(response.items))
    }
  }),
  loadSubSections: tryAction(async ({ commit, state }: any) => {
    if (state.subSectionList.length === 0) {
      const response = await api.get('/api/v2/lifelines_sub_section?num=10000')
      const subSections = transforms.subSectionList(response.items)
      commit('updateSubSections', subSections)
    }
  }),
  loadSectionTree: tryAction(async ({ commit, state }: any) => {
    if (state.treeStructure.length === 0) {
      const response = await api.get('/api/v2/lifelines_tree?num=10000')
      const sectionTree = transforms.sectionTree(response.items)
      commit('updateSectionTree', sectionTree)
    }
  }),
  loadAssessments: tryAction(async ({ commit }: any) => {
    const response = await api.get('/api/v2/lifelines_assessment')
    const assessments = transforms.assessments(response.items)
    commit('updateAssessments', assessments)
    // All assessment filters are selected by default.
    commit('assessmentsActive', Object.values(assessments).map((i:any) => i.id))
  }),
  loadVariables: tryAction(async ({ state, commit }: any) => {
    const [response0, response1] = await Promise.all([
      api.get('/api/v2/lifelines_variable?attrs=id,name,subvariable_of,label,subsections&num=10000&sort=id'),
      api.get('/api/v2/lifelines_variable?attrs=id,name,subvariable_of,label,subsections&num=10000&start=10000&sort=id')
    ])

    const variables = transforms.variables([...response0.items, ...response1.items])
    commit('updateVariables', variables)
  }),
  loadGridVariables: tryAction(async ({ state, commit, getters }: { state: ApplicationState, commit: any, getters: Getters }) => {
    commit('updateGridVariables', null)
    const searchTermQuery = getters.searchTermQuery

    if (!searchTermQuery) {
      return
    }

    const variables = await fetchVariables(searchTermQuery, state.treeSelected)
    if (searchTermQuery === getters.searchTermQuery) {
      const sortedGridVariables = finalVariableSetSort(variables)
      commit('updateGridVariables', sortedGridVariables)
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
  save: tryAction(async ({ state, commit, dispatch }: { state: ApplicationState, commit: any, dispatch: any }) => {
    const formFields = [...state.orderFormFields, { id: 'contents', type: 'file' }]
    const { context } = state.context
    const cart = toCart(state)

    const formData:any = {
      name: state.order.name,
      orderNumber: state.order.orderNumber,
      projectNumber: state.order.projectNumber,
      applicationForm: state.order.applicationForm,
      updateDate: moment().toISOString(),
      contents: cartToBlob(cart),
      creationDate: state.order.creationDate,
      submissionDate: state.order.submissionDate,
      state: state.order.state
    }

    if (state.order.orderNumber) {
      formData.user = state.order.user
      formData.email = state.order.email

      await updateOrder(formData, formFields)

      // Assume admin edits the user's order.
      if (context.username !== state.order.user) {
        const newOrderResponse = await api.get(`/api/v2/lifelines_order/${state.order.orderNumber}`)
        commit('restoreOrderState', newOrderResponse)
        await dispatch('fixUserPermission')
      }

      successMessage(`Saved order with order number ${state.order.orderNumber}`, commit)

      return state.order.orderNumber
    } else {
      formData.user = context.username
      formData.email = context.email

      const creationDateField = { id: 'creationDate', type: 'date' }
      const orderNumber = await createOrder(formData, [...formFields, creationDateField]).catch(() => {
        return Promise.reject(new Error('Failed to create order'))
      })
      const newOrderResponse = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
      commit('restoreOrderState', newOrderResponse)
      successMessage(`Saved order with order number ${orderNumber}`, commit)
      return orderNumber
    }
  }),
  submit: tryAction(async ({ state, commit, dispatch }: { state: ApplicationState, commit: any, dispatch: any }) => {
    const formFields = [...state.orderFormFields, { id: 'contents', type: 'file' }]
    const { context: { email, username } } = state.context
    const now = moment().toISOString()
    const cart = toCart(state)
    const contents = cartToBlob(cart)

    const formData = {
      ...state.order,
      updateDate: now,
      submissionDate: now,
      email,
      user: username,
      contents
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
    successMessage(`Submitted order with order number ${orderNumber}`, commit)
  }),
  load: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }, orderNumber: string) => {
    const response = await loadOrder({ state, commit }, orderNumber)
    const cart: Cart = await api.get(`/files/${response.contents.id}`)
    const { facetFilter, gridSelection } = fromCart(cart, state)
    commit('updateFacetFilter', facetFilter)
    commit('updateGridSelection', gridSelection)
    successMessage(`Loaded order with orderNumber ${orderNumber}`, commit)
  }),
  loadOrder: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }, orderNumber: string) => {
    return loadOrder({ state, commit }, orderNumber)
  }),
  copyOrder: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }, sourceOrderNumber: string) => {
    // Fetch source data
    const response = await api.get(`/api/v2/lifelines_order/${sourceOrderNumber}`)
    const cart: Cart = await api.get(`/files/${response.contents.id}`)

    // Create copy
    const formData = {
      name: response.name ? `${response.name} (copy)` : `copied (from: ${sourceOrderNumber})`,
      projectNumber: response.projectNumber,
      applicationForm: response.applicationForm,
      submissionDate: null,
      creationDate: null,
      updateDate: null,
      state: OrderState.Draft,
      email: response.email,
      user: response.user,
      contents: cartToBlob(cart)
    }

    if (response.applicationForm) {
      formData.applicationForm = await getApplicationForm(response.applicationForm.id, response.applicationForm.filename)
    }

    const formFields = [...state.orderFormFields, { id: 'contents', type: 'file' }]
    const orderNumber = await createOrder(formData, [...formFields, { id: 'creationDate', type: 'date' }]).catch((e) => {
      return Promise.reject(new Error('Failed to copy order'))
    })

    // If admin copies the user's order, user needs to be given permission to the copy
    if (state.context.context.username !== response.user) {
      const copyOrderResponse = await api.get(`/api/v2/lifelines_order/${orderNumber}`)
      commit('restoreOrderState', copyOrderResponse)
      const setPermissionRequests = [
        setUserPermission(orderNumber, 'lifelines_order', copyOrderResponse.user, 'WRITE'),
        setUserPermission(copyOrderResponse.contents.id, 'sys_FileMeta', copyOrderResponse.user, 'WRITE')
      ]
      if (copyOrderResponse.applicationForm) {
        setPermissionRequests.push(setUserPermission(copyOrderResponse.applicationForm.id, 'sys_FileMeta', copyOrderResponse.user, 'WRITE'))
      }
      await Promise.all(setPermissionRequests)
    }

    return orderNumber
  }),
  givePermissionToOrder: tryAction(async ({ state, commit }: { state: ApplicationState, commit: any }) => {
    if (state.order.orderNumber === null || state.order.contents === null) {
      throw new Error('Can not set permission if orderNumber is not set')
    }
    const setPermissionRequests = [
      setRolePermission(state.order.orderNumber, 'lifelines_order', 'lifelines_MANAGER', 'WRITE'),
      setRolePermission(state.order.contents.id, 'sys_FileMeta', 'lifelines_MANAGER', 'WRITE')
    ]
    if (state.order.applicationForm && state.order.applicationForm.id) {
      setPermissionRequests.push(
        setRolePermission(state.order.applicationForm.id, 'sys_FileMeta', 'lifelines_MANAGER', 'WRITE')
      )
    }
    Promise.all(setPermissionRequests)
  }),
  fixUserPermission: tryAction(async ({ state }: { state: ApplicationState }) => {
    if (state.order.orderNumber === null || state.order.contents === null || state.order.user === null) {
      throw new Error('Can not set permission if orderNumber or contents or user is not set')
    }
    // @ts-ignore
    const results = [
      setUserPermission(state.order.contents.id, 'sys_FileMeta', state.order.user, 'WRITE')
    ]

    if (state.order.applicationForm) {
      results.push(setUserPermission(state.order.applicationForm.id, 'sys_FileMeta', state.order.user, 'WRITE'))
    }

    await Promise.all(results)
  }),

  sendApproveTrigger: tryAction(async ({ state }: { state: ApplicationState }, orderNumber: string) => {
    return axios.post(`/edge-server/approve?ordernumber=${orderNumber}`)
  })
}
