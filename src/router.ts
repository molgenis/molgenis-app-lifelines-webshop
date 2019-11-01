import Vue from 'vue'
import Router from 'vue-router'
import MainView from './views/MainView.vue'
import OrdersView from './views/OrdersView.vue'
import OrderView from './views/OrderView.vue'

Vue.use(Router)

const packageJson = require('../package.json')

export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? packageJson.name + '/dist/index.html' : process.env.BASE_URL,
  routes: [
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView
    },
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    {
      path: '/shop/:cartId',
      name: 'load',
      component: MainView
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView
    }
  ]
})
