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
import NavigationBar from '../components/NavigationBar.vue'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, NavigationBar },
  data: () => {
    return {
      activeTab: 'variables',
      publicPath: process.env.BASE_URL,
      showSidebar: true
    }
  },
  computed: {
    ...mapState(['loading']),
    selectedVariableIds () {
      return Object.keys(this.$store.state.gridSelection).length
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    ...mapActions(['load', 'loadVariables', 'loadAssessments'])
  },
  created: async function () {
    this.setLoading(true)

    const promises = Promise.all([this.loadVariables(), this.loadAssessments()])
    await promises

    if (this.$route.params.orderNumber) {
      await this.load(this.$route.params.orderNumber)
    }
    this.setLoading(false)
  }
})
</script>
