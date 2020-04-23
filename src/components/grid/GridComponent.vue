<template>
  <div id="grid">
    <div v-if="gridRows && (findZeroRowsAndCols.rows.length > 0 || findZeroRowsAndCols.cols.length > 0)">
      <a href="#" v-if="hideZeroData" @click.prevent="setZeroDataVisibility(false)"><font-awesome-icon icon="eye" /> Show {{findZeroRowsAndCols.rows.length}} hidden empty rows and {{findZeroRowsAndCols.cols.length}} columns</a>
      <a href="#" v-else @click.prevent="setZeroDataVisibility(true)"><font-awesome-icon icon="eye-slash" /> Hide {{findZeroRowsAndCols.rows.length}} empty rows and {{findZeroRowsAndCols.cols.length}} columns</a>
    </div>
    <div class="row">
      <div class="col vld-parent">

        <table ref="gridheader" class="grid-header-table" :class="{'sticky':stickyTableHeader}">
          <tr>
            <th class="collapse-holder"></th>
            <th class="variable-column-spacer" ref="varspacer"></th>
            <th></th>
            <th v-for="assessment in gridColumns" :key="assessment.id" class="text-center">
              <div class="assessments-title">
                <span>{{assessment.name}}</span>
              </div>
            </th>
          </tr>
        </table>

        <div :class="{'space-holder':stickyTableHeader || !gridRows}"></div>

        <div class="table-holder">
          <loading
            :active="isLoading"
            loader="dots"
            :is-full-page="false"
            color="var(--secondary)"
            background-color="var(--light)"
          ></loading>

          <div class="empty-columns" v-if="gridRows && !gridColumns.length">
            <h3 class="mg-header">{{$t('lifelines-webshop-no-assessments-found')}}</h3>
          </div>
          <table
            v-else-if="gridRows"
            ref="grid"
            class="grid-table"
            @click.stop="clickGridDelegate"
            :class="{'hover-all-cells': hoverAllCells}"
          >
            <tr>
              <th class="collapse-holder"></th>
              <th class="variable-column"></th>
              <th class="all-toggle grid-toggle">
                <button
                  :disabled="!isSignedIn"
                  class="btn btn-sm btn-outline-secondary t-btn-all-toggle"
                  :class="classes('allSelect')"
                  @click="$emit('gridAllToggle')"
                  @mouseenter="hoverAllCells = true"
                  @mouseleave="hoverAllCells = false"
                >All</button>
              </th>
              <th
                v-for="(assessment, colIndex) in gridColumns"
                :key="assessment.id"
                class="column-toggle grid-toggle"
              >
                <button
                  :disabled="!isSignedIn"
                  class="btn btn-sm btn-outline-secondary t-btn-column-toggle"
                  :data-col="colIndex"
                  :class="classes('columnSelect', {colIndex})"
                >
                  <font-awesome-icon icon="arrow-down" />
                </button>
              </th>
            </tr>

            <template v-for="(row, rowIndex) in gridRows">
              <tr v-if=isVisibleVariable(gridVariables[rowIndex]) :key="rowIndex" >
                <th
                  class="collapse-holder subvariable-line"
                  :class="variableSetClass(gridVariables[rowIndex])"
                  @click="variableSetClickHandler(gridVariables[rowIndex])"
                >
                  <font-awesome-icon
                    class="mb-1"
                    v-if="gridVariables[rowIndex].subvariables && gridVariables[rowIndex].subvariables.length>0"
                    :icon="variableSetIsOpen(gridVariables[rowIndex])?'plus-square':'minus-square'"
                  />
                </th>
                <th
                  class="variable-column"
                  ref="variable"
                  v-b-popover.hover.left.html="popupBody(rowIndex)"
                  :title="popupTitle(rowIndex)"
                  :class="{'selected-variable': rowIndex === selectedRowIndex }"
                >
                  <grid-titel-info
                    :class="{'ml-3': !!gridVariables[rowIndex].subvariableOf}"
                    v-bind="gridVariables[rowIndex]"
                  />
                </th>
                <th class="row-toggle grid-toggle">
                  <button
                    :disabled="!isSignedIn"
                    class="btn btn-sm select-row btn-outline-secondary t-btn-row-toggle"
                    :data-row="rowIndex"
                    :class="classes('rowSelect', {rowIndex})"
                  >
                    <font-awesome-icon icon="arrow-right" />
                  </button>
                </th>
                <td class="cell" :key="colIndex" v-for="(count,colIndex) in row">
                  <button
                    :disabled="!isSignedIn"
                    :data-col="colIndex"
                    :data-row="rowIndex"
                    :class="classes('cell', {rowIndex, colIndex})"
                    class="btn btn-sm t-btn-cell-toggle"
                  >{{count | formatCount}}</button>
                </td>
              </tr>

            </template>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Loading from 'vue-loading-overlay'
import GridTitelInfo from './GridTitelInfo.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowDown,
  faArrowRight,
  faArrowsAlt,
  faPlusSquare,
  faMinusSquare,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { formatCount } from '@/filters/GridComponentFilters'

