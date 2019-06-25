<template>
  <div class="facet">
      <label v-if="label" :for="facetOptionsId">{{ label }}</label>
      <ul :id="facetOptionsId" class="list-unstyled list-inline">
          <li class="list-inline-item" v-for="option in options" :key=option.value>
            <facet-option :isSelected="value.includes(option.value)" @facetToggled="handleFacetToggle(option)">{{option.text}}</facet-option>
          </li>
      </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import FacetOption from './FacetOption.vue'

export default Vue.extend({
  name: 'ToggleFacet',
  components: { FacetOption },
  props: {
    facetId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    facetOptionsId () {
      return this.facetId + '-options'
    }
  },
  methods: {
    handleFacetToggle (option) {
      // clone to break reactive loop
      const valueClone = [...this.value]
      if (this.value.includes(option.value)) {
        valueClone.splice(this.value.indexOf(option.value), 1)
      } else {
        valueClone.push(option.value)
      }
      this.$emit('input', valueClone)
    }
  }
})
</script>
