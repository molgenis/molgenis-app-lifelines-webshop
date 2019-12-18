<template>
  <div id="cart-view">

    <h3 class="h4">{{$t('lifelines-webshop-cart-header')}}</h3>

    <spinner-animation v-if="loading" />

    <div v-if="selectedVariableIds.length === 0">
      <h4 class="h5">No variables selected</h4>
      <p v-if="isSignedIn">{{$t('lifelines-webshop-cart-info-msg')}}</p>
      <p v-else>{{$t('lifelines-webshop-cart-not-signedin-msg')}}</p>
    </div>

    <div v-else class="mt-3 mb-3" role="tablist">
      <button type="button" class="btn btn-primary save" @click="onSave">{{$t('lifelines-webshop-save-btn-label')}}</button>
      <router-link
            class="btn btn-warning ml-2"
            type="button"
            to="/order"
            tag="button">
        {{$t('lifelines-webshop-order-btn-label')}}
      </router-link>

      <h4 class="h5 mt-3">{{$t('lifelines-webshop-cart-selected-list-header')}}</h4>

      <b-card no-body class="mb-1" v-for="(section, index) in cartTree" :key="section.id">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block href="#" v-b-toggle="`accordion-${index}`" variant="info">{{section.name}}</b-button>
        </b-card-header>

        <!-- Don't use the same accordion index, so all items can be expanded at the same time -->
        <b-collapse :visible="index === 0" :id="`accordion-${index}`" :accordion="`my-accordion-${index}`" role="tabpanel">
          <b-card-body>
            <div v-for="subsection in section.subsections" :key="subsection.id">
                <h5 class="h6">{{subsection.name}}</h5>
              <ul>
                <li v-for="variable in subsection.variables" :key="variable.id">
                  <span>{{variable.label||variable.name}} {{ variableAssesments[variable.id] }}</span></li>
              </ul>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <div class="mb-3" v-if="selectedVariableIds.length > 10">
      <button type="button" class="btn btn-primary save" @click="onSave">{{$t('lifelines-webshop-save-btn-label')}}</button>
      <router-link
            class="btn btn-warning ml-2"
            type="button"
            to="/order"
            tag="button">
        {{$t('lifelines-webshop-order-btn-label')}}
      </router-link>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation },
  methods: {
    ...mapActions(['save']),
    async onSave () {
      const orderNumber = await this.save()
      this.$router.push({ name: 'load', params: { orderNumber } })
    }
  },
  computed: {
    ...mapGetters(['cartTree', 'isSignedIn']),
    ...mapState(['gridSelection', 'variables', 'assessments']),
    selectedVariableIds () {
      return Object.keys(this.gridSelection)
    },
    variableAssesments () {
      let variableAssesmentsStings = {}
      for (const [variableId, assessmentIds] of Object.entries(
        this.gridSelection
      )) {
        const assessmentNames = assessmentIds.map(
          assessmentId => this.assessments[assessmentId].name
        )
        variableAssesmentsStings[variableId] =
          '( ' + assessmentNames.join(', ') + ' )'
      }

      return variableAssesmentsStings
    },
    loading () {
      return !(Object.keys(this.assessments).length && Object.keys(this.variables).length)
    }
  }
})
</script>

<style lang="scss">
  .card {
    ul {
      font-size: 0.9rem;
      list-style: none;
      padding: 0;
    }
  }
</style>