library.add(faArrowDown, faArrowRight, faArrowsAlt, faMinusSquare, faPlusSquare, faEye, faEyeSlash)

export default Vue.extend({
  name: 'GridComponent',
  components: { FontAwesomeIcon, Loading, GridTitelInfo },
  props: {
    gridRows: {
      type: Array,
      required: false
    },
    gridColumns: {
      type: Array,
      required: true
    },
    gridVariables: {
      type: Array,
      required: false
    },
    gridSelections: {
      type: Array,
      required: false
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    isSignedIn: {
      type: Boolean,
      required: true
    },
    hideZeroData: {
      type: Boolean,
      default: () => true
    },
    findZeroRowsAndCols: {
      type: Object,
      default: () => { return { cols: [], rows: [] } }
    },
    setZeroDataVisibility: {
      type: Function,
      default: () => () => {}
    }
  },
  computed: {
    gridMarkers: function () {
      const selected = { all: true, row: [], col: [] }
      if (!this.gridRows.length) {
        return selected
      }
      selected.col = this.gridRows[0].map(i => true)

      this.gridRows.forEach((row, i) => {
        selected.row[i] = true
        row.forEach((col, j) => {
          if (!this.gridSelections[i][j]) {
            selected.col[j] = false
            selected.row[i] = false
            selected.all = false
          }
        })
      })
      return selected
    }
  },
  data: function () {
    return {
      hoverAllCells: false,
      stickyTableHeader: false,
      dialogInfo: null,
      selectedRowIndex: '',
      openVariableSets: []
    }
  },
  filters: {
    formatCount
  },
  methods: {
    variableSetIsOpen (variable) {
      return (
        variable.subvariables &&
        variable.subvariables.length > 0 &&
        this.openVariableSets.includes(variable.id)
      )
    },
    variableSetClickHandler (variable) {
      if (variable.subvariables && variable.subvariables.length > 0) {
        if (this.variableSetIsOpen(variable)) {
          this.openVariableSets = this.openVariableSets.filter(
            varid => varid !== variable.id
          )
        } else {
          this.openVariableSets.push(variable.id)
        }
      }
    },
    isVisibleVariable (variable) {
      if (
        variable.subvariableOf &&
        this.openVariableSets.includes(variable.subvariableOf.id)
      ) {
        return false
      }
      return true
    },
    variableSetClass (variable) {
      if (this.openVariableSets.includes(variable.id)) {
        return 'closed'
      }
      if (variable.subvariableOf) {
        const index = this.gridVariables.findIndex(
          varid => varid.id === variable.id
        )
        if (
          index + 1 < this.gridVariables.length &&
          this.gridVariables[index + 1] &&
          !this.gridVariables[index + 1].subvariableOf
        ) {
          return 'end'
        }
        return 'line'
      }
      if (
        variable &&
        variable.subvariables &&
        variable.subvariables.length > 0
      ) {
        return 'start'
      }
    },
    classes (target, context) {
      const classes = {}

      if (target === 'allSelect') {
        if (this.gridMarkers.all) {
          classes['active'] = true
        }
      } else if (target === 'columnSelect') {
        classes['active'] = this.gridMarkers.col[context.colIndex]
      } else if (target === 'rowSelect') {
        classes['active'] = this.gridMarkers.row[context.rowIndex]
      } else if (target === 'cell') {
        const cell = !!this.gridSelections[context.rowIndex][context.colIndex]
        if (cell) {
          classes['btn-secondary'] = true
        } else {
          classes['btn-outline-secondary'] = true
        }
      }
      return classes
    },
    clickGridDelegate: function (e) {
      const button = e.target.closest('button')
      if (!button) {
        return
      }
      const data = button.dataset

      if (data.col || data.row) {
        if (data.col && data.row) {
          this.$emit('gridCellToggle', parseInt(data.row), parseInt(data.col))
        } else if (data.col && !data.row) {
          this.$emit('gridColumnToggle', this.gridColumns[data.col].id)
        } else if (!data.col && data.row) {
          const variable = this.gridVariables[parseInt(data.row)]
          this.$emit('gridRowToggle', variable.id)
        }
      }
    },
    scroll () {
      const table = this.getTableTop()
      const header = this.getHeaderHeight()
      if (table && header) {
        this.stickyTableHeader = table - header < 112 // 7rem @ 16px basesize
      }

      // Update grid header offset to compansate for horizontal scrollbar
      // This is needed due to use of absolute positioning used for foating header
      if (this.$refs.gridheader && this.$refs.gridheader.className.indexOf('sticky') > -1) {
        const left = window.pageXOffset || document.documentElement.scrollLeft
        this.$refs.gridheader.style.marginLeft = '-' + left + 'px'
      } else {
        this.$refs.gridheader.style.marginLeft = '0px'
      }
    },
    /**
     * Find largest variable width
     * and use this as the header offSet to align column headers.
    **/
    setGridHeaderSpacer () {
      const elemArray = this.$refs.variable ? [].slice.call(this.$refs.variable) : []
      let maxSize = -1 // 16px basesize
      elemArray.forEach((elem) => {
        if (elem.offsetWidth > maxSize) {
          maxSize = elem.offsetWidth
        }
      })
      this.$refs.varspacer.style.width = maxSize + 'px'
    },
    getTableTop () {
      return this.$refs.grid
        ? this.$refs.grid.getBoundingClientRect().top
        : null
    },
    getHeaderHeight () {
      return this.$refs.gridheader.getBoundingClientRect().height
    },
    closeVariableSet () {
      if (this.gridVariables) {
        this.gridVariables.forEach(variable => {
          if (
            variable.subvariables &&
            variable.subvariables.length > 0 &&
            !this.openVariableSets.includes(variable.id)
          ) {
            this.openVariableSets.push(variable.id)
          }
        })
      }
    },
    popupTitle (rowIndex) {
      return this.gridVariables[rowIndex].name
    },
    popupBody (rowIndex) {
      let optonsHtml = ''
      if (this.gridVariables[rowIndex].options) {
        optonsHtml = this.gridVariables[rowIndex].options.map((option) => {
          return `<div>${option['label_en']}</div>`
        }).join('')
      }

      return `
      <div>
        <strong>Description (en):</strong>
        <p>${this.gridVariables[rowIndex].definitionEn}</p>
        <strong>Description (nl):</strong>
        <p>${this.gridVariables[rowIndex].definitionNl}</p>
        <strong>Categorical values (en):</strong>
        ${optonsHtml}
      </div>`
    }
  },
  watch: {
    // Start with all grouped variables closed
    gridVariables: function () {
      this.closeVariableSet()
    },
    gridRows: function () {
      this.$nextTick(this.setGridHeaderSpacer)
    }
  },
  created: function () {
    window.addEventListener('scroll', this.scroll)
    this.closeVariableSet()
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.scroll)
  }
})
</script>

