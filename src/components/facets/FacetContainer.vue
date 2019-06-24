<template>
  <div class="facet-container">
      <label v-if="label" >{{ label }}</label>
      <slot></slot>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FacetContainer',
  props: {
    facetId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    }
  }
})
</script>

<style scoped>
  .facet-container {
    margin-bottom: 1rem;
  }
</style>
