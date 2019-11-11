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
                <button type="button" class="btn btn-primary" @click="confirmMethod()">{{confirmButton}}</button>
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

<style scoped lang="scss">
  .modal {
    &.open {
      display: block;

      .modal-overlay {
        background-color: rgba(0,0,0,0.5);
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 2;
      }

      .modal-dialog  {
        z-index: 3;
      }
    }
  }
</style>
