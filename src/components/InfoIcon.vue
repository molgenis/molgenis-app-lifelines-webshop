<template>
  <span class="mg-info-icon">
    <font-awesome-icon
      class="ml-1"
      icon="info-circle"
      aria-label="info"
      focusable="true"
      tabindex="0"
      :id="id"
    />
    <b-popover :target="id" triggers="hover blur" placement="right" :title="title">
      <div class="popover-content">
        <slot></slot>
        <span class="trailing-link" v-if="href"><a :href="href" target="_blank" rel="noopener noreferrer">More info <font-awesome-icon icon="caret-right" /></a></span>
      </div>
    </b-popover>
  </span>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faInfoCircle, faCaretRight)

export default {
  components: { FontAwesomeIcon },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    href: {
      type: String,
      required: false
    },
    linkTitle: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="scss" scoped>
.mg-info-icon {
  cursor: pointer;
}

.popover {
  z-index: $zindex-sticky;
}
</style>
