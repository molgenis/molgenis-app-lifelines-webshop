<template>
  <div id="grid">
    <table
      v-if="treeSelected!=-1"
    >
      <tr>
        <th scope="col">Variable</th>
        <th scope="col" style="width:100%">Collection Round</th>
      </tr>
      <tr>
        <th scope="row"></th>
        <td>
          <facet-option class="selectAll">All</facet-option>
          <facet-option class="selectCol"><font-awesome-icon icon="arrow-down" /></facet-option>
          <facet-option class="selectCol"><font-awesome-icon icon="arrow-down" /></facet-option>
          <facet-option class="selectCol"><font-awesome-icon icon="arrow-down" /></facet-option>
          <facet-option class="selectCol"><font-awesome-icon icon="arrow-down" /></facet-option>
        </td>
      </tr>

      <tr
        v-for="variable in variables"
        :key="variable.id"
      >
        <th scope="row">{{variable.label}}</th>
        <td>
          <facet-option class="selectRow"><font-awesome-icon icon="arrow-right" /></facet-option>
          <facet-option @click="toggle(variable.id, 0)" class="selectItem">1</facet-option>
          <facet-option @click="toggle(variable.id, 1)" class="selectItem">5</facet-option>
          <facet-option @click="toggle(variable.id, 2)" class="selectItem">0</facet-option>
          <facet-option @click="toggle(variable.id, 3)" class="selectItem">4</facet-option>
        </td>
      </tr>

    </table>
    <dl>
      <dt>variables</dt><dd>{{ variables.map(it => it.name) }}</dd>
      <dt>rsql</dt><dd>{{ rsql }}</dd>
      <dt>variantCounts</dt><dd>{{ variantCounts }}</dd>
      <dt>gridAssessments</dt><dd>{{ gridAssessments }}</dd>
      <dt>grid</dt><dd>{{grid}}</dd>
    </dl>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import FacetOption from '../components/facets/FacetOption.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowRight, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowDown, faArrowRight, faArrowsAlt)

export default Vue.extend({
  components: { FacetOption, FontAwesomeIcon },
  methods: {
    toggle: (variableId, variantId) => {
      //this.$store.state.gridSelection!=this.$store.state.gridSelection
    },
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
    padding: 0 2px;
  }
  button{
    display: inline-block;
    margin: 2px;
    width: 50px;
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
