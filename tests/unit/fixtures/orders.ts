import { Order, OrderState } from '@/types/Order'

const orders: Order[] = [{
  orderNumber: 'edcba',
  state: OrderState.Draft
}, {
  orderNumber: 'abcde',
  state: OrderState.Submitted,
  submissionDate: '2019-10-30T13:25:49Z',
  name: 'My submitted order',
  applicationForm: {
    filename: 'Motivation.pdf',
    id: 'aaaac3rcetmgfmudsodb3laaay',
    url: 'https://lifelines.test.molgenis.org/files/aaaac3rcetmgfmudsodb3laaay'
  } }]

export default orders
