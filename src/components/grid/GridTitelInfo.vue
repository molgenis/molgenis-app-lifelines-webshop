<template>
  <div class="grid-titel">
    <span class="variable-title" :title="variableName" :id="`variable-${name}`" tabindex="0">
      <font-awesome-icon
        class="ml-1 grid-variable-info"
        icon="info-circle"
        aria-label="info"
        focusable="true"
      />
      {{variableName}}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faInfoCircle)

export default Vue.extend({
  name: 'GridTitelInfo',
  components: { FontAwesomeIcon },
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

  // &:hover {
  //   cursor: pointer;
  //   & .grid-variable-info {
  //     opacity: 0.7;
  //   }
  // }
}

.grid-variable-info {
  color: $primary;
  margin-right: 0.25rem;
  opacity: 0;
  padding-bottom: 2px;
  transition: opacity 0.2s;
}
</style>
