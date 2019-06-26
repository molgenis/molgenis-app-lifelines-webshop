<template>
  <div id="variable-view" class="container row">
    <div class="col-12" >
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" :class="{active: (activeTab == 'variables')}" href="#" @click="activeTab = 'variables'">Variables</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{active: (activeTab == 'selection')}" href="#" @click="activeTab = 'selection'">Chart</a>
            </li>
        </ul>
        <div v-show="activeTab == 'variables'">
            Variables
        </div>
        <div v-show="activeTab == 'selection'">
            Chart
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'VariableView',
  data: () => {
    return {
      activeTab: 'variables'
    }
  }
})
</script>
