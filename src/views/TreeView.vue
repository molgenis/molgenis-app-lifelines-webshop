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
        return {
          selected: this.$store.state.treeSelected,
          open: this.$store.state.treeOpenSection
        }
      },
      set ({ selected, open }) {
        this.$store.commit('updateTreeSelection', selected)
        this.$store.commit('updateTreeOpenSection', open)
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
