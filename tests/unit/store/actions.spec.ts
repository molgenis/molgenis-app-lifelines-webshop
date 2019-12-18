import actions from '@/store/actions'
import { Cart } from '@/types/Cart'
import emptyState from '../fixtures/state'
import orders from '../fixtures/orders'

// @ts-ignore
import { post } from '@molgenis/molgenis-api-client'
import axios from 'axios'
import ApplicationState from '@/types/ApplicationState'
import { OrderState } from '@/types/Order'
import * as orderService from '@/services/orderService'

const cart: Cart = {
  selection: [{
    assessment: '1A',
    variables: ['VAR1', 'VAR2']
  }],
  filters: {
    ageGroupAt1A: ['18-65', '65+']
  }
}
const cartContents = JSON.stringify(cart)

const mockResponses: { [key: string]: Object } = {
  '/api/v2/lifelines_order?num=10000': {
    items: orders
  },
  '/api/v2/lifelines_order/fghij': {
    contents: cartContents
  },
  '/api/v2/lifelines_section?num=10000': {
    items: [
      { id: 1, name: 'section1' },
      { id: 2, name: 'section2' }
    ]
  },
  '/api/v2/lifelines_section?num=10000&q=*%3Dq%3Dhello': {
    items: [
      { id: 1, name: 'section1' }
    ]
  },
  '/api/v2/lifelines_subsection_variable?aggs=x==subsection_agg&q=*%3Dq%3Dhello': {
    aggs: {
      xLabels: [
        '1',
        '3'
      ]
    }
  },
  '/api/v2/lifelines_sub_section?num=10000': {
    items: [
      { id: 1, name: 'sub_section1' },
      { id: 2, name: 'sub_section2' }
    ]
  },
  '/api/v2/lifelines_tree?num=10000': {
    items: [
      { id: 1, section_id: { id: 1 }, subsection_id: { id: 1 } },
      { id: 2, section_id: { id: 1 }, subsection_id: { id: 2 } }
    ]
  },
  '/api/v2/lifelines_assessment': {
    items: [
      { id: 1, name: '1A' },
      { id: 2, name: '1B' }
    ]
  },
  '/api/v2/lifelines_variable?attrs=id,name,label,subsections&num=10000&sort=id': {
    items: [{
      id: 2,
      name: 'ARZON',
      label: 'Suncream used',
      subsections: '1'
    }, {
      id: 3,
      name: 'SAF',
      label: 'SAF',
      subsections: '1,2'
    }]
  },
  '/api/v2/lifelines_variable?attrs=id,name,label,subsections&num=10000&start=10000&sort=id': {
    items: [{
      id: 4,
      name: 'UVREFLECT',
      label: 'Reflection',
      subsections: '1'
    }, {
      id: 5,
      name: 'ARCREME',
      label: 'Skin cream used',
      subsections: null
    }]
  },
  '/api/v2/lifelines_subsection_variable?q=subsection_id%3D%3D4&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id),definition_en,definition_nl,options(label-en))&num=10000&sort=variable_id': {
    items: [{
      variable_id: {
        id: 2,
        name: 'ARZON',
        label: 'Suncream used',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }, {
      variable_id: {
        id: 3,
        name: 'SAF',
        label: 'SAF',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }, {
      variable_id: {
        id: 4,
        name: 'UVREFLECT',
        label: 'Reflection',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }, {
      variable_id: {
        id: 4,
        name: 'ARCREME',
        label: 'Skin cream used',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }]
  },
  '/api/v2/lifelines_subsection_variable?q=subsection_id%3D%3D4%3B*%3Dq%3Dcream&attrs=~id,id,subsection_id,variable_id(id,name,label,variants(id,assessment_id),definition_en,definition_nl,options(label-en))&num=10000&sort=variable_id': {
    items: [{
      variable_id: {
        id: 2,
        name: 'ARZON',
        label: 'Suncream used',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }, {
      variable_id: {
        id: 4,
        name: 'ARCREME',
        label: 'Skin cream used',
        variants: [{
          id: 197,
          assessment_id: 1
        }],
        options: []
      }
    }]
  },
  '/api/v2/lifelines_who?num=0': {
    total: 123456
  },
  '/api/v2/lifelines_who?num=0&q=yob%3Dle%3D1970': {
    total: 3456
  },
  '/api/v2/lifelines_who_when?aggs=x==variant_id&q=ll_nr.yob%3Dle%3D1970': {
    aggs: {
      matrix: [[1234], [5678]],
      xLabels: [{
        assessment_id: '1',
        id: '1'
      }, {
        assessment_id: '2',
        id: '10'
      }
      ]
    }
  },
  '/api/v2/lifelines_who_when?aggs=x==variant_id': {
    aggs: {
      matrix: [[12340], [56780]],
      xLabels: [{
        assessment_id: '1',
        id: '1'
      }, {
        assessment_id: '2',
        id: '10'
      }
      ]
    }
  }
}

const mockDelete = jest.fn()

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: (url: string) => Promise.resolve(mockResponses[url]),
    post: jest.fn(),
    delete_: function () { mockDelete(...arguments) }
  }
})

describe('actions', () => {
  describe('loadOrders', () => {
    it('loads the orders and commits them', async (done) => {
      const commit = jest.fn()
      const action = actions.loadOrders({ commit })
      expect(commit).toHaveBeenCalledWith('setOrders', null)
      await action
      expect(commit).toHaveBeenCalledWith('setOrders', orders)
      done()
    })
  })

  describe('deleteOrder', () => {
    it('deletes the order and loads the orders again', async (done) => {
      const commit = jest.fn()
      const dispatch = jest.fn()
      const action = actions.deleteOrder({ commit, dispatch }, 'abcde')
      expect(commit).toHaveBeenCalledWith('setOrders', null)
      await action
      expect(mockDelete).toHaveBeenCalledWith('/api/v2/lifelines_order/abcde')
      expect(dispatch).toHaveBeenCalledWith('loadOrders')
      done()
    })
  })

  describe('loadSections', () => {
    it('fetch the sections and commits them', async (done) => {
      const commit = jest.fn()
      await actions.loadSections({ state: { sections: {} }, commit })
      expect(commit).toHaveBeenCalledWith('updateSections', {
        1: { id: 1, name: 'section1' },
        2: { id: 2, name: 'section2' }
      })
      done()
    })

    it('not fetch the sections if already in state', async (done) => {
      const commit = jest.fn()
      await actions.loadSections({ state: { sections: { 1: { id: 1, name: 'section1' } } }, commit })
      expect(commit).toHaveBeenCalledTimes(0)
      done()
    })
  })

  describe('filterSections', () => {
    it('loads sections matching search term', async (done) => {
      const commit = jest.fn()
      const getters = {
        searchTermQuery: '*=q=hello'
      }
      const action = actions.filterSections({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateFilteredSections', null)
      await action
      expect(commit).toHaveBeenCalledWith('updateFilteredSections', [1])
      done()
    })

    it('does not commit if search term has changed while loading', async (done) => {
      const commit = jest.fn()
      const getters = {
        searchTermQuery: '*=q=hello'
      }
      const action = actions.filterSections({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateFilteredSections', null)
      getters.searchTermQuery = '*=q=helloes'
      await action
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })
  })

  describe('filterSubsections', () => {
    it('loads subsections matching search term', async (done) => {
      const commit = jest.fn()
      const getters = {
        searchTermQuery: '*=q=hello'
      }
      const action = actions.filterSubsections({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateFilteredSubsections', null)
      await action
      expect(commit).toHaveBeenCalledWith('updateFilteredSubsections', [1, 3])
      done()
    })

    it('clears filtered subsections if search term is null', async (done) => {
      const commit = jest.fn()
      const getters = {
        searchTermQuery: null
      }
      await actions.filterSubsections({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateFilteredSubsections', null)
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })
  })

  describe('loadSubSections', () => {
    it('fetch the sub sections and commits them as a string list', async (done) => {
      const commit = jest.fn()
      await actions.loadSubSections({ state: { subSectionList: [] }, commit })
      expect(commit).toHaveBeenCalledWith('updateSubSections', [
        undefined, // todo refactor action to remove this undefined item
        'sub_section1',
        'sub_section2'
      ])
      done()
    })

    it('not fetch the sub sections if already in state', async (done) => {
      const commit = jest.fn()
      await actions.loadSubSections({ state: { subSectionList: ['sub_section1'] }, commit })
      expect(commit).toHaveBeenCalledTimes(0)
      done()
    })
  })

  describe('loadSectionTree', () => {
    it('fetches the sections in tree form', async (done) => {
      const commit = jest.fn()
      await actions.loadSectionTree({ state: { treeStructure: [] }, commit })
      expect(commit).toHaveBeenCalledWith('updateSectionTree', [{ 'key': '1', 'list': [1, 2] }])
      done()
    })
    it('wont fetch if data is loaded already', async (done) => {
      const commit = jest.fn()
      await actions.loadSectionTree({ state: { treeStructure: [0, 1] }, commit })
      expect(commit).toHaveBeenCalledTimes(0)
      done()
    })
  })

  describe('loadAssessments', () => {
    it('loads the assessments and commits them', async (done) => {
      const commit = jest.fn()
      await actions.loadAssessments({ commit })
      expect(commit).toHaveBeenCalledWith('updateAssessments', {
        1: { id: 1, name: '1A' },
        2: { id: 2, name: '1B' }
      })
      done()
    })
  })

  describe('loadGridVariables', () => {
    it('loads variables for selected subsection', async (done) => {
      const commit = jest.fn()
      const action = actions.loadGridVariables({
        state: { treeSelected: 4 },
        getters: { searchTermQuery: null },
        commit
      })
      expect(commit).toHaveBeenCalledWith('updateGridVariables', null)
      await action

      const variant = { 'assessmentId': 1, 'assessment_id': 1, 'id': 197 }
      expect(commit).toHaveBeenCalledWith('updateGridVariables', [
        { 'id': 2, 'label': 'Suncream used', 'name': 'ARZON', 'variants': [variant], options: [] },
        { 'id': 3, 'label': 'SAF', 'name': 'SAF', 'variants': [variant], options: [] },
        { 'id': 4, 'label': 'Reflection', 'name': 'UVREFLECT', 'variants': [variant], options: [] },
        { 'id': 4, 'label': 'Skin cream used', 'name': 'ARCREME', 'variants': [variant], options: [] }
      ])
      done()
    })
    it('adds searchTermQuery to query if it is present', async (done) => {
      const commit = jest.fn()
      const action = actions.loadGridVariables({
        state: { treeSelected: 4 },
        getters: { searchTermQuery: '*=q=cream' },
        commit
      })
      expect(commit).toHaveBeenCalledWith('updateGridVariables', null)
      await action
      const variant = { 'assessmentId': 1, 'assessment_id': 1, 'id': 197 }
      expect(commit).toHaveBeenCalledWith('updateGridVariables', [
        { 'id': 2, 'label': 'Suncream used', 'name': 'ARZON', 'variants': [variant], options: [] },
        { 'id': 4, 'label': 'Skin cream used', 'name': 'ARCREME', 'variants': [variant], options: [] }
      ])
      done()
    })
    it('does not commit the grid variables if the tree selection changes during the call', async (done) => {
      const commit = jest.fn()
      const state = { treeSelected: 4 }
      const getters = { searchTermQuery: null }
      const action = actions.loadGridVariables({ state, commit, getters })
      expect(commit).toHaveBeenCalledWith('updateGridVariables', null)
      state.treeSelected = 6
      await action
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })

    it('does not commit the grid variables if the search term query during the call', async (done) => {
      const commit = jest.fn()
      const state = { treeSelected: 4 }
      const getters: any = { searchTermQuery: null }
      const action = actions.loadGridVariables({ state, commit, getters })
      expect(commit).toHaveBeenCalledWith('updateGridVariables', null)
      getters.searchTermQuery = '*=q=test'
      await action
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })
  })

  describe('loadVariables', () => {
    it('loads all variables', async (done) => {
      const commit = jest.fn()
      const action = actions.loadVariables({ commit })
      await action
      expect(commit).toHaveBeenCalledWith('updateVariables', {
        2: { 'id': 2, 'label': 'Suncream used', 'name': 'ARZON', subsections: [1] },
        3: { 'id': 3, 'label': 'SAF', 'name': 'SAF', subsections: [1, 2] },
        4: { 'id': 4, 'label': 'Reflection', 'name': 'UVREFLECT', subsections: [1] },
        5: { 'id': 5, 'label': 'Skin cream used', 'name': 'ARCREME', subsections: [] }
      })
      done()
    })
  })

  describe('loadParticipantCount', () => {
    it('loads new participant count if rsql is empty', async (done) => {
      const commit = jest.fn()
      const response = actions.loadParticipantCount({ commit, getters: { rsql: '' } })
      expect(commit).toHaveBeenCalledWith('updateParticipantCount', null)
      await response
      expect(commit).toHaveBeenCalledWith('updateParticipantCount', 123456)
      done()
    })
    it('loads new participant count if rsql is nonempty', async (done) => {
      const commit = jest.fn()
      const response = actions.loadParticipantCount({ commit, getters: { rsql: 'll_nr.yob=le=1970' } })
      expect(commit).toHaveBeenCalledWith('updateParticipantCount', null)
      await response
      expect(commit).toHaveBeenCalledWith('updateParticipantCount', 3456)
      done()
    })
    it('does not commit the participant count if the rsql has been updated while loading', async (done) => {
      const commit = jest.fn()
      const getters = { rsql: 'll_nr.yob=le=1970' }
      const response = actions.loadParticipantCount({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateParticipantCount', null)
      getters.rsql = 'll_nr.yob=le=1971'
      await response
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })
  })

  describe('loadGridData', () => {
    it('loads new variant counts if rsql is empty', async (done) => {
      const commit = jest.fn()
      const response = actions.loadGridData({ commit, getters: { rsql: '' } })
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', null)
      await response
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [
        { 'count': 12340, 'variantId': 1 },
        { 'count': 56780, 'variantId': 10 }
      ])
      done()
    })

    it('loads new variant counts if rsql is nonempty', async (done) => {
      const commit = jest.fn()
      await actions.loadGridData({ commit, getters: { rsql: 'll_nr.yob=le=1970' } })
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', null)
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', [
        { 'count': 1234, 'variantId': 1 },
        { 'count': 5678, 'variantId': 10 }
      ])
      done()
    })

    it('does not commit the variant counts if the rsql has changed during the call', async (done) => {
      const commit = jest.fn()
      const getters = { rsql: 'll_nr.yob=le=1970' }
      const action = actions.loadGridData({ commit, getters })
      expect(commit).toHaveBeenCalledWith('updateVariantCounts', null)
      getters.rsql = ''
      await action
      expect(commit).toHaveBeenCalledTimes(1)
      done()
    })
  })

  describe('load', () => {
    it('loads grid selection', async (done) => {
      const commit = jest.fn()
      const state: ApplicationState = {
        ...emptyState,
        assessments: { 1: { id: 1, name: '1A' } },
        variables: {
          1: { id: 1, name: 'VAR1', label: 'Variable 1', subsections: [1, 2] },
          2: { id: 2, name: 'VAR2', label: 'Variable 2', subsections: [2] } }
      }
      await actions.load({ commit, state }, 'fghij')
      expect(commit).toHaveBeenCalledWith('updateGridSelection', { 1: [1], 2: [1] })
      expect(commit).toHaveBeenCalledWith('updateFacetFilter', { ...emptyState.facetFilter, ageGroupAt1A: ['2', '3'] })
      expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Loaded order with orderNumber fghij' })
      done()
    })
  })

  describe('save', () => {
    describe('if orderNumber is set', () => {
      it('saves grid selection', async (done) => {
        const commit = jest.fn()
        const state: ApplicationState = {
          ...emptyState,
          order: {
            orderNumber: '12345',
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: OrderState.Draft,
            submissionDate: 'submissionDate',
            creationDate: 'creationDate',
            updateDate: 'updateDate'
          }
        }
        post.mockResolvedValue('success')
        const response = await actions.save({ state, commit })
        expect(response).toBe('12345')
        expect(post).toHaveBeenCalledWith('/api/v1/lifelines_order/12345?_method=PUT', expect.anything(), true)
        expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Saved order with order number 12345' })
        done()
      })
    })

    describe('if orderNumber not set', () => {
      it('saves grid selection', async (done) => {
        const commit = jest.fn()
        const state: ApplicationState = {
          ...emptyState,
          order: {
            orderNumber: null,
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: null,
            submissionDate: null,
            creationDate: null,
            updateDate: null
          }
        }
        jest.spyOn(orderService, 'buildFormData').mockImplementation(() => new FormData())
        jest.spyOn(orderService, 'generateOrderNumber').mockImplementation(() => '12345')
        post.mockResolvedValue('success')
        const response = await actions.save({ state, commit })
        expect(response).toBe('12345')
        expect(post).toHaveBeenCalledWith('/api/v1/lifelines_order', expect.anything(), true)
        expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Saved order with order number 12345' })
        done()
      })
    })

    describe('if applicationForm is a fileRef', () => {
      it('saves order', async (done) => {
        const commit = jest.fn()
        const state: ApplicationState = {
          ...emptyState,
          order: {
            orderNumber: '12345',
            name: null,
            projectNumber: null,
            applicationForm: {
              id: 'id',
              url: 'url',
              filename: 'my file'
            },
            state: null,
            submissionDate: null,
            creationDate: null,
            updateDate: null
          }
        }
        jest.spyOn(orderService, 'buildFormData').mockImplementation(() => new FormData())
        post.mockResolvedValue('success')
        await actions.save({ state, commit })
        expect(post).toHaveBeenCalledWith('/api/v1/lifelines_order/12345?_method=PUT', expect.anything(), true)
        expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Saved order with order number 12345' })
        done()
      })
    })

    describe('when the submission not succesfull', () => {
      let result: any
      let commit: any
      let state: ApplicationState
      beforeEach(async (done) => {
        commit = jest.fn()
        state = {
          ...emptyState,
          order: {
            orderNumber: null,
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: OrderState.Draft,
            submissionDate: 'submissionDate',
            creationDate: 'creationDate',
            updateDate: 'updateDate'
          }
        }
        post.mockRejectedValue('error')
        result = await actions.save({ commit, state })
        done()
      })

      it('should resturn undefined', () => {
        expect(result).toBeUndefined()
        expect(commit).not.toHaveBeenCalledWith('setToast', { type: 'success', message: 'Saved order with order number 12345' })
      })
    })
  })

  describe('submit', () => {
    describe('if orderNumber is set', () => {
      it('submits the order', async (done) => {
        const commit = jest.fn()
        const dispatch = jest.fn()
        const state: ApplicationState = {
          ...emptyState,
          order: {
            orderNumber: '12345',
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: OrderState.Draft,
            submissionDate: 'submissionDate',
            creationDate: 'creationDate',
            updateDate: 'updateDate'
          }
        }
        post.mockResolvedValue('success')
        await actions.submit({ state, commit, dispatch })
        expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Submitted order with order number 12345' })
        expect(dispatch).toHaveBeenCalledWith('givePermissionToOrder')
        expect(dispatch).toHaveBeenCalledWith('sendSubmissionTrigger')
        done()
      })
    })
    describe('if orderNumber not yet set', () => {
      it('submits the order', async (done) => {
        const commit = jest.fn()
        const dispatch = jest.fn()
        const state: ApplicationState = {
          ...emptyState,
          order: {
            orderNumber: null,
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: OrderState.Draft,
            submissionDate: 'submissionDate',
            creationDate: 'creationDate',
            updateDate: 'updateDate'
          }
        }
        post.mockResolvedValue('success')
        await actions.submit({ state, commit, dispatch })
        expect(commit).toHaveBeenCalledWith('setToast', { type: 'success', message: 'Submitted order with order number 12345' })
        expect(dispatch).toHaveBeenCalledWith('givePermissionToOrder')
        expect(dispatch).toHaveBeenCalledWith('sendSubmissionTrigger')
        done()
      })
    })

    describe('when the submission not succesfull', () => {
      let result: any
      let commit: any
      let dispatch: any
      let state: ApplicationState
      beforeEach(async (done) => {
        commit = jest.fn()
        dispatch = jest.fn()
        state = {
          ...emptyState,
          order: {
            orderNumber: null,
            name: null,
            projectNumber: null,
            applicationForm: null,
            state: OrderState.Draft,
            submissionDate: 'submissionDate',
            creationDate: 'creationDate',
            updateDate: 'updateDate'
          }
        }
        post.mockRejectedValue('error')
        result = await actions.submit({ commit, state, dispatch })
        done()
      })

      it('should return undefined', () => {
        expect(result).toBeUndefined()
        expect(commit).not.toHaveBeenCalledWith('setToast', { type: 'success', message: 'Submitted order with order number 12345' })
        expect(dispatch).not.toHaveBeenCalledWith('givePermissionToOrder')
        expect(dispatch).not.toHaveBeenCalledWith('sendSubmissionTrigger')
      })
    })
  })

  describe('givePermissionToOrder', () => {
    let state: any
    beforeEach(async (done) => {
      state = {
        order: {
          orderNumber: '3333'
        }
      }
      await actions.givePermissionToOrder({ state, commit: jest.fn() })
      done()
    })
    it('should resturn undefined', () => {
      expect(post).toHaveBeenCalledWith('/api/v1/lifelines_order', expect.anything(), true)
    })
  })

  describe('givePermissionToOrder with missing orderNumber', () => {
    let state: any
    beforeEach(async (done) => {
      post.mockReset()
      state = {
        order: {
          orderNumber: null
        }
      }
      await actions.givePermissionToOrder({ state, commit: jest.fn() })
      done()
    })
    it('should resturn undefined', () => {
      expect(post).not.toHaveBeenCalled()
    })
  })

  describe('givePermissionToOrder with file attached', () => {
    let state: any
    beforeEach(async (done) => {
      post.mockReset()
      state = {
        order: {
          orderNumber: '12345',
          applicationForm: {
            id: 'app-form'
          }
        }
      }
      await actions.givePermissionToOrder({ state, commit: jest.fn() })
      done()
    })
    it('should call permission service', () => {
      expect(post).nthCalledWith(1, '/api/permissions/entity-lifelines_order', expect.anything())
      expect(post).nthCalledWith(2, '/api/permissions/entity-sys_FileMeta', expect.anything())
    })
  })

  describe('sendSubmissionTrigger', () => {
    let mockPost = jest.fn()
    beforeEach(async (done) => {
      mockPost.mockResolvedValue('yep yep')
      axios.post = mockPost
      await actions.sendSubmissionTrigger()
      done()
    })
    it('should send a trigger of type submit', () => {
      expect(mockPost).toHaveBeenCalledWith('/edge-server/trigger?type=submit')
    })
  })

  describe('sendSubmissionTrigger error handling', () => {
    let mockPost = jest.fn()
    beforeEach(async (done) => {
      // @ts-ignore
      global.console = { log: jest.fn() }
      mockPost.mockRejectedValue('my err')
      axios.post = mockPost
      await actions.sendSubmissionTrigger()
      done()
    })
    it('should send a trigger of type submit', () => {
      expect(console.log).toBeCalledWith('Send submit trigger failed')
      expect(console.log).toBeCalledWith('my err')
    })
  })
})
