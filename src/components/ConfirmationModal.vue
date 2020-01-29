<template>
    <div class="modal open" tabindex="-1">
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
                <span class="title">{{title}}</span>
                <router-link class="btn-close" :to="backRoute" tag="div">
                  <font-awesome-icon icon="window-close"/>
                </router-link>
            </div>
            <div class="modal-body">
                  <slot name="body"></slot>
            </div>
            <div class="modal-footer modal-confirm">
                <router-link class="btn btn-gray" :to="backRoute" tag="button">
                  {{$t('lifelines-webshop-modal-button-cancel')}}
                </router-link>
                <slot name="confirmButton"></slot>
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

library.add(faWindowClose)

export default Vue.extend({
  components: { FontAwesomeIcon },
  name: 'ConfirmationModal',
  props: ['backRoute', 'title']
})
</script>
