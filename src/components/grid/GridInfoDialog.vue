<template>
  <div>
    <div class="info-overlay"></div>
    <div class="info-dialog" v-click-outside="onClickOutside">
      <div class="info-dialog-container rounded-sm overflow-hidden box-shadow">
        <div class="info-dialog-header d-flex align-items-center">
          <h4 class="pr-4">
            {{ headerText }}
            <span v-if="data.label">{{data.name}}</span>
          </h4>
          <span class="close btn btn-outline-light btn-sm ml-auto">
            <font-awesome-icon color="white" size="sm" icon="times" @click="$emit('close')" />
          </span>
        </div>
        <div class="info-dialog-content">
          <slot></slot>
          <p>
            <strong>Description (en):</strong>
            <br />
            {{data.definition_en}}
            <span v-if="!data.definition_en">No description found.</span>
          </p>
          <p v-if="data.definition_nl">
            <strong>Description (nl):</strong>
            <br />
            {{data.definition_nl}}
          </p>
          <p v-if="data.options.length > 0">
            <strong>Categorical values (en):</strong>
            <span class="d-block">
              <span
                class="badge badge-pill badge-secondary mr-2"
                v-for="(option, index) in data.options"
                :key="`GridInfoDialog-${index}`"
              >{{option['label_en']}}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ClickOutside from 'v-click-outside'

library.add(faTimes)

export default Vue.extend({
  name: 'GridInfoDialog',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: { FontAwesomeIcon },
  directives: { clickOutside: ClickOutside.directive },
  created () {
    document.getElementsByTagName('html')[0].classList.add('overflow-hidden')
  },
  destroyed () {
    document.getElementsByTagName('html')[0].classList.remove('overflow-hidden')
  },
  methods: {
    onClickOutside () {
      this.$emit('close')
    }
  },
  computed: {
    headerText () {
      if ((this.data.label !== null && this.data.label !== undefined) && this.data.label.length > 0) {
        return this.data.label
      } else {
        return this.data.name
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.close {
  line-height: 0;
  opacity: 1;

  &:hover svg path {
    fill: $primary;
  }
}

svg {
  cursor: pointer;

  &:hover path {
    fill: rgba(255, 255, 255, 0.6);
  }
}

.info-overlay {
  background-color: rgba(0, 0, 0, 0.3);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: $zindex-modal-backdrop;
}

.info-dialog {
  bottom: 0;
  left: 19rem;
  position: absolute;
  top: 0;

  .info-dialog-container {
    background-color: #fff;
    margin-right: 2rem;
    position: fixed;
    z-index: $zindex-modal;

    .info-dialog-header {
      background-color: $primary;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.5rem 0.5rem 1rem;

      h4 {
        color: #fff;
        margin: 0;

        span {
          font-size: 0.8rem;
          font-style: italic;
        }
      }
    }

    .info-dialog-content {
      max-height: calc(100vh - 18rem);
      overflow-y: auto;
      padding: 1rem;
      padding-top: 0.5rem;
    }
  }
}
</style>
