<template>
  <div id="Content-view">
    <h3>2. Select data</h3>
    <div class="row">
      <div class="col-12" >
          <ul class="nav nav-tabs">
              <li class="nav-item">
                  <a class="nav-link" :class="{active: (activeTab == 'variables')}" href="#" @click="activeTab = 'variables'">Variables</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" :class="{active: (activeTab == 'selection')}" href="#" @click="activeTab = 'selection'">View Chart</a>
              </li>
          </ul>
          <div v-show="activeTab == 'variables'">
              <tree-view  />
          </div>
          <div v-show="activeTab == 'selection'">
              <cart-view  />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from './TreeView.vue'
import CartView from './CartView.vue'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, CartView },
  data: () => {
    return {
      activeTab: 'variables'
    }
  }
})
</script>
