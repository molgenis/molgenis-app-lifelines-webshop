<template>
  <div id="cart-view" class="row">
    <div class="col">
      <h3 class="mb-3">3. Order variables</h3>
      <template v-if="selectedVariableIds.length">
        <h5>Selected variables</h5>
        <spinner-animation v-show="loading" />
        <ul v-if="!loading">
          <li v-for="variableId in selectedVariableIds" :key="variableId">
            <template v-if="variablesMap[variableId].label">{{variablesMap[variableId].label}}</template>
            <template v-else>{{variablesMap[variableId].name}}</template>
            <span>{{ variableAssesments[variableId] }}</span>
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

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  computed: {
    gridSelection () {
      return this.$store.state.gridSelection
    },
    selectedVariableIds () {
      return Object.keys(this.gridSelection)
    },
    variablesMap () {
      return this.$store.state.variables
    },
    assessmentsMap () {
      return this.$store.state.assessments
    },
    variableAssesments () {
      let variableAssesmentsStings = {}
      for (const [variableId, assessmentIds] of Object.entries(
        this.gridSelection
      )) {
        const assessmentNames = assessmentIds.map(
          assessmentId => this.assessmentsMap[assessmentId].name
        )
        variableAssesmentsStings[variableId] =
          '( ' + assessmentNames.join(', ') + ' )'
      }

      return variableAssesmentsStings
    },
    loading () {
      return !(
        Object.keys(this.assessmentsMap).length &&
        Object.keys(this.variablesMap).length
      )
    }
  }
})
</script>
