<template>
  <div id="grid-view">

    <grid-component
      v-if="!isSearchResultEmpty"
      :gridRows="gridRows"
      :gridColumns="gridColumns"
      :gridVariables="gridVariables"
      :gridSelections="gridSelections"
      :isLoading="isGridLoading"
      :isSignedIn="isSignedIn"
      :hideZeroData="hideZeroData"
      :findZeroRowsAndCols="findZeroRowsAndCols"
      :setZeroDataVisibility="setZeroDataVisibility"
      @gridRowToggle="toggleGridRow"
      @gridColumnToggle="toggleGridColumn"
      @gridCellToggle="handleGridCellToggle"
      @gridAllToggle="toggleAll"
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
    ...mapState(['hideZeroData', 'searchTerm', 'subSectionList', 'treeSelected']),
    ...mapGetters([
      'findZeroRowsAndCols', 'gridVariables', 'searchTermQuery', 'rsql', 'gridRows', 'gridColumns', 'gridSelections',
      'numberOfSelectedItems', 'isSignedIn', 'isGridLoading', 'isSearchResultEmpty'
    ])
  },
  methods: {
    ...mapMutations(['toggleGridSelection', 'toggleGridRow', 'toggleGridColumn', 'toggleAll', 'setZeroDataVisibility']),
    ...mapActions(['loadGridVariables', 'loadGridData', 'loadAssessments']),
    handleGridCellToggle (rowIndex, colIndex) {
      this.toggleGridSelection({
        variableId: this.gridVariables[rowIndex].id,
        assessmentId: this.gridColumns[colIndex].id
      })
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
