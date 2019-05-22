import Vue from 'vue'
import App from './App.vue'
import store from './store'
// @ts-ignore
import i18n from '@molgenis/molgenis-i18n-js'

Vue.config.productionTip = false

Vue.use(i18n, {
  // @ts-ignore
  lng: window.__INITIAL_STATE__.lng || 'en',
  // @ts-ignore
  fallbackLng: window.__INITIAL_STATE__.fallbackLng || 'en',
  namespace: ['biobank-webshop'],
  callback () {
    new Vue({
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
