import Vue from 'vue'
import Router, { NavigationGuard } from 'vue-router'

import MainView from './views/MainView.vue'
import OrdersView from './views/OrdersView.vue'
import OrderView from './views/OrderView.vue'

import store from '@/store/store'

Vue.use(Router)
export const routes = [
  {
    path: '/',
    name: 'home',
    redirect: () => ({ name: store.getters.isSignedIn ? 'orders' : 'shop' })
  },
  {
    path: '/orders/:orderNumber?',
    name: 'orders',
    component: OrdersView,
    children: [
      {
        name: 'orderDelete',
        path: 'delete'
      }
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    component: MainView
  },
  {
    path: '/shop/:orderNumber',
    name: 'load',
    component: MainView
  },
  {
    path: '/order',
    name: 'order',
    component: OrderView
  }
]

const packageJson = require('../package.json')

export const router = new Router({
  base: process.env.NODE_ENV === 'production' ? packageJson.name + '/dist/index.html' : process.env.BASE_URL,
  routes
})

export const anonymousNavigationGuard: NavigationGuard = (to, _from, next) => {
  if (to.name !== 'shop' && !store.getters.isSignedIn) {
    router.push({ name: 'shop' })
  } else {
    next()
  }
}
router.beforeResolve(anonymousNavigationGuard)
