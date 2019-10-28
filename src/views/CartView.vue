<template>
  <div id="cart-view" class="row">
    <div class="col">
      <h3>{{ 'lifelines-webshop-cart-header' | i18n }}</h3>
      <template v-if="selectedVariableIds.length">
        <div class="mb-3" v-if="selectedVariableIds.length > 0">
          <button type="button" class="btn btn-primary save" @click="save">Save</button>
          <button type="button" class="btn btn-warning ml-2">Order</button>
        </div>
        <h5>Selected variables</h5>
        <spinner-animation v-show="loading" />
        <ul v-if="!loading">
          <li v-for="variableId in selectedVariableIds" :key="variableId">
            <template v-if="variablesMap[variableId].label">{{variablesMap[variableId].label}}</template>
            <template v-else>{{variablesMap[variableId].name}}</template>
            <span>{{ variableAssesments[variableId] }}</span>
          </li>
        </ul>
        <div class="mb-3" v-if="selectedVariableIds.length > 10">
          <button type="button" class="btn btn-primary" @click="save">Save</button>
          <button type="button" class="btn btn-warning ml-2" >Order</button>
        </div>
      </template>
      <template v-else>
        <h5>No variables selected</h5>
        <p v-if="isSignedIn">Use the shop tab to select variables to order</p>
        <p v-else>Sign in to select and order variables</p>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  methods: {
    ...mapActions(['save'])
  },
  computed: {
    ...mapState(['isSignedIn']),
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
