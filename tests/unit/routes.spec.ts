import routes from '@/routes'
import store from '@/store/store'

jest.mock('@/store/store', () => {
  const getters = {}
  Object.defineProperty(getters, 'isSignedIn', {
    get: jest.fn(() => false),
    configurable: true
  })
  return {
    getters
  }
})

describe('routes', () => {
  let routeMap: any
  let ordersRoute: any
  let catchAllRoute: any

  beforeEach(() => {
    routeMap = routes.reduce((routeMap:any, route: any) => {
      routeMap[route.name] = route
      return routeMap
    }, {})

    ordersRoute = routeMap.orders
    catchAllRoute = routeMap.catchAll
  })

  it('has a orders route', () => {
    expect(ordersRoute.name).toEqual('orders')
  })

  it('when not signed in orders route should move to shop ', () => {
    const mockNext = jest.fn()
    ordersRoute.beforeEnter({}, {}, mockNext)
    expect(mockNext).toHaveBeenCalledWith('/shop')
  })

  it('when signed in orders route should pass to next', () => {
    Object.defineProperty(store.getters, 'isSignedIn', {
      get: jest.fn(() => true),
      configurable: true
    })
    const mockNext = jest.fn()
    ordersRoute.beforeEnter({}, {}, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })

  it('when not signed catch all path should move to /shop ', () => {
    Object.defineProperty(store.getters, 'isSignedIn', {
      get: jest.fn(() => false),
      configurable: true
    })
    const mockNext = jest.fn()
    catchAllRoute.beforeEnter({}, {}, mockNext)
    expect(mockNext).toHaveBeenCalledWith('/shop')
  })

  it('when signed catch all path should move to /orders', () => {
    Object.defineProperty(store.getters, 'isSignedIn', {
      get: jest.fn(() => true),
      configurable: true
    })
    const mockNext = jest.fn()
    catchAllRoute.beforeEnter({}, {}, mockNext)
    expect(mockNext).toHaveBeenCalledWith('/orders')
  })
})
