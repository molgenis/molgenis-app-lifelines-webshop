import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import store from './store/store'

// @ts-ignore
import i18n from '@molgenis/molgenis-i18n-js'
import router from './router'

library.add(faChevronUp)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(i18n, {
  lng: 'en',
  fallbackLng: 'en',
  namespace: ['lifelines-webshop'],
  callback () {
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
