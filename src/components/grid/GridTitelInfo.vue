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

<style lang="scss" scoped>
  @import "../../scss/variables";

  .detail-info-hover {
    position: relative;

    .detail-info {
      background-color: $light;
      display: block;
      opacity: 0;
      padding-left: 1rem;
      padding-right: 1rem;
      pointer-events: none;
      position: absolute;
      z-index: 1;

      path {
        fill: $secondary;
      }
    }

    .variable-title {
      display: block;
      overflow: hidden;
      padding-left: 1rem;
      padding-right: 1rem;
      text-overflow: ellipsis;
    }

    &:hover .detail-info {
      opacity: 1;
    }
  }
</style>
