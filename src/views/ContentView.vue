<template>
  <div id="content-view">
      <div class="row flex-nowrap" >
        <template v-if="!isEmptySearchResult">
          <div class="col-sm-auto info-bar" >
            <h3 v-if="isSignedIn">{{ 'lifelines-webshop-content-header' | i18n }}</h3>
            <h3 v-else>{{ 'lifelines-webshop-signed-out-content-header' | i18n }}</h3>
            <tree-view  />
          </div>
          <div class="col" >
            <grid-view />
          </div>
        </template>
        <template v-else>
          <div class="col" >
            <h5 class="pt-3">No items where found matching the search term.</h5>
          </div>
        </template>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from './TreeView.vue'
import GridView from './GridView.vue'
import { mapMutations, mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView },
  computed: {
    ...mapState(['isSignedIn']),
    isEmptySearchResult () {
      return this.$store.getters.isSearchResultEmpty
    }
  },
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
  .col.tree {
    max-width: 22rem;
  }
</style>
