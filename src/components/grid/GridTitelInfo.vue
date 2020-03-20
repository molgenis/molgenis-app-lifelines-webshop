<template>
  <div class="grid-titel">
    <span class="variable-title" :title="variableName" :id="`variable-${name}`" tabindex="0">
      {{variableName}}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'GridTitelInfo',
  props: {
    subvariables: {
      type: Array,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    }
  },
  computed: {
    variableName () {
      return this.label ? this.label : this.name
    }
  }
})
</script>

<style lang="scss" scoped>
.grid-titel:hover {
  cursor: pointer;

  .grid-variable-info {
    opacity: 0.7;
  }
}

.variable-title {
  display: block;
  margin-right: 1rem;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
