<template>
  <div class="detail-info-hover" >
    <div class="detail-info">
      {{variableName(info)}}
    </div>
    <span class="variable-title">
      {{variableName(info)}}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'GridTitelInfo',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    variableName () {
      return variable => variable.label ? variable.label : variable.name
    }
  }
})
</script>

<style scoped lang="scss">
  @import "../../scss/variables";
  .detail-info-hover {
    position: relative;
    .detail-info {
      position: absolute;
      opacity: 0;
      padding-right: 1rem;
      padding-left: 1rem;
      display: block;
      background-color: $light;
      pointer-events: none;
      z-index: 1;
      path{
        fill: $secondary;
      }
    }
    .variable-title {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 1rem;
      padding-left: 1rem;
    }
    &:hover .detail-info{
     opacity: 1;
    }
  }
</style>
