<template>
  <div id="grid">
    <div class="row">
      <div class="col vld-parent grid-col">
        <loading :active="isLoading" loader="dots" :is-full-page="false" color="var(--secondary)" background-color="var(--light)"></loading>

        <table
          class="grid-table"
               :class="{'sticky':stickyTableHeader}"
        >
          <tr>
            <th>
            </th>
            <td></td>
            <td
              v-for="assessment in gridAssessments"
              :key="assessment.id"
              class="text-center">
              <div class="assessments-title"><span>{{assessment.name}}</span></div>
            </td>
          </tr>
        </table>
        <div :class="{'space-holder':stickyTableHeader}"></div>

        <table class="grid-table col-hover" v-if="!isLoading">
          <tr>
            <th></th>
            <td>
              <button class="ll-facet-option btn btn-sm selectAll gridItem btn-outline-secondary"
                      @click.prevent="toggleGrid"
                      @mouseenter="onMouseEnter('gridItem')"
                      @mouseleave="onMouseLeave('gridItem')">
                All
              </button>
            </td>
            <td v-for="(assessment, colIndex) in gridAssessments"
                :key="assessment.id"
            >
              <button class="ll-facet-option btn btn-sm selectCol gridItem btn-outline-secondary"
                      @click.prevent="toggleColumn(assessment.id)"
                      @mouseenter="onMouseEnter('grid-button-col-'+colIndex)"
                      @mouseleave="onMouseLeave('grid-button-col-'+colIndex)">
                <font-awesome-icon icon="arrow-down"/>
              </button>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in grid"
            :class="'grid-row-'+rowIndex"
            class="row-hover"
            :key="rowIndex"

          >
            <th>
              <span class="variable-title">
                {{variableName(gridVariables[rowIndex])}}
              </span>
            </th>
            <td>
              <button class="ll-facet-option btn btn-sm selectRow gridItem btn-outline-secondary"
                      @click.prevent="toggleRow(gridVariables[rowIndex].id)"
                      @mouseenter="onMouseEnter('grid-button-row-'+rowIndex)"
                      @mouseleave="onMouseLeave('grid-button-row-'+rowIndex)">
                <font-awesome-icon icon="arrow-right"/>
              </button>
            </td>
            <td :key="colIndex"
                v-for="(count,colIndex) in row"
            >
              <button
                @click.prevent="toggleCell(rowIndex, colIndex)"
                :class="getGridCellClass(rowIndex, colIndex)"
                class="ll-facet-option btn btn-sm selectItem gridItem">
                {{count | formatSI}}
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// Import component
import Loading from 'vue-loading-overlay'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowRight, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// @ts-ignore
import { formatSI } from 'format-si-prefix'

library.add(faArrowDown, faArrowRight, faArrowsAlt)

export default Vue.extend({
  name: 'GridComponent',
  components: { FontAwesomeIcon, Loading },
  props: {
    grid: {
      type: Array,
      required: true
    },
    gridAssessments: {
      type: Array,
      required: true
    },
    gridVariables: {
      type: Array,
      required: true
    },
    gridSelections: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      stickyTableHeader: false
    }
  },
  methods: {
    scroll () {
      const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
      if (scrollTop > 170) this.stickyTableHeader = true
      else this.stickyTableHeader = false
    },
    onMouseEnter (className) {
      const collection = Array.from(document.getElementsByClassName(className))
      collection.forEach((button) => button.classList.add('gridHover'))
    },
    onMouseLeave (className) {
      const collection = Array.from(document.getElementsByClassName(className))
      collection.forEach((button) => button.classList.remove('gridHover'))
    },
    toggleRow (variableId) {
      this.$emit('gridRowToggle', variableId)
    },
    toggleColumn (assessmentId) {
      this.$emit('gridColumnToggle', assessmentId)
    },
    toggleCell (rowIndex, colIndex) {
      this.$emit('gridCellToggle', rowIndex, colIndex)
    },
    toggleGrid () {
      this.$emit('gridAllToggle')
    },
    getGridCellClass (rowIndex, colIndex) {
      const selected = !!this.gridSelections[rowIndex][colIndex]
      const selectedClass = selected ? 'btn-secondary' : 'btn-outline-secondary'
      const colClass = ' grid-button-col-' + colIndex
      const rowClass = ' grid-button-row-' + rowIndex
      return selectedClass + rowClass + colClass
    }
  },
  created: function () {
    window.addEventListener('scroll', this.scroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.scroll)
  },
  computed: {
    variableName () {
      return variable => variable.label ? variable.label : variable.name
    },
    isLoading () {
      return this.grid.length === 0
    }
  },
  filters: { formatSI }
})
</script>

<style scoped lang="scss">
  @import "../../scss/variables";

  table {
    overflow: hidden;
    position: relative;
  }
  table th:first-child {
    width: 15rem;
    max-width: 15rem;
    overflow: hidden;
  }
  table td,
  table th:not(:first-child) {
    width: 4rem;
    max-width: 4rem;
    min-width: 4rem;
  }
  table th {
    white-space: nowrap;
    vertical-align: middle;
    font-weight: normal;
  }
  .sticky {
    position: fixed;
    top: 0;
    background-color: white;
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);
    z-index: 1030;
  }
  .sticky .assessments-title {
    height: 8rem;
  }
  .sticky .assessments-title span {
    bottom: 1rem;
  }
  .space-holder {
    height: 6em;
  }
  table td, th {
    padding: 0 1px;
    position: relative;
  }
  .col-hover td:hover::after {
    content: "";
    left: 0;
    right: 0;
    display: inline-block;
    position: absolute;
    background-color: $light;
    top: -5000px;
    height: 10000px;
    z-index: -1;
  }
  .variable-title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
    vertical-align: middle;
    padding-left: 1rem;
  }
  .assessments-title {
    height: 6em;
    width: auto;
    position: relative;
  }
  .assessments-title span {
    white-space: nowrap;
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
  .gridItem {
    display: block;
    width: 100%;
    height: 100%;
    margin: 1px;
  }
  .gridHover {
    color: white;
    background-color: $secondary;
    border-color: $secondary;
  }
  .grid-col {
    height: 90vh;
  }
</style>
