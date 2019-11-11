<template>
  <div id="content-view">
      <div class="row flex-nowrap mb-5" >
        <template>
          <div class="col-sm-auto info-bar" >
            <h3 v-if="isSignedIn">{{$t('lifelines-webshop-content-header')}}</h3>
            <h3 v-else>{{$t('lifelines-webshop-signed-out-content-header')}}</h3>
            <tree-view  />
          </div>
          <div class="col" >
            <grid-view />
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
    ...mapState(['isSignedIn'])
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
