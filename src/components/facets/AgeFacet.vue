<template>
  <div class="facet">
      <form class="form-inline age-at-container">
        <label class="age-at-label" for="age-at-select">Age group: </label>
        <select
        id="age-at-select"
        class="custom-select custom-select-sm"
        :value="selectedAgeAt"
        @change="handleAgeAtChange"
        >
          <option  :value="option.value" v-for="option in ageAtOptions" :key=option.value>
            {{ option.text }}
          </option>
        </select>
      </form>
      <toggle-facet facetId="age-group"
       :options="ageGroupOptions"
       v-model="selectedAgeGroups"
       />
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
    return {
      selectedAgeGroups: Object.values(this.value).find(selectedGroups => selectedGroups.length),
      selectedAgeAt: Object.keys(this.value).find(selectedAssessment => this.value[selectedAssessment].length)
    }
  },
  methods: {
    handleAgeAtChange (event) {
      const ageAt = event.target.value
      const selectedAgeAt = {
        ageGroupAt1A: ageAt === 'ageGroupAt1A' ? selectedAgeGroups : [],
        ageGroupAt2A: ageAt === 'ageGroupAt2A' ? selectedAgeGroups : [],
        ageGroupAt3A: ageAt === 'ageGroupAt3A' ? selectedAgeGroups : []
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
