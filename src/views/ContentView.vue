<template>
  <div id="Content-view">
    <h3>2. Select data</h3>
    <div class="row">
      <div class="col-sm-3">
        <tree-view  />
      </div>
      <div class="col">
        <variable-view />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from './TreeView.vue'
import VariableView from './VariableView'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, VariableView }
})
</script>
