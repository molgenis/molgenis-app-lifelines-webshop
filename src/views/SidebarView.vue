<template>
  <div id="Sidebar-view">
    <h3>{{ 'lifelines-webshop-sidebar-header' | i18n }}</h3>
    <ul class="list-unstyled">
      <li>
        <facet-container
          facetId="age"
          label="Age"
          :collapsable="true"
          :collapsed="activeAgeFacetId !== 'age'"
          @facetToggle="handleAgeToggle">
            <age-facet
            facetId="age"
            :ageGroupOptions="ageGroupOptions"
            :ageAtOptions="ageAtOptions"
            v-model="selectedAgeAt" />
        </facet-container>
      </li>
      <li>
        <facet-container
          facetId="yob"
          label="Year of birth"
          :collapsable="true"
          :collapsed="activeAgeFacetId !== 'yob'"
          @facetToggle="handleAgeToggle">
            <range-facet
            facetId="yob"
            :min="1900" :max="2050"
            v-model="selectedAgeRange"/>
        </facet-container>
      </li>
      <li>
        <facet-container facetId="gender" label="Gender">
          <toggle-facet
          facetId="gender"
          :options="genderOptions"
          v-model="selectedGenderOptions" />
        </facet-container>
      </li>
      <li>
        <facet-container facetId="cohort" label="Subcohorts">
          <toggle-facet
          facetId="cohort"
          :options="subcohortOptions"
          v-model="selectedSubcohortOptions" />
        </facet-container>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import FacetContainer from '../components/facets/FacetContainer.vue'
import ToggleFacet from '../components/facets/ToggleFacet.vue'
import AgeFacet from '../components/facets/AgeFacet.vue'
import RangeFacet from '../components/facets/RangeFacet.vue'
import { mapMutations } from 'vuex'

export default Vue.extend({
  name: 'SidebarView',
  components: { FacetContainer, ToggleFacet, AgeFacet, RangeFacet },
  data: function () {
    return {
      activeAgeFacetId: 'age',
      cachedAgeState: null
    }
  },
  methods: {
    handleAgeToggle (event) {
      const { collapsed, facetId } = event
      if (facetId === 'yob') {
        this.activeAgeFacetId = collapsed ? 'yob' : 'age'
      }
      if (facetId === 'age') {
        this.activeAgeFacetId = collapsed ? 'age' : 'yob'
      }
    }
  },
  watch: {
    activeAgeFacetId (active) {
      if (active === 'age') {
        const tempState = this.selectedAgeRange ? [...this.selectedAgeRange] : []
        this.$store.commit('removeYearOfBirthRangefilter')
        this.$store.commit('updateSelectedAgeAt', this.cachedAgeState)
        this.cachedAgeState = tempState
      }
      if (active === 'yob') {
        const tempState = Object.assign({}, this.selectedAgeAt)
        this.$store.commit('removeAgeAtFilter')
        this.$store.commit('updateYearOfBirthRangefilter', this.cachedAgeState)
        this.cachedAgeState = tempState
      }
    }
  },
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
