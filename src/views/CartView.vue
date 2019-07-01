<template>
  <div id="cart-view" class="row">
      <div class="col">
        <h3 class="mb-3">3. Order variables</h3>
        <template v-if="gridSelection.length">
           <h5>Selected variables</h5>
           <spinner-animation v-show="loading"/>
           <ul>
             <li
              v-for="selectedVariable in selectedVariables"
              :key="selectedVariable.id">
              {{selectedVariable.label}}
              </li>
           </ul>
        </template>
         <template v-else>
            <h5>No variables selected</h5>
            <p>Use the shop tab to select variables to order</p>
        </template>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import variableRepository from '../repository/variablesRepository.ts'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  data: function () {
    return {
      selectedVariables: [],
      loading: false
    }
  },
  computed: {
    gridSelection () {
      return Object.keys(this.$store.state.gridSelection)
    }
  },
  mounted () {
    const varIds = this.gridSelection
    this.loading = true
    variableRepository.resolveVariableIds(varIds).then((vars) => {
      this.loading = false
      this.selectedVariables = vars
    })
  }
})
</script>
