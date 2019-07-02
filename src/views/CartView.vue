<template>
  <div id="cart-view" class="row">
      <div class="col">
        <h3 class="mb-3">3. Order variables</h3>
        <template v-if="selectedVariableIds.length">
           <h5>Selected variables</h5>
           <spinner-animation v-show="loading"/>
           <ul>
             <li
              v-for="selectedVariable in selectedVariables"
              :key="selectedVariable.id">
              <template v-if="selectedVariable.label">{{selectedVariable.label}}</template>
              <template v-else>{{selectedVariable.name}}</template>
               <span> {{ varAssesments(selectedVariable.id) }}</span>
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
import assessmentsRepository from '../repository/assessmentsRepository.ts'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  data: function () {
    return {
      selectedVariables: [],
      assessments: [],
      loading: false
    }
  },
  computed: {
    gridSelection () {
      return this.$store.state.gridSelection
    },
    selectedVariableIds () {
      return Object.keys(this.gridSelection)
    },
    variableAssesments () {
      let assessments = {}

      for (const [variableId, assessmentIds] of Object.entries(this.gridSelection)) {
        const assessmentNames = assessmentIds.map(assessmentId => this.assessments[assessmentId].name)
        assessments[variableId] = '( ' + assessmentNames.join(',') + ' )'
      }

      return assessments
    }
  },
  methods: {
    varAssesments (variableId) {
      return this.variableAssesments[variableId]
    }
  },
  mounted () {
    this.loading = true
    variableRepository.resolveVariableIds(this.selectedVariableIds).then((vars) => {
      this.loading = false
      this.selectedVariables = vars
    })

    assessmentsRepository.getAssessments().then((assessments) => {
      this.assessments = assessments
    })
  }
})
</script>
