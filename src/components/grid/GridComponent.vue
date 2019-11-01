<template>
  <div id="grid" class="variable-grid">
    <div class="row">
      <div class="col vld-parent grid-col">
        <loading :active="isLoading" loader="dots" :is-full-page="false" color="var(--secondary)" background-color="var(--light)"></loading>

        <table
          ref="gridheader"
          class="grid-table"
               :class="{'sticky':stickyTableHeader}"
        >
          <tr>
            <th>
            </th>
            <td v-show="isSignedIn" ></td>
            <td
              v-for="assessment in gridAssessments"
              :key="assessment.id"
              class="text-center">
              <div class="assessments-title"><span>{{assessment.name}}</span></div>
            </td>
          </tr>
        </table>
        <div :class="{'space-holder':stickyTableHeader}"></div>

        <table ref="grid" class="grid-table col-hover" v-if="!isLoading && grid.length">
          <tr>
            <th></th>
            <td>
              <button
                id="grid-toggle-all-btn"
                v-show="isSignedIn"
                class="ll-facet-option btn btn-sm select-all grid-item btn-outline-secondary"
                @click.prevent="isSignedIn && toggleGrid()"
                @mouseenter="onMouseEnter('grid-item')"
                @mouseleave="onMouseLeave('grid-item')">
                All
              </button>
            </td>
            <td v-show="isSignedIn" v-for="(assessment, colIndex) in gridAssessments"
                :key="assessment.id"
            >
              <button class="ll-facet-option btn btn-sm select-col grid-item btn-outline-secondary"
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
              <grid-titel-info :info="gridVariables[rowIndex]" />
            </th>
            <td v-show="isSignedIn">
              <button class="ll-facet-option btn btn-sm select-row grid-item btn-outline-secondary"
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
                @click.prevent="isSignedIn && toggleCell(rowIndex, colIndex)"
                :class="getGridCellClass(rowIndex, colIndex)"
                class="ll-facet-option btn btn-sm select-item grid-item">
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
import GridTitelInfo from './GridTitelInfo.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowRight, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// @ts-ignore
import { formatSI } from 'format-si-prefix'

library.add(faArrowDown, faArrowRight, faArrowsAlt)

export default Vue.extend({
  name: 'GridComponent',
  components: { FontAwesomeIcon, Loading, GridTitelInfo },
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
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    isSignedIn: {
      type: Boolean,
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
      const table = this.getTableTop()
      const header = this.getHeaderHeight()
      if (table && header) {
        this.stickyTableHeader = table - header < 60
      }
    },
    getTableTop () {
      return this.$refs.grid ? this.$refs.grid.getBoundingClientRect().top : null
    },
    getHeaderHeight () {
      return this.$refs.gridheader ? this.$refs.gridheader.getBoundingClientRect().height : null
    },
    onMouseEnter (className) {
      const collection = Array.from(document.getElementsByClassName(className))
      collection.forEach((button) => button.classList.add('grid-hover'))
    },
    onMouseLeave (className) {
      const collection = Array.from(document.getElementsByClassName(className))
      collection.forEach((button) => button.classList.remove('grid-hover'))
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
    min-width: 15rem;
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
    pointer-events: none;
    position: fixed;
    top: 60px;
    background-color: white;
    background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);
    z-index: 1020;
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
  .row-hover:hover {
    background-color: $light;
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
  button.select-all {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  button.select-item {
    border-radius: 0;
  }
  button.select-row {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button.select-col {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .grid-item {
    display: block;
    width: 100%;
    height: 100%;
    margin: 1px;
  }
  .grid-hover {
    color: white;
    background-color: $secondary;
    border-color: $secondary;
  }
</style>
