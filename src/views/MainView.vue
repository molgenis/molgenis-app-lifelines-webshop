<template>
  <div id="main-view">
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-12" >
            <navigation-bar v-model="activeTab" :selectedVariables="selectedVariableIds"></navigation-bar>

            <toast-component
              class="toast-component mt-2"
              v-if="toast"
              :type="toast.type"
              :message="toast.message"
              @toastCloseBtnClicked="clearToast">
            </toast-component>

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
import NavigationBar from '../components/NavigationBar.vue'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, ToastComponent, NavigationBar },
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
