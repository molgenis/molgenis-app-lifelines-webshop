<template>
  <div id="sidebar-view" v-click-outside="hide" :class="{'hide-bar':!value}">
    <div class="label" @click="toggleVisibility">{{$t('lifelines-webshop-sidebar-header')}}<font-awesome-icon icon="angle-double-down" class="ml-2"></font-awesome-icon></div>
    <div class="overflow-hidden">
      <div class="sidebar-width">
        <h3 class="px-4 mg-header">{{$t('lifelines-webshop-sidebar-header')}}</h3>
        <ul class="list-unstyled sidebar-content p-4">
          <li class="hide-sidebar" @click="hide"><font-awesome-icon icon="angle-double-left" size="lg"></font-awesome-icon></li>
          <li>
            <facet-container
              facetId="age"
              :label="$t('lifelines-webshop-age-facet-label')"
              :collapsable="true"
              :collapsed="activeAgeFacetId !== 'age'"
              @facetToggle="handleAgeToggle">
                <template v-slot:label-slot>
                  <info-icon id="age-info-icon">
                    {{$t('lifelines-webshop-sidebar-age-info')}}<b-badge pill>{{$t('lifelines-webshop-sidebar-optional')}}</b-badge>
                    </info-icon>
                </template>
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
              :label="$t('lifelines-webshop-yob-facet-label')"
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
            <facet-container facetId="gender" :label="$t('lifelines-webshop-gender-facet-label')">
              <toggle-facet
              facetId="gender"
              :options="genderOptions"
              v-model="selectedGenderOptions" />
            </facet-container>
          </li>
          <li>
            <facet-container facetId="cohort" :label="$t('lifelines-webshop-subcohort-facet-label')">
              <template v-slot:label-slot>
                <info-icon id="cohort-info-icon">
                  {{$t('lifelines-webshop-sidebar-cohort-info')}}<b-badge pill>{{$t('lifelines-webshop-sidebar-optional')}}</b-badge>
                </info-icon>
              </template>
              <toggle-facet
              facetId="cohort"
              :options="subcohortOptions"
              v-model="selectedSubcohortOptions" />
            </facet-container>
          </li>
        </ul>
        <count-view class="px-4"></count-view>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import FacetContainer from '../components/facets/FacetContainer.vue'
import ToggleFacet from '../components/facets/ToggleFacet.vue'
import AgeFacet from '../components/facets/AgeFacet.vue'
import RangeFacet from '../components/facets/RangeFacet.vue'
import { mapMutations } from 'vuex'
import CountView from '@/views/CountView'
import ClickOutside from 'v-click-outside'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDoubleLeft, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import InfoIcon from '../components/InfoIcon'
library.add(faAngleDoubleLeft, faAngleDoubleDown)

export default Vue.extend({
  name: 'SidebarView',
  components: { FacetContainer, ToggleFacet, AgeFacet, RangeFacet, CountView, FontAwesomeIcon, InfoIcon },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data: function () {
    return {
      activeAgeFacetId: 'age',
      cachedAgeState: []
    }
  },
  methods: {
    hide () {
      this.$emit('input', false)
    },
    toggleVisibility () {
      this.$emit('input', !this.value)
    },
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
        const tempState = [...this.selectedAgeRange]
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
  },
  mounted () {
    this.popupItem = this.$el
  },
  directives: { clickOutside: ClickOutside.directive }
})
</script>

<style scoped lang="scss">
  #sidebar-view {
    padding: 0;
    position: relative;
    transition: max-width 0.3s, padding 0.3s;

    .sidebar-content {
      background-color: $light;
      position: relative;
    }

    .sidebar-width {
      min-width: 19rem;
    }

    .label {
      background-color: $light;
      cursor: pointer;
      display: inline-block;
      height: 0;
      line-height: 2rem;
      overflow: hidden;
      padding: 0 1rem;
      position: absolute;
      right: 0;
      top: 4rem;
      transform: rotate(-90deg) translate(0, 1rem);
      transform-origin: 100% 100%;
      transition: height 0.3s;
      white-space: nowrap;
      z-index: 1000; // zindex-dropdown
    }

    &.hide-bar {
      max-width: 1rem;
      padding: 0;

      .label {
        height: 2rem;
      }
    }

    .hide-sidebar {
      cursor: pointer;
      display: inline-block;
      padding: 1.25rem;
      position: absolute;
      right: 0;
      top: 0;

      path {
        fill: $secondary;
        transition: fill 0.1s;
      }

      &:hover path {
        fill: $warning;
      }
    }
  }
</style>
