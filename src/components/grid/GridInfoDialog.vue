<template>
  <div class="modal secondary open" tabindex="-1">
    <div class="modal-backdrop"></div>
    <div class="modal-dialog" v-click-outside="onClickOutside">
      <div class="modal-content">

        <div class="modal-header">
          <span class="title">{{headerText}}</span>

          <div class="btn-close" @click="$emit('close')">
            <font-awesome-icon icon="window-close"/>
          </div>
        </div>

        <div class="modal-body">
          <p>
            <span v-if="data.label">
              <strong >Name</strong>
              <br/>
              <span class="name">{{data.name}}</span>
              <br/>
            </span>

            <strong>Description (en)</strong>
            <br />
            {{data.definition_en}}
            <span v-if="!data.definition_en">No description found.</span>
          </p>
          <p v-if="data.definition_nl">
            <strong>Description (nl)</strong>
            <br />
            {{data.definition_nl}}
          </p>
          <p v-if="data.options.length > 0">
            <strong>Categorical values (en)</strong>
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
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ClickOutside from 'v-click-outside'

library.add(faWindowClose)

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
      if (this.data.label && this.data.label.length > 0) {
        return this.data.label
      } else {
        return this.data.name
      }
    }
  }
})
</script>
