import Vue from 'vue'
import Router from 'vue-router'
import MainView from './views/MainView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: window.location.pathname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    {
      path: '/:cartId',
      name: 'load',
      component: MainView
    }
  ]
})
