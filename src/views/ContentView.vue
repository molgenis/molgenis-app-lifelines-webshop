<template>
  <div id="Content-view">
      <div class="row flex-nowrap" >
      <div class="col tree">
           <h3 class="my-3">2. Select data</h3>
          </div>
          <div class="col-span-4 col-4" >
            <search-component></search-component>
          </div>
      </div>
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
import SearchComponent from '../components/search/SearchComponent.vue'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView, SearchComponent }
})
</script>

<style scoped>
  .col.tree{
    max-width: 20rem;
  }
</style>
