<template>
  <div class="facet-container">
      <label
        v-if="label"
        @click="handleFacetToggle"
         >
        {{ label }}
        <font-awesome-icon
          icon="chevron-up"
          v-if="collapsable"
          :class="{ 'fa-rotate-180': collapsed}"
        />
      </label>
      <div v-show="!collapsed" class="facet-container-content">
       <slot></slot>
      </div>
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
    },
    collapsable: {
      type: Boolean,
      required: false,
      default: () => false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  methods: {
    handleFacetToggle () {
      if (!this.collapsable) {
        return
      }
      this.$emit('facetToggle', {
        facetId: this.facetId,
        collapsed: this.collapsed
      }
      )
    }
  }
})
</script>

<style scoped>
  .facet-container {
    margin-bottom: 1rem;
  }

  label {
    cursor: grab;
  }
</style>
