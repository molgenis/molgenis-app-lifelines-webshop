import { Order, OrderState } from '@/types/Order'

const orders: Order[] = [{
  id: 'edcba',
  state: OrderState.Draft,
  submissionDate: '2019-10-31T13:48:12Z'
}, {
  id: 'abcde',
  state: OrderState.Submitted,
  submissionDate: '2019-10-30T13:25:49Z',
  name: 'My draft order',
  applicationForm: {
    filename: 'Motivation.pdf',
    id: 'aaaac3rcetmgfmudsodb3laaay',
    url: 'https://lifelines.test.molgenis.org/files/aaaac3rcetmgfmudsodb3laaay'
  } }]

export default orders
