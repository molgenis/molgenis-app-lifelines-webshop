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

/**
 * Make sure both the lifelines manager and the user
 * has permission to modify the order.
 * @param state - The Vuex application store
 * @param isNewOrder - New orders receive an extra permission on the order itself
 */
export const syncOrderPermissions = async (state:any, isNewOrder:Boolean, newContents:Boolean, newApplicationForm:Boolean) => {
  const { context: { context }, order } = state

  const results = []

  if (context.username === order.user) {
    if (isNewOrder) {
      results.push(setRolePermission(order.orderNumber, 'lifelines_order', 'LIFELINES_MANAGER', 'WRITE'))
    }
    if (newContents) {
      results.push(setRolePermission(order.contents.id, 'sys_FileMeta', 'LIFELINES_MANAGER', 'WRITE'))
    }

    if (newApplicationForm) {
      results.push(setRolePermission(order.applicationForm.id, 'sys_FileMeta', 'LIFELINES_MANAGER', 'WRITE'))
    }
  } else {
    if (isNewOrder) {
      results.push(setUserPermission(order.orderNumber, 'lifelines_order', order.user, 'WRITE'))
    }

    if (newContents) {
      results.push(setUserPermission(order.contents.id, 'sys_FileMeta', order.user, 'WRITE'))
    }
    // A new File object is being committed.
    if (newApplicationForm) {
      results.push(setUserPermission(order.applicationForm.id, 'sys_FileMeta', order.user, 'WRITE'))
    }
  }

  await results
  return results
}
