<template>
    <div class="container mb-5">
        <div class="row">
          <div class="col-md-6">
            <toast-component
              class="toast-component mt-2"
              v-if="toast"
              :type="toast.type"
              :message="toast.message"
              @toastCloseBtnClicked="clearToast">
            </toast-component>
            <h1>Order variables</h1>
            <form-component
              id="order-form"
              :options="options"
              :formFields="orderFormFields"
              :initialFormData="orderFormData"
              :formState="formState"
              @valueChange="onValueChanged">
            </form-component>
            <div v-if="!isSaving && formState.$invalid && formState.$touched" class="alert text-danger px-0">
              Please enter a project number before submitting a order.
            </div>
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
                :disabled="formInvalid || formState.$pending || isSaving">
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
      isSubmittingState: false,
      isSaving: false,
      isSubmitting: false,
      formInvalid: false,
      options: {
        showEyeButton: false,
        allowAddingOptions: false
      },
      formState: {},
      formData: {}
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
  mounted () {
    this.setProjectNumberRequiredFunction(() => this.isSubmittingState)
  },
  methods: {
    ...mapActions(['save', 'submit']),
    ...mapMutations(['setToast', 'clearToast', 'setOrderDetails', 'setProjectNumberRequiredFunction']),
    onValueChanged (updatedFormData) {
      if (updatedFormData.projectNumber !== null && updatedFormData.projectNumber !== '') {
        this.formInvalid = false
      }
      this.formData = updatedFormData
      this.setOrderDetails(updatedFormData)
    },
    async onSave () {
      this.isSubmittingState = false
      this.isSaving = true
      const orderNumber = await this.save()
      this.isSaving = false
      this.$router.push({ name: 'load', params: { orderNumber } })
    },
    async onSubmit () {
      this.isSubmittingState = true
      this.orderFormFields.forEach((field) => (this.formState[field.id].$touched = true))
      if (!(this.formData.projectNumber === null || this.formData.projectNumber === '')) {
        this.isSubmitting = true
        await this.submit()
        this.isSubmitting = false
        this.$router.push({ name: 'orders' })
      }
    }
  }
})
</script>
