// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { setRolePermission, setUserPermission } from '@/services/permissionService'

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
})
