<template>
  <div id="cart-view" class="row">
      <div class="col">
        <template v-if="gridSelection.length">
           <h3>Selected variables</h3>
           <ul>
             <li
              v-for="selectedVariable in selectedVariables"
              :key="selectedVariable.id">
              {{selectedVariable.label}}
              </li>
           </ul>
        </template>
        <h3 v-else>No variables</h3>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import variableRepository from '../repository/variablesRepository.ts'

export default Vue.extend({
  name: 'CartView',
  data: function () {
    return {
      selectedVariables: []
    }
  },
  computed: {
    gridSelection () {
      return Object.keys(this.$store.state.gridSelection)
    }
  },
  mounted () {
    const varIds = this.gridSelection
    variableRepository.resolveVariableIds(varIds).then((vars) => {
      this.selectedVariables = vars
    })
  }
})
</script>
