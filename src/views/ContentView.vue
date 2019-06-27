<template>
  <div id="Content-view">
    <h3>2. Select data</h3>
    <div class="row">
      <tree-view class="col-sm-3" />
      <grid-view class="col-sm-9" />
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
