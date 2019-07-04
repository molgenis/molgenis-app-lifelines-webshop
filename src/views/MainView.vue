<template>
  <div id="main-view">
    <div class="pt-3">
      <img src="logo.svg" alt="Lifelines" />
    </div>
    <div class="row justify-content-md-center pt-3">
      <div class="col-6">
        <toast-component
        class="toast-component"
        v-if="toast"
        :type="toast.type"
        :message="toast.message"
        @toastCloseBtnClicked="clearToast">
        </toast-component>
      </div>
    </div>
    <div class="row">
      <sidebar-view class="col-sm-4 col-md-3 col-xl-2" />
      <content-view class="col-sm-8 col-md-9 col-xl-10"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ContentView from './ContentView.vue'
import SidebarView from './SidebarView.vue'
import ToastComponent from '../components/ToastComponent.vue'
import { mapState, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView, ToastComponent },
  computed: {
    ...mapState([
      'toast'
    ])
  },
  methods: {
    ...mapMutations([
      'clearToast'
    ])
  }
})
</script>
