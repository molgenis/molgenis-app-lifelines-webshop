import Vue from 'vue'
import Router from 'vue-router'
import MainView from './views/MainView.vue'
import OrdersView from './views/OrdersView.vue'
import OrderView from './views/OrderView.vue'
import HomeView from './views/HomeView.vue'

Vue.use(Router)

const packageJson = require('../package.json')

export default new Router({
  base: process.env.NODE_ENV === 'production' ? packageJson.name + '/dist/index.html' : process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView
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
})
