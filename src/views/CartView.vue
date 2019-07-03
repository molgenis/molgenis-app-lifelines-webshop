<template>
  <div id="cart-view" class="row">
      <div class="col">
        <h3 class="mb-3">3. Order variables</h3>
        <template v-if="selectedVariableIds.length">
           <h5>Selected variables</h5>
           <spinner-animation v-show="loading"/>
           <ul v-if="!loading">
             <li
              v-for="variableId in selectedVariableIds"
              :key="variableId">
              <template v-if="variablesMap[variableId].label">{{variablesMap[variableId].label}}</template>
              <template v-else>{{variablesMap[variableId].name}}</template>
               <span> {{ variableAssesments[variableId] }}</span>
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
import assessmentsRepository from '../repository/assessmentsRepository.ts'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  data: function () {
    return {
      variableAssesments: {},
      assessments: [],
      loading: true
    }
  },
  computed: {
    gridSelection () {
      return this.$store.state.gridSelection
    },
    selectedVariableIds () {
      return Object.keys(this.gridSelection)
    },
    variablesMap () {
      return this.$store.state.variables
    }
  },
  mounted () {
    assessmentsRepository.getAssessments().then((assessments) => {
      for (const [variableId, assessmentIds] of Object.entries(this.gridSelection)) {
        const assessmentNames = assessmentIds.map(assessmentId => assessments[assessmentId].name)
        this.variableAssesments[variableId] = '( ' + assessmentNames.join(',') + ' )'
      }

      this.loading = false
    })
  }
})
</script>
