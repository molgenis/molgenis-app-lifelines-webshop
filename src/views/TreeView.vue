<template>
  <div id="tree-view">
    <search-component
      :searchTerm="searchTerm"
      :searching="isGridLoading"
      @searchChanged="onSearchChange"
      class="mb-2"
    ></search-component>

    <collapsible-tree
      :selection="treeSelected"
      :structure="filteredTreeStructure"
      :opensection="treeOpenSection"
      @updateselection="updateSelection"
      @updateopensection="updateOpenSection" />
  </div>
</template>

<script>
import Vue from 'vue'
import CollapsibleTree from '../components/tree/CollapsibleTree.vue'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import SearchComponent from '../components/search/SearchComponent.vue'

export default Vue.extend({
  name: 'TreeView',
  computed: {
    ...mapGetters(['filteredTreeStructure']),
    ...mapState(['searchTerm', 'isGridLoading', 'treeSelected', 'treeOpenSection'])
  },
  methods: {
    ...mapMutations(['updateSearchTerm']),
    ...mapActions(['filterSections', 'filterSubsections', 'loadGridVariables']),
    updateSelection (value) {
      this.$store.commit('updateTreeSelection', value)
    },
    onSearchChange (value) {
      this.updateSearchTerm(value || null)
      this.filterSections()
      this.filterSubsections()
      if (this.treeSelection !== -1) {
        this.loadGridVariables()
      }
    },
    updateOpenSection (value) {
      this.$store.commit('updateTreeOpenSection', value)
    }
  },
  created () {
    this.$store.dispatch('loadSections')
    this.$store.dispatch('loadSubSections')
    this.$store.dispatch('loadSectionTree')
  },
  components: { CollapsibleTree, SearchComponent }
})
</script>
