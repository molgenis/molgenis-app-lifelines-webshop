<template>
  <div id="Content-view">
    <h3>2. Select data</h3>
        <div class="row mt-3" >
          <div class="col-4" >
            <tree-view  />
          </div>
          <div class="col-8" >
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
