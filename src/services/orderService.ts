import FromField from '@/types/FormField'
// @ts-ignore
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { QueryParams } from '@/types/QueryParams'

const appendToForm = (fields: FromField[], formData: any, [key, value]: [string, unknown]) => {
  const isFile = value && fields.find((field) => field.id === key && field.type === 'file' && typeof value !== 'string')
  if (isFile) {
    // @ts-ignore
    formData.append(key, value, value.name)
  } else {
    const stringValue = value === undefined || value === null ? '' : value
    formData.append(key, stringValue)
  }
}

export const isFileIncluded = (formData: { [index: string]: any }, formFields: FromField[]) => {
  const fieldsWithFile = formFields
    .filter((field) => field.type === 'file')
    .find((field) => typeof formData[field.id] !== 'string')

  return !!fieldsWithFile
}

export const buildFormData = (data: any, fields: FromField[]) => {
  const formData = new FormData()
  Object.entries(data).forEach((pair) => appendToForm(fields, formData, pair))
  return formData
}

export const generateOrderNumber = () => Math.floor(Math.random() * 1000000).toString()

export const buildOrdersQuery = (query: QueryParams) => {
  let queryParams = `?num=${query.num}&start=${query.start}`

  // Default sorting is on creation data.
  if (!query.sortBy) {
    query.sortBy = 'creationDate'
    query.sortDesc = true
  }

  const sortFlow = query.sortDesc ? 'desc' : 'asc'
  queryParams += `&sort=${query.sortBy}:${sortFlow}`

  let rsqlOptions:[] | Object = []
  const operands = { text: {}, state: {} }

  if (query.filters.text) {
    operands.text = {
      operands: [
        { selector: 'email', comparison: '=like=', arguments: query.filters.text },
        { selector: `name`, comparison: '=like=', arguments: query.filters.text },
        { selector: `orderNumber`, comparison: '=like=', arguments: query.filters.text },
        { selector: `projectNumber`, comparison: '=like=', arguments: query.filters.text }
      ],
      operator: 'OR'
    }
  }

  if (query.filters.state) {
    operands.state = {
      selector: 'state',
      comparison: '=q=',
      arguments: query.filters.state
    }
  }

  if (!(query.filters.state || query.filters.text)) {
    return queryParams
  }

  if (query.filters.state && query.filters.text) {
    rsqlOptions = { operator: 'AND', operands: [operands.text, operands.state] }
  } else if (query.filters.text) {
    rsqlOptions = operands.text
  } else {
    rsqlOptions = operands.state
  }

  const rsql = transformToRSQL(rsqlOptions)
  queryParams += `&q=${encodeRsqlValue(rsql)}`
  return queryParams
}
