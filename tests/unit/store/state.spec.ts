import state from '@/store/state'

describe('state', () => {
  it('should contain the ordrFormFields', () => {
    expect(state.orderFormFields).toBeDefined()
  })

  it('projectNumber should be required, visible and valid', () => {
    expect(state.orderFormFields[0].id).toEqual('projectNumber')
    // @ts-ignore
    expect(state.orderFormFields[0].required()).toBeTruthy()
    // @ts-ignore
    expect(state.orderFormFields[0].visible()).toBeTruthy()
    // @ts-ignore
    expect(state.orderFormFields[0].validate()).toBeTruthy()
  })

  it('name should be required, visible and valid', () => {
    expect(state.orderFormFields[1].id).toEqual('name')
    // @ts-ignore
    expect(state.orderFormFields[1].required()).toBeFalsy()
    // @ts-ignore
    expect(state.orderFormFields[1].visible()).toBeTruthy()
    // @ts-ignore
    expect(state.orderFormFields[1].validate()).toBeTruthy()
  })

  it('applicationForm should be required, visible and valid', () => {
    expect(state.orderFormFields[2].id).toEqual('applicationForm')
    // @ts-ignore
    expect(state.orderFormFields[2].required()).toBeFalsy()
    // @ts-ignore
    expect(state.orderFormFields[2].visible()).toBeTruthy()
    // @ts-ignore
    expect(state.orderFormFields[2].validate()).toBeTruthy()
  })
})
