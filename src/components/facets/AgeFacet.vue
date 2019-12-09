<template>
  <div class="facet">
    <label class="age-at-label"  v-if="label" for="age-at-select">{{$t('lifelines-webshop-age-facet-label')}}</label>
    <select
      id="age-at-select"
      class="custom-select custom-select-sm"
      v-model="selectedAgeAt"
      >
        <option  :value="option.value" v-for="option in ageAtOptions" :key=option.value>
          {{ option.text }}
        </option>
      </select>
      <toggle-facet facetId="age-group" :options="ageGroupOptions" v-model="selectedAgeGroups" />
  </div>
</template>

<script>
import Vue from 'vue'
import ToggleFacet from './ToggleFacet.vue'

export default Vue.extend({
  name: 'AgeFacet',
  components: { ToggleFacet },
  props: {
    facetId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    ageAtOptions: {
      type: Array,
      required: true
    },
    ageGroupOptions: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data: function () {
    const passedAgeGroup = Object.values(this.value).find(selectedGroups => selectedGroups.length)
    const passedAgeAt = Object.keys(this.value).find(selectedAssessment => this.value[selectedAssessment].length)
    return {
      selectedAgeGroups: passedAgeGroup || [],
      selectedAgeAt: passedAgeAt || this.ageAtOptions[0].value
    }
  },
  watch: {
    selectedAgeGroups () {
      this.handleAgeAtChange()
    },
    selectedAgeAt () {
      this.handleAgeAtChange()
    }
  },
  methods: {
    handleAgeAtChange () {
      const selectedAgeAt = this.ageAtOptions.reduce((accum, option) => {
        accum[option.value] = (option.value === this.selectedAgeAt) ? this.selectedAgeGroups : []
        return accum
      }, {})
      this.$emit('input', selectedAgeAt)
    }
  }
})
</script>

<style lang="scss">
  .age-at-label {
    margin-right: 1rem;
  }

  .age-at-container {
    margin-bottom: 1rem;
  }
</style>
