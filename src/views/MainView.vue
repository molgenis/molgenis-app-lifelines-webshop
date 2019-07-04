<template>
  <div id="main-view">
    <div class="row pt-3">
      <div class="col col-4">
        <img src="logo.svg" alt="Lifelines" />
      </div>
      <div class="col col-7">
          <toast-component
          class="toast-component"
          v-if="toast"
          :type="toast.type"
          :message="toast.message"
          @toastCloseBtnClicked="clearToast">
          </toast-component>
        </div>
      <div class="col col-1">
        <button class="btn btn-outline-success" id="order" type="button" @click="save">Order</button>
      </div>
    </div>
    <div class="row pt-3">
      <div class="col-12" >
          <ul class="nav nav-tabs">
              <li class="nav-item">
                  <a class="nav-link" :class="{active: (activeTab == 'variables')}" href="#" @click="activeTab = 'variables'">Shop</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" :class="{active: (activeTab == 'selection')}" href="#" @click="activeTab = 'selection'">Cart</a>
              </li>
          </ul>

          <div v-if="activeTab == 'variables'" class="row mt-3">
            <sidebar-view class="col-sm-4 col-md-3 col-xl-2" />
            <content-view class="col-sm-8 col-md-9 col-xl-10"/>
          </div>

          <div v-else>
              <cart-view  class="mt-3" />
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

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, CartView, ToastComponent },
  data: () => {
    return {
      activeTab: 'variables'
    }
  },
  computed: {
    ...mapState([
      'toast'
    ])
  },
  methods: {
    ...mapMutations([
      'clearToast'
    ]),
    ...mapActions([
      'save', 'load', 'loadVariables', 'loadAssessments'
    ])
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
