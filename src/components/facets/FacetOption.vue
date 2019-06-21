<template>
    <button
    type="button"
    class="ll-facet-option btn btn-sm"
    :class="{ 'btn-secondary': !!isSelected, 'btn-outline-secondary': !isSelected }"
    @click.stop="$emit('facetToggled')"
    >
        {{text}}
    </button>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FacetOption',
  props: {
    text: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: () => false
    }
  }
})
</script>

<style>
  .ll-facet-option {
    margin-bottom: .5rem;
  }
</style>
