<template>
  <div id="grid">
    <table
      v-if="treeSelected!=-1"
    >
      <tr>
        <th scope="col">Variable</th>
        <th scope="col" :colspan="gridAssessments.length + 1">Collection Round</th>
      </tr>
      <tr>
        <th class="w-0"></th>
        <th class="w-0"></th>
        <th
          v-for="assessment in gridAssessments"
          :key="assessment.id"
          class="text-center">
          {{assessment.name}}
        </th>
      </tr>
      <tr>
        <th scope="row"></th>
        <td>
          <facet-option class="selectAll">All</facet-option>
        </td>
        <td v-for="assessment in gridAssessments"
            :key="assessment.id">
          <facet-option class="selectCol"><font-awesome-icon icon="arrow-down" /></facet-option>
        </td>
      </tr>

      <tr
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
      >
        <th scope="row">
          {{variables[rowIndex].label}}
        </th>
        <td>
          <facet-option class="selectRow"><font-awesome-icon icon="arrow-right" /></facet-option>
        </td>
        <td :key="colIndex"
            v-for="(cell,colIndex) in row">
          <facet-option
            @facetToggled="toggle(rowIndex, colIndex)"
            class="selectItem"
            :isSelected="cell.selected">
            {{cell.count}}
            </facet-option>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import FacetOption from '../facets/FacetOption.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowRight, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowDown, faArrowRight, faArrowsAlt)

export default Vue.extend({
  components: { FacetOption, FontAwesomeIcon },
  methods: {
    toggle (rowIndex, colIndex) {
      this.toggleGridSelection({
        variableId: this.variables[rowIndex].id,
        assessmentId: this.gridAssessments[colIndex].id
      })
    },
    ...mapMutations(['toggleGridSelection']),
    ...mapActions(['loadVariables', 'loadAssessments', 'loadGridData'])
  },
  computed: {
    ...mapState(['treeSelected', 'variables', 'assessments', 'variantCounts']),
    ...mapGetters(['rsql', 'gridAssessments', 'grid'])
  },
  watch: {
    treeSelected: function () {
      this.loadVariables()
    },
    rsql: function () {
      this.loadGridData()
    }
  },
  created () {
    this.loadAssessments()
  }
})
</script>

<style scoped>
  table th {
    white-space: nowrap;
    vertical-align: middle;
  }
  table td, th{
    padding: 0 1px;
  }
  .w-0 {
    width: 0;
  }
  button{
    display: inline-block;
    margin: 2px;
    width: 50px;
  }
  button.selectAll{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  button.selectItem{
    border-radius: 0;
  }
  button.selectRow{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button.selectCol{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
