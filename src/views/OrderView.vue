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
              :initialFormData="orderFormData"
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
                id="save-btn"
                class="btn btn-primary ml-1"
                type="submit"
                @click.prevent="onSave"
                :disabled="formState.$pending || isSubmitting">
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

              <button
                v-if="!isSubmitting"
                id="submit-btn"
                class="btn btn-warning ml-3"
                type="submit"
                @click.prevent="onSubmit"
                :disabled="(formState.$invalid && formState.$touched) || formState.$pending || isSaving">
                Submit
              </button>

              <button
                v-else
                id="submit-btn-submitting"
                class="btn btn-warning ml-3"
                type="button"
                disabled="disabled">
                Submitting
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
      isSubmitting: false,
      options: {
        showEyeButton: false,
        allowAddingOptions: false
      },
      formState: {}
    }
  },
  computed: {
    ...mapState(['toast', 'orderFormFields', 'order']),
    orderFormData () {
      if (this.order && this.order.applicationForm && typeof this.order.applicationForm.filename === 'string') {
        // Form field of type file expects just the filename in update mode
        return {
          ...this.order, ...{ applicationForm: this.order.applicationForm.filename }
        }
      } else {
        return this.order
      }
    }
  },
  methods: {
    ...mapActions(['save', 'submit']),
    ...mapMutations(['setToast', 'clearToast', 'setOrderDetails']),
    onValueChanged (updatedFormData) {
      this.formData = updatedFormData
      this.setOrderDetails(updatedFormData)
    },
    async onSave () {
      this.isSaving = true
      await this.save()
      this.isSaving = false
    },
    async onSubmit () {
      const formState = this.formState
      // trigger field to show validation result to user
      this.orderFormFields.forEach((field) => (formState[field.id].$touched = true))
      if (this.formState.$valid) {
        this.isSubmitting = true
        await this.submit()
        this.isSubmitting = false
      }
    }
  }
})
</script>
