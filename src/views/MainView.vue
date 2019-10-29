<template>
  <div id="main-view">

    <nav class="navbar navbar-light mb-3 px-4">
      <a class="navbar-brand" href="#">
        <img :src="`${publicPath}logo.svg`" alt="Lifelines" />
      </a>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <search-component
            :searchTerm="searchTerm"
            :searching="isGridLoading"
            @searchChanged="onSearchChange"
          ></search-component>
        </li>
      </ul>
    </nav>

    <div class="container-fluid">
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
import { mapState, mapMutations, mapActions } from 'vuex'
import SearchComponent from '../components/search/SearchComponent.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStore, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faStore, faShoppingCart)

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, ToastComponent, SearchComponent, FontAwesomeIcon },
  data: () => {
    return {
      activeTab: 'variables',
      publicPath: process.env.BASE_URL,
      searching: false,
      showSidebar: true
    }
  },
  computed: {
    ...mapState(['searchTerm', 'toast', 'isGridLoading'])
  },
  methods: {
    ...mapMutations(['updateSearchTerm', 'clearToast']),
    ...mapActions(['filterSections', 'filterSubsections', 'loadGridVariables', 'load', 'loadVariables', 'loadAssessments']),
    onSearchChange (value) {
      this.searching = true
      this.updateSearchTerm(value || null)
      this.filterSections()
      this.filterSubsections()
      if (this.treeSelection !== -1) {
        this.loadGridVariables()
      }
    }
  },
  async created () {
    const promises = Promise.all([this.loadVariables(), this.loadAssessments()])
    await promises
    if (this.$route.params.cartId) {
      this.load(this.$route.params.cartId)
    }
  }
})
</script>
