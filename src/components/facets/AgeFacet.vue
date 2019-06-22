<template>
  <div class="facet">
      <label class="age-at-label" for="age-at-select">Age at</label>
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
      required: true
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
      const selectedAgeAt = {
        ageGroupAt1A: this.selectedAgeAt === 'ageGroupAt1A' ? this.selectedAgeGroups : [],
        ageGroupAt2A: this.selectedAgeAt === 'ageGroupAt2A' ? this.selectedAgeGroups : [],
        ageGroupAt3A: this.selectedAgeAt === 'ageGroupAt3A' ? this.selectedAgeGroups : []
      }
      this.$emit('input', selectedAgeAt)
    }
  }
})
</script>

<style>
.age-at-label {
  margin-right: 1rem;
}

.age-at-container {
  margin-bottom: 1rem;
}
</style>
