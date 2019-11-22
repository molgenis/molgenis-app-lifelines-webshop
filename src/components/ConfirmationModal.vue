<template>
    <div class="modal open" tabindex="-1">
      <div class="modal-overlay"></div>
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{modalTitle}}</h5>
                <router-link type="button" class="close" :to="backRoute" tag="button">
                  <span>&times;</span>
                </router-link>
            </div>
            <div class="modal-body">
                  <slot></slot>
            </div>
            <div class="modal-footer">
                <router-link class="btn btn-secondary" :to="backRoute">
                  {{$t('lifelines-webshop-modal-button-cancel')}}
                </router-link>
                <button type="button" class="btn btn-primary t-btn-confirm" @click="confirmMethod">{{confirmButton}}</button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'ConfirmationModal',
  props: ['backRoute', 'confirmButton', 'confirmMethod', 'modalTitle']
})
</script>

<style lang="scss" scoped>
  @import "node_modules/bootstrap/scss/functions";
  @import "node_modules/bootstrap/scss/variables";

  .modal {
    &.open {
      display: block;

      .modal-overlay {
        background-color: rgba($modal-backdrop-bg , $modal-backdrop-opacity);
        height: 100%;
        position: fixed;
        width: 100%;
        z-index: $zindex-modal-backdrop;
      }

      .modal-dialog {
        z-index: $zindex-modal;
      }
    }
  }
</style>
