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
    <b-popover :target="id" triggers="hover blur focus click" placement="right" :title="title">
      <div class="popover-content">
        <slot></slot>
      </div>
      <div v-if="href">
        <a :href="href" target="_blank" rel="noopener noreferrer">{{linkTitle || href}}</a>
      </div>
    </b-popover>
  </span>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faInfoCircle)

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

  svg {
    &:focus,
    &:active {
      outline: none;

      path {
        fill: $primary;
        transition: fill 0.2s;
      }
    }
  }
}

.popover {
  z-index: $zindex-sticky;
}

.popover-content {
  // this is styling for html inside database
  /deep/ span > a {
    display: block;
    float: right;

    &::after {
      clear: both;
      content: "";
      display: block;
      height: 0.3rem;
    }
  }
}
</style>
