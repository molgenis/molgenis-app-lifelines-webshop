<template>
  <div id="Content-view">
    <div class="row flex-nowrap">
      <div class="col tree">
        <h3 class="my-3">2. Select data</h3>
        <tree-view  />
      </div>
      <div class="col">
        <grid-view />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from './TreeView.vue'
import GridView from './GridView.vue'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView }
})
</script>

<style scoped>
  .col.tree{
    max-width: 22rem;
  }
</style>
