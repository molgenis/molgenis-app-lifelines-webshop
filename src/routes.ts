import { Route, NavigationGuardNext } from 'vue-router'
import MainView from './views/MainView.vue'
import OrdersView from './views/OrdersView.vue'
import OrderView from './views/OrderView.vue'
import store from '@/store/store'

const handleProtectedRoute = (to: Route, from: Route, next: NavigationGuardNext) => {
  console.log('-----------------')
  console.log('debug protected route')
  console.log('to:', to, JSON.stringify(to))
  console.log('from:', from, JSON.stringify(from))
  console.log('-----------------')
  store.getters.isSignedIn === false ? next('/shop') : next()
}

export default [
  {
    path: '/orders/:orderNumber?',
    name: 'orders',
    component: OrdersView,
    children: [
      {
        name: 'orderDelete',
        path: 'delete'
      },
      {
        name: 'orderStateChange',
        path: 'state/:state'
      }
    ],
    beforeEnter: handleProtectedRoute
  },
  {
    path: '/shop',
    name: 'shop',
    component: MainView
  },
  {
    path: '/shop/:orderNumber',
    name: 'load',
    component: MainView,
    beforeEnter: handleProtectedRoute
  },
  {
    path: '/order',
    name: 'order',
    component: OrderView,
    beforeEnter: handleProtectedRoute
  },
  {
    path: '/*',
    name: 'catchAll',
    beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
      console.log('-----------------')
      console.log('debug catch all')
      console.log('to:', to, JSON.stringify(to))
      console.log('from:', from, JSON.stringify(from))
      console.log('-----------------')
      store.getters.isSignedIn === true ? next('/orders') : next('/shop')
    }
  }
]
