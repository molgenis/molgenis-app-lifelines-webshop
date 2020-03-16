<template>
  <div id="grid-view">

    <grid-component
      v-if="!isSearchResultEmpty"
      :gridAssessments="gridAssessments"
      :gridVariables="gridVariables"
      :gridSelections="gridSelections"
      :isLoading="isGridLoading"
      :isSignedIn="isSignedIn"
      @gridRowToggle="handleGridRowToggle"
      @gridColumnToggle="handleGridColumnToggle"
      @gridCellToggle="handleGridCellToggle"
      @gridAllToggle="handleGridAllToggle"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import GridComponent from '../components/grid/GridComponent.vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'GridView',
  components: { GridComponent },
  computed: {
    ...mapState(['gridVariables', 'searchTerm', 'subSectionList', 'treeSelected']),
    ...mapGetters([
      'searchTermQuery', 'rsql', 'gridAssessments', 'gridAssessmentsActive', 'gridSelections',
      'numberOfSelectedItems', 'isSignedIn', 'isGridLoading', 'isSearchResultEmpty'
    ])
  },
  methods: {
    ...mapMutations(['toggleGridSelection', 'toggleGridRow', 'toggleGridColumn', 'toggleAll']),
    ...mapActions(['loadGridVariables', 'loadGridData', 'loadAssessments']),
    handleGridRowToggle (variableId) {
      this.toggleGridRow({ variableId, gridAssessmentsActive: this.gridAssessmentsActive })
    },
    handleGridColumnToggle (assessmentId) {
      this.toggleGridColumn({ assessmentId })
    },
    handleGridCellToggle (rowIndex, colIndex) {
      this.toggleGridSelection({
        variableId: this.gridVariables[rowIndex].id,
        assessmentId: this.gridAssessments[colIndex].id
      })
    },
    handleGridAllToggle () {
      this.toggleAll(this.gridAssessmentsActive)
    }
  },
  watch: {
    searchTermQuery: function () {
      this.loadGridVariables()
    },
    rsql: function () {
      this.loadGridData()
    }
  },
  created: function () {
    this.loadGridData()
  }
})
</script>
