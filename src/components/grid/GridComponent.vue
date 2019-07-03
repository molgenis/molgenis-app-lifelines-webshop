<template>
  <div id="grid">
    <div class="row">
      <div class="col">
        <table v-if="isLoading && treeSelected!=-1" class="table-loading bg-light">
          <tr>
            <td class="spinner-container">
              <spinner-animation class="spinner mx-auto align-middle"></spinner-animation>
            </td>
          </tr>
        </table>

        <table class="grid-table"
          v-else-if="treeSelected!=-1"
        >
          <tr>
            <th>Variable</th>
            <th :colspan="gridAssessments.length + 1">Assessments</th>
          </tr>
          <tr>
            <th class="w-0"></th>
            <th class="w-0"></th>
            <th
              v-for="assessment in gridAssessments"
              :key="assessment.id"
              class="text-center">
              <div class="assessments-title"><span>{{assessment.name}}</span></div>
            </th>
          </tr>
          <tr>
            <th></th>
            <td>
              <facet-option class="selectAll gridItem">All</facet-option>
            </td>
            <td v-for="assessment in gridAssessments"
                :key="assessment.id">
              <facet-option class="selectCol gridItem">
                <font-awesome-icon icon="arrow-down"/>
              </facet-option>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in grid"
            :key="rowIndex"
          >
            <th>
          <span class="variable-title">
            {{variableName(gridVariables[rowIndex])}}
          </span>
            </th>
            <td>
              <facet-option class="selectRo gridItem">
                <font-awesome-icon icon="arrow-right"/>
              </facet-option>
            </td>
            <td :key="colIndex"
                v-for="(count,colIndex) in row">
              <facet-option
                @facetToggled="toggle(rowIndex, colIndex)"
                :isSelected="gridSelections[rowIndex][colIndex]"
                class="selectItem gridItem">
                {{formatter(count)}}
              </facet-option>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import FacetOption from '../facets/FacetOption.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowRight, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SpinnerAnimation from '../animations/SpinnerAnimation.vue'

library.add(faArrowDown, faArrowRight, faArrowsAlt)

export default Vue.extend({
  components: { FacetOption, FontAwesomeIcon, SpinnerAnimation },
  methods: {
    formatter (num) {
      return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    },
    toggle (rowIndex, colIndex) {
      this.toggleGridSelection({
        variableId: this.gridVariables[rowIndex].id,
        assessmentId: this.gridAssessments[colIndex].id
      })
    },
    ...mapMutations(['toggleGridSelection']),
    ...mapActions(['loadGridVariables', 'loadAssessments', 'loadGridData'])
  },
  computed: {
    ...mapState(['treeSelected', 'gridVariables', 'assessments', 'variantCounts']),
    ...mapGetters(['rsql', 'gridAssessments', 'grid', 'gridSelections']),
    variableName () {
      return variable => variable.label ? variable.label : variable.name
    },
    isLoading () {
      return this.grid.length === 0
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
  created () {
    this.loadAssessments()
    this.loadGridData()
  }
})
</script>

<style scoped>
  table th {
    white-space: nowrap;
    vertical-align: middle;
    font-weight: normal;
  }

  table td, th {
    padding: 0 1px;
  }

  .variable-title {
    max-width: 12rem;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
  }

  .assessments-title {
    height: 6em;
    width: auto;
    position: relative;
  }

  .assessments-title span {
    position: absolute;
    bottom: -1rem;
    left: 1.3rem;
    max-width: 7rem;
    padding-left: 0.7rem;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
    transform: rotate(-60deg);
    transform-origin: 0% 50%;
  }

  .w-0 {
    width: 0;
  }

  button.selectAll {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  button.selectItem {
    border-radius: 0;
  }

  button.selectRow {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button.selectCol {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .spinner {
    width: 100%;
    height: 5%;
  }

  .table-loading {
    position: fixed;
    width: 60%;
    height: 90%;
  }

  .gridItem {
    display: inline-block;
    margin: 2px;
    width: 3.5rem;
  }
</style>
