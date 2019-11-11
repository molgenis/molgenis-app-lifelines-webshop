import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
// @ts-ignore
import i18n from '@molgenis/molgenis-i18n-js'
import router from './router'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'
import fetchPonyfill from 'fetch-ponyfill'

Vue.config.productionTip = false

// Work around for session key time out
fetchPonyfill().fetch('/api/v2/i18n/lifelines-webshop/en').then((resp) => {
  if (resp.status === 401) {
    window.location.href = '/login'
  }
})

Vue.use(i18n, {
  lng: 'en',
  fallbackLng: 'en',
  namespace: ['lifelines-webshop', 'ui-form'],
  callback () {
    global.app = new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
