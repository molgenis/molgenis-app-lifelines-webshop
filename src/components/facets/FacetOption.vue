<template>
    <button
    type="button"
    class="ll-facet-option btn btn-sm"
    :class="{ 'btn-secondary': !!isSelected, 'btn-outline-secondary': !isSelected }"
    @click.stop="$emit('facetToggled')"
    >
      <slot />
    </button>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FacetOption',
  props: {
    isSelected: {
      type: Boolean,
      default: () => false
    }
  }
})
</script>

<style lang="scss">
  .ll-facet-option {
    margin-bottom: 0.5rem;
  }
</style>
