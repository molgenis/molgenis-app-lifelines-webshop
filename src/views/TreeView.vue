<template>
  <div id="tree-view">
    <collapsible-tree
      :selection="treeSelected"
      :structure="treeStructure"
      :opensection="treeOpenSection"
      @updateselection="updateSelection"
      @updateopensection="updateOpenSection" />
  </div>
</template>

<script>
import Vue from 'vue'
import CollapsibleTree from '../components/tree/CollapsibleTree.vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'TreeView',
  data: function () {
    return {
      selection: -1,
      open: ''
    }
  },
  computed: {
    ...mapGetters(['treeStructure']),
    ...mapState(['treeSelected', 'treeOpenSection'])
  },
  methods: {
    updateSelection (value) {
      this.$store.commit('updateTreeSelection', value)
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
  components: { CollapsibleTree }
})
</script>
