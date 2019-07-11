<template>
  <div id="Grid-view">
    <grid-component
    v-if="treeSelected != -1"
    :grid="grid"
    :gridAssessments="gridAssessments"
    :gridVariables="gridVariables"
    :gridSelections="gridSelections"
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
    ...mapState(['treeSelected', 'gridVariables']),
    ...mapGetters(['rsql', 'gridAssessments', 'grid', 'gridSelections'])
  },
  methods: {
    ...mapMutations(['toggleGridSelection', 'toggleGridRow', 'toggleGridColumn', 'toggleAll']),
    ...mapActions(['loadGridVariables', 'loadGridData', 'loadAssessments']),
    handleGridRowToggle (variableId) {
      this.toggleGridRow({
        variableId,
        gridAssessments: this.gridAssessments
      })
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
      this.toggleAll({ gridAssessments: this.gridAssessments })
    }
  },
  watch: {
    treeSelected: function () {
      this.loadGridVariables()
    },
    rsql: function () {
      this.loadGridData()
    }
  },
  created: function () {
    this.loadAssessments()
    this.loadGridData()
  }
})
</script>
