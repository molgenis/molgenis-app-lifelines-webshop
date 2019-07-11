<template>
  <div class="facet-container">
    <label
      v-if="label"
      @click="handleFacetToggle"
       >
      {{ label }}
      <collapse-tree-icon
        v-if="collapsable"
        :state="collapsed"
      />
    </label>
    <block-expand :isExpanded="!collapsed" class="facet-container-content">
      <slot></slot>
    </block-expand>
  </div>
</template>

<script>
import Vue from 'vue'
import CollapseTreeIcon from '../animations/CollapseTreeIcon'
import BlockExpand from '../animations/BlockExpand'

export default Vue.extend({
  name: 'FacetContainer',
  components: {
    CollapseTreeIcon, BlockExpand
  },
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
  .block-expander{
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  label {
    cursor: grab;
  }
</style>
