<template>
  <font-awesome-icon
    icon="caret-up"
    class="collapse-tree-icon"
    :style="iconStyle"
  />
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCaretUp)

export default Vue.extend({
  name: 'CollapseTreeIcon',
  components: { FontAwesomeIcon },
  props: {
    state: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    iconStyle () {
      return {
        transform: `rotate(${this.state ? 180 : 0}deg)`,
        transition: 'transform 0.2s'
      }
    }
  }
})
</script>
