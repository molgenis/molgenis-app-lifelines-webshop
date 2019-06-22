<template>
  <div id="Sidebar-view">
    <h3>{{ 'lifelines-webshop-sidebar-header' | i18n }}</h3>
    <ul class="list-unstyled">
      <li>
        <age-facet
        facetId="age"
        label="Age"
        :ageGroupOptions="ageGroupOptions"
        :ageAtOptions="ageAtOptions"
        v-model="selectedAgeAt" />
      </li>
      <li>
        <range-facet
        facetId="yob"
        label="Year of birth"
        :min="1900" :max="2050"
        v-model="selectedAgeRange"/>
      </li>
      <li>
        <toggle-facet
        facetId="gender"
        label="Gender"
        :options="genderOptions"
        v-model="selectedGenderOptions" />
      </li>
      <li>
        <toggle-facet
        facetId="cohort"
        label="Subcohorts"
        :options="subcohortOptions"
        v-model="selectedSubcohortOptions" />
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import ToggleFacet from '../components/facets/ToggleFacet.vue'
import AgeFacet from '../components/facets/AgeFacet.vue'
import RangeFacet from '../components/facets/RangeFacet.vue'
import { mapMutations } from 'vuex'

export default Vue.extend({
  name: 'SidebarView',
  components: { ToggleFacet, AgeFacet, RangeFacet },
  computed: {
    genderOptions () {
      return this.$store.state.genderOptions
    },
    subcohortOptions () {
      return this.$store.state.subcohortOptions
    },
    ageGroupOptions () {
      return this.$store.state.ageGroupOptions
    },
    ageAtOptions () {
      return this.$store.state.ageAtOptions
    },
    selectedGenderOptions: {
      get () {
        return this.$store.state.facetFilter.gender
      },
      set (value) {
        this.$store.commit('updateGenderFilter', value)
      }
    },
    selectedSubcohortOptions: {
      get () {
        return this.$store.state.facetFilter.subcohort
      },
      set (value) {
        this.$store.commit('updateSubcohortfilter', value)
      }
    },
    selectedAgeAt: {
      get () {
        const filter = this.$store.state.facetFilter
        return {
          ageGroupAt1A: filter.ageGroupAt1A,
          ageGroupAt2A: filter.ageGroupAt2A,
          ageGroupAt3A: filter.ageGroupAt3A
        }
      },
      set (value) {
        this.$store.commit('updateSelectedAgeAt', value)
      }
    },
    selectedAgeRange: {
      get () {
        return this.$store.state.facetFilter.yearOfBirthRange
      },
      set (value) {
        this.$store.commit('updateYearOfBirthRangefilter', value)
      }
    }

  }
})
</script>

<style>
.facet {
  margin-top: 0.5rem;
}
</style>
