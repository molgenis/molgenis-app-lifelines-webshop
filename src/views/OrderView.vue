<template>
    <div class="container">
        <h1>Order variables</h1>
        <toast-component
          class="toast-component mt-2"
          v-if="toast"
          :type="toast.type"
          :message="toast.message"
          @toastCloseBtnClicked="clearToast">
        </toast-component>
        <div class="row">
          <div class="col-md-6">
            <form-component
              id="order-form"
              :options="options"
              :formFields="orderFormFields"
              :initialFormData="order"
              :formState="formState"
              @valueChange="onValueChanged">
            </form-component>
            <div>
              <router-link
                class="btn btn-secondary btn-outline"
                type="button"
                to="/"
                tag="button">
                Cancel
              </router-link>

              <button
                v-if="!isSaving"
                id="submit-btn"
                class="btn btn-primary ml-1"
                type="submit"
                @click.prevent="onSubmit"
                :disabled="(formState.$invalid && formState.$touched) || formState.$pending">
                Save
              </button>

              <button
                v-else
                id="save-btn-saving"
                class="btn btn-primary ml-1"
                type="button"
                disabled="disabled">
                Saving
              </button>

              <span v-if="!isSaving && formState.$invalid && formState.$touched" class="alert text-danger">
                Please make sure all required flieds are filled out correctly.
              </span>

            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { FormComponent } from '@molgenis/molgenis-ui-form'
import { mapActions, mapMutations, mapState } from 'vuex'
import ToastComponent from '../components/ToastComponent.vue'

export default Vue.extend({
  name: 'OrderView',
  components: {
    FormComponent, ToastComponent
  },
  data () {
    return {
      isSaving: false,
      options: {
        showEyeButton: false,
        allowAddingOptions: false
      },
      formState: {}
    }
  },
  computed: {
    ...mapState(['toast', 'orderFormFields', 'order'])
  },
  methods: {
    ...mapActions(['save']),
    ...mapMutations(['setToast', 'clearToast', 'setOrderDetails']),
    onValueChanged (updatedFormData) {
      this.formData = updatedFormData
      this.setOrderDetails(updatedFormData)
    },
    async onSubmit () {
      const formState = this.formState
      // trigger field to show validation result to user
      this.orderFormFields.forEach((field) => (formState[field.id].$touched = true))
      if (this.formState.$valid) {
        this.isSaving = true
        await this.save().catch(() => {
          this.isSaving = false
          this.setToast({ type: 'warning', message: 'Failed to submit order' })
        })
        this.$router.push('/')
      }
    }
  }
})
</script>
