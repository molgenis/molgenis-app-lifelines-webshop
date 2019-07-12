<template>
  <div id="Content-view">
      <div class="row flex-nowrap" >
      <div class="col tree">
           <h3 class="my-3">2. Select data</h3>
          </div>
          <div class="col-span-4 col-4" >
            <search-component @seachChanged="onSearchChange"></search-component>
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
import { mapMutations, mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView, SearchComponent },
  computed: mapState(['treeSelection']),
  methods: {
    ...mapMutations(['updateSearchTerm']),
    ...mapActions(['filterSections', 'filterSubsections', 'loadGridVariables']),
    onSearchChange (value) {
      this.updateSearchTerm(value || null)
      this.filterSections()
      this.filterSubsections()
      if (this.treeSelection !== -1) {
        this.loadGridVariables()
      }
    }
  }
})
</script>

<style scoped>
  .col.tree{
    max-width: 20rem;
  }
</style>
