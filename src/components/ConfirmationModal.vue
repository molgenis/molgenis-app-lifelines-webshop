<template>
    <div class="modal open" tabindex="-1">
      <div class="modal-overlay"></div>
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{title}}</h5>
                <button type="button" class="close" @click="closeModal">
                <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                  <slot></slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">{{$t('lifelines-webshop-modal-button-cancel')}}</button>
                <button type="button" class="btn btn-primary" @click="value.method">{{proceed}}</button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>

import Vue from 'vue'

export default Vue.extend({
  props: ['proceed', 'title', 'value'],
  name: 'ConfirmationModal',
  methods: {
    /**
     * Close the modal without executing the action
     * by unsetting the action at parent's v-model.
     */
    closeModal: function () {
      this.$emit('input', {
        type: null
      })
    }
  }
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
