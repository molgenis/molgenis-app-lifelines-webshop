import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
// @ts-ignore
import i18n from '@molgenis/molgenis-i18n-js'
import { router } from './router'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'

Vue.config.productionTip = false

const contextPromise = store.dispatch('fetchContext').catch(() => {
  // session key has timed out
  window.location.href = '/login'
})

const app:Vue = new Vue({ store, router, render: h => h(App) })

Vue.use(i18n, {
  lng: 'en',
  fallbackLng: 'en',
  namespace: ['lifelines-webshop', 'ui-form'],
  async callback () {
    await contextPromise
    app.$mount('#app')
  }
})

export default app
