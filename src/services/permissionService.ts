// @ts-ignore
import api from '@molgenis/molgenis-api-client'

export const setRolePermission = async (rowId: string, tableId: string, role: string, permission: string) => {
  const data = {
    objects: [{
      objectId: rowId,
      permissions: [{ role, permission }]
    }]
  }
  const options = {
    body: JSON.stringify(data)
  }

  return api.post(`/api/permissions/entity-${tableId}`, options)
}

export const setUserPermission = async (rowId: string, tableId: string, user: string, permission: string) => {
  const data = {
    objects: [{
      objectId: rowId,
      permissions: [{ user, permission }]
    }]
  }
  const options = {
    body: JSON.stringify(data)
  }

  return api.post(`/api/permissions/entity-${tableId}`, options)
}
