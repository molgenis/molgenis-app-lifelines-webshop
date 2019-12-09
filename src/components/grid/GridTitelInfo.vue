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
  .variable-title {
    display: block;
    margin-right: 1rem;
    outline: none;
    overflow: hidden;
    padding-left: 1rem;
    padding-right: 1rem;
    text-overflow: ellipsis;
  }
</style>
