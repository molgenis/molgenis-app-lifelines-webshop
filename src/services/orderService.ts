import FromField from '@/types/FormField'

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
