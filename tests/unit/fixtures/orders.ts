import { Order, OrderState } from '@/types/Order'

const orders: Order[] = [{
  orderNumber: 'edcba',
  name: null,
  creationDate: null,
  submissionDate: null,
  updateDate: null,
  projectNumber: null,
  applicationForm: null,
  state: OrderState.Draft
}, {
  orderNumber: 'abcde',
  name: 'My draft order',
  creationDate: null,
  submissionDate: null,
  updateDate: null,
  projectNumber: null,
  applicationForm: {
    filename: 'Motivation.pdf',
    id: 'aaaac3rcetmgfmudsodb3laaay',
    url: 'https://lifelines.test.molgenis.org/files/aaaac3rcetmgfmudsodb3laaay'
  },
  state: OrderState.Submitted
}]

export default orders
