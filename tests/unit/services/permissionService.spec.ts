// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { setRolePermission, setUserPermission, syncOrderPermissions } from '@/services/permissionService'

describe('permission service', () => {
  describe('setRolePermission', () => {
    let permission:any

    beforeEach(async (done) => {
      api.post = jest.fn()
      permission = await setRolePermission('rowId', 'tableId', 'role', 'READ')
      done()
    })

    afterEach(() => {
      api.post.mockReset()
    })

    it('sends request to server', () => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/permissions/entity-tableId',
        expect.objectContaining({
          body: expect.any(String)
        }))
    })
  })

  describe('setUserPermission', () => {
    let permission:any

    beforeEach(async (done) => {
      api.post = jest.fn()
      permission = await setUserPermission('rowId', 'tableId', 'user', 'READ')
      done()
    })

    afterEach(() => {
      api.post.mockReset()
    })

    it('sends request to server', () => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/permissions/entity-tableId',
        expect.objectContaining({
          body: expect.any(String)
        }))
    })
  })

  describe('syncOrderPermissions', () => {
    let state: any
    let results

    beforeEach(async (done) => {
      state = {
        context: {
          context: {
            username: 'user'
          }
        },
        order: {
          applicationForm: {
            'id': 'applicationForm'
          },
          contents: {
            'id': 'contents'
          },
          orderNumber: '3333',
          user: 'user'
        }
      }

      done()
    })

    it('should add manager permission if the order is from the same user', async () => {
      results = await syncOrderPermissions(state, true, true, true)
      expect(results.length).toBe(3)
      results = await syncOrderPermissions(state, false, true, true)
      expect(results.length).toBe(2)
      results = await syncOrderPermissions(state, false, false, true)
      expect(results.length).toBe(1)
      results = await syncOrderPermissions(state, false, false, false)
      expect(results.length).toBe(0)
    })

    it('should add user permission if the order is from another user', async () => {
      state.context.context.username = 'manager'
      results = await syncOrderPermissions(state, true, true, true)
      expect(results.length).toBe(3)
      results = await syncOrderPermissions(state, false, true, true)
      expect(results.length).toBe(2)
      results = await syncOrderPermissions(state, false, false, true)
      expect(results.length).toBe(1)

      results = await syncOrderPermissions(state, false, false, false)
      expect(results.length).toBe(0)
    })
  })
})