<style lang="scss" scoped>
.empty-columns {
  padding: 1rem 0;

  .mg-header {
    color: $gray-500;
  }
}

.selected-variable div {
  pointer-events: none;
  position: relative;
  z-index: $zindex-modal;

  &::before {
    @include box-shadow;
    background-color: #fff;
    border-radius: 3px;
    bottom: -0.4rem;
    content: "";
    left: -0.5rem;
    position: absolute;
    right: 0.7rem;
    top: -0.4rem;
    z-index: -1; // move behind parent, because of absolute position (creating a new stacking context)
  }
}

table {
  overflow: hidden;
  position: relative;

  .variable-column {
    cursor: pointer;
    max-width: 22rem;
    min-width: 5rem;
  }

  td,
  th:not(:nth-child(2)) {
    max-width: 4rem;
    min-width: 4rem;
    width: 4rem;
  }

  th {
    font-weight: normal;
    vertical-align: middle;
    white-space: nowrap;

    &.collapse-holder {
      max-width: 3rem;
      min-width: 3rem;
      width: 3rem;

      svg {
        left: 0.5rem;
        position: relative;
        top: 0.3rem;

        path {
          fill: $primary;
        }
      }
    }
  }
}

.vld-overlay.is-active {
  margin: -1rem;
}

.table-holder {
  display: inline-block;
  min-height: 300px;
  min-width: 500px;
  position: relative;
}

.sticky {
  background: linear-gradient(180deg,
  rgba(255, 255, 255, 1) 0%,
  rgba(255, 255, 255, 0.9) 75%,
  rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  position: fixed;
  top: 7rem;
  z-index: $zindex-sticky;

  .assessments-title {
    height: 8rem;
  }

  .assessments-title span {
    bottom: 1rem;
  }
}

.space-holder {
  height: 6em;
}

table td,
th {
  padding: 0 1px;
  position: relative;
}

.grid-table {
  tr {
    &:not(:first-child):hover {
      background-color: $light;
    }
  }

  &.hover-all-cells {
    td,
    th:not(:nth-child(1)):not(:nth-child(2)) {
      background-color: $light;
    }

    tr:first-child {
      th:not(:nth-child(1)):not(:nth-child(2)) {
        background-color: $light;
      }
    }
  }

  td:hover::after,
  th:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):hover::after {
    background-color: $light;
    content: "";
    display: inline-block;
    height: 10000px;
    left: 0;
    position: absolute;
    right: 0;
    top: -5000px;
    z-index: -1;
  }

  button {
    display: block;
    height: 100%;
    margin: 1px;
    width: 100%;
  }
}

.assessments-title {
  height: 6em;
  position: relative;
  width: auto;

  span {
    bottom: -1rem;
    display: inline-block;
    left: 1.3rem;
    max-width: 7rem;
    overflow: hidden;
    padding-left: 0.7rem;
    position: absolute;
    text-align: right;
    text-overflow: ellipsis;
    transform: rotate(-60deg);
    transform-origin: 0% 50%;
    white-space: nowrap;
  }
}

.w-0 {
  width: 0;
}

.cell {
  button {
    border-radius: 0;
  }
}

.grid-toggle {
  button {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;

    &[disabled] {
      display: none;
    }
  }
}

.all-toggle {
  button {
    border-bottom-left-radius: 0;
  }
}

.subvariable-line {
  &.closed,
  &.start {
    cursor: pointer;
  }
}
</style>
