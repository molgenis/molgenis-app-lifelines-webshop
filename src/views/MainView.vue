<template>
  <div id="main-view">
    <div class="container-fluid mt-3">
      <toast-component
        class="toast-component mt-2"
        v-if="toast"
        :type="toast.type"
        :message="toast.message"
        @toastCloseBtnClicked="clearToast">
      </toast-component>
      <div class="row">
        <div class="col-12" >
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link" :class="{active: (activeTab === 'variables')}" href="#" @click="activeTab = 'variables'">
                      <font-awesome-icon icon="store"></font-awesome-icon> Shop
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" :class="{active: (activeTab === 'selection')}" href="#" @click="activeTab = 'selection'">
                      <font-awesome-icon icon="shopping-cart"></font-awesome-icon> Cart
                      <span class="badge badge-secondary">{{selectedVariableIds}}</span>
                    </a>
                </li>
            </ul>
            <div v-if="activeTab === 'variables'" class="row mt-3 flex-nowrap">
              <sidebar-view class="col-sm-auto info-bar" v-model="showSidebar"></sidebar-view>
              <content-view class="col"></content-view>
            </div>

            <div v-else>
              <cart-view class="mt-3"></cart-view>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ContentView from './ContentView.vue'
import SidebarView from './SidebarView.vue'
import CartView from './CartView.vue'
import ToastComponent from '../components/ToastComponent.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStore, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faStore, faShoppingCart)

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, ToastComponent, FontAwesomeIcon },
  data: () => {
    return {
      activeTab: 'variables',
      publicPath: process.env.BASE_URL,
      showSidebar: true
    }
  },
  computed: {
    ...mapState(['toast']),
    ...mapGetters(['isSignedIn']),
    selectedVariableIds () {
      return Object.keys(this.$store.state.gridSelection).length
    }
  },
  methods: {
    ...mapMutations(['clearToast', 'setToast']),
    ...mapActions(['load', 'loadVariables', 'loadAssessments'])
  },
  async created () {
    if (!this.isSignedIn && !this.toast) {
      this.setToast({ type: 'info', message: 'Please sign in to select and order variables' })
    }
    const promises = Promise.all([this.loadVariables(), this.loadAssessments()])
    await promises
    if (this.$route.params.orderNumber) {
      this.load(this.$route.params.orderNumber)
    }
  }
})
</script>
