import { Order, OrderState } from '@/types/Order'

const orders: Order[] = [{
  orderNumber: 'edcba',
  name: null,
  submissionDate: '2019-10-31T13:48:12Z',
  projectNumber: null,
  applicationForm: null,
  state: OrderState.Draft
}, {
  orderNumber: 'abcde',
  name: 'My draft order',
  submissionDate: '2019-10-30T13:25:49Z',
  projectNumber: null,
  applicationForm: {
    filename: 'Motivation.pdf',
    id: 'aaaac3rcetmgfmudsodb3laaay',
    url: 'https://lifelines.test.molgenis.org/files/aaaac3rcetmgfmudsodb3laaay'
  },
  state: OrderState.Submitted
}]

export default orders
