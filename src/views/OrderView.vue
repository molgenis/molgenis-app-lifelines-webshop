<template>
    <div class="container">
        <h1>Order varibles</h1>
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
              :formFields="formFields"
              :initialFormData="initialFormData"
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
                Submit
              </button>

              <button
                v-else
                id="save-btn-saving"
                class="btn btn-primary"
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
      options: {
        showEyeButton: false,
        allowAddingOptions: false
      },
      formFields: [
        {
          type: 'text',
          id: 'projectNumber',
          label: 'Project number',
          description: 'The OV number.',
          required: () => true,
          disabled: false,
          readOnly: false,
          visible: () => true,
          validate: () => true
        },
        {
          type: 'text',
          id: 'name',
          label: 'Name',
          description: 'Optional name',
          required: () => false,
          disabled: false,
          readOnly: false,
          visible: () => true,
          validate: () => true
        },
        {
          type: 'file',
          id: 'applicationForm',
          label: 'Application form ',
          description: 'Word or text file to describe the request.',
          required: () => false,
          disabled: false,
          readOnly: false,
          visible: () => true,
          validate: () => true
        }
      ],
      initialFormData: {},
      formState: {}
    }
  },
  computed: {
    ...mapState(['toast'])
  },
  methods: {
    ...mapActions(['submitOrder']),
    ...mapMutations(['setToast', 'clearToast']),
    onValueChanged (updatedFormData) {
      this.formData = updatedFormData
    },
    async onSubmit () {
      const formState = this.formState
      // trigger field to show validation result to user
      this.formFields.forEach((field) => (formState[field.id].$touched = true))
      if (this.formState.$valid) {
        this.isSaving = true
        await this.submitOrder({ formData: this.formData, formFields: this.formFields }).catch(() => {
          this.isSaving = false
          this.setToast({ type: 'warning', message: 'Failed to sumbmit order' })
        })
        this.$router.push('/')
      }
    }
  }
})
</script>
