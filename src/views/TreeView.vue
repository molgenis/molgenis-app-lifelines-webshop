<template>
  <div id="tree-view">
    <collapsible-tree v-model="selection" :structure="treeStructure" />
  </div>
</template>

<script>
import Vue from 'vue'
import CollapsibleTree from '../components/tree/CollapsibleTree.vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'TreeView',
  computed: {
    ...mapGetters(['treeStructure']),
    selection: {
      get () {
        return this.$store.state.treeSelected
      },
      set (value) {
        this.$store.commit('updateTreeSelection', value)
      }
    }
  },
  created () {
    this.$store.dispatch('loadSections')
    this.$store.dispatch('loadSubSections')
    this.$store.dispatch('loadSectionTree')
  },
  components: { CollapsibleTree }
})
</script>
