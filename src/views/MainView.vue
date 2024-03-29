<template>
  <div id="main-view">
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-12" v-if="!loading">
          <navigation-bar v-model="activeTab" :selectedVariables="selectedVariableIds"></navigation-bar>
          <div v-if="activeTab === 'variables'" class="row mt-3 flex-nowrap">
            <sidebar-view class="col-sm-auto info-bar" v-model="showSidebar"></sidebar-view>
            <content-view class="col"></content-view>
          </div>
          <div v-else>
            <cart-view class="mt-3" :isCartLoading="isCartLoading"></cart-view>
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
import NavigationBar from '../components/NavigationBar.vue'

import { mapState, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, NavigationBar },
  data: () => {
    return {
      activeTab: 'variables',
      publicPath: process.env.BASE_URL,
      showSidebar: true,
      isCartLoading: false
    }
  },
  computed: {
    ...mapState(['loading', 'variables']),
    selectedVariableIds () {
      return Object.keys(this.$store.state.gridSelection).length
    }
  },
  methods: {
    ...mapMutations(['setLoading', 'setSuccessMessage']),
    ...mapActions(['loadOrderAndCart', 'loadVariables', 'loadAssessments'])
  },
  watch: {
    activeTab: async function (newVal) {
      // if the cart is shown and the variable map was not filled, load it
      if (newVal !== 'variables' && this.selectedVariableIds && !Object.keys(this.variables).length) {
        this.isCartLoading = true
        await this.loadVariables().catch(() => { this.isCartLoading = false })
        this.isCartLoading = false
      }
    }
  },
  created: async function () {
    this.setLoading(true)
    const orderNumber = this.$route.params.orderNumber
    if (orderNumber) {
      const promises = Promise.all([this.loadVariables(), this.loadAssessments()])
      await promises
      await this.loadOrderAndCart(orderNumber)
      this.setSuccessMessage(`Loaded order with orderNumber ${orderNumber}`)
    } else {
      await this.loadAssessments()
    }
    this.setLoading(false)
  }
})
</script>
