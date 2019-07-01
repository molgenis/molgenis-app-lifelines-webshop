<template>
  <div id="main-view" class="row pt-3">
    <sidebar-view class="col-sm-4 col-md-3 col-xl-2" />
    <content-view class="col-sm-8 col-md-9 col-xl-10"/>
  </div>
</template>

<script>
import Vue from 'vue'
import ContentView from './ContentView.vue'
import SidebarView from './SidebarView.vue'

export default Vue.extend({
  name: 'MainView',
  components: { ContentView, SidebarView }
})
</script>
