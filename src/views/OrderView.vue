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
        <h1>{{$t('lifelines-webshop-order-header')}}</h1>
        <form-component
          id="order-form"
          :options="options"
          :formFields="orderFormFields"
          :initialFormData="orderFormData"
          :formState="formState"
          @valueChange="onValueChanged">
        </form-component>
        <div v-if="!isSaving && formState.$invalid && formState.$touched" class="alert text-danger px-0">
          {{$t('lifelines-webshop-order-submit-error-project-nummber')}}
        </div>
        <div>
          <router-link
            class="btn btn-secondary btn-outline"
            type="button"
            to="/"
            tag="button">
            {{$t('lifelines-webshop-cancel-btn-label')}}
          </router-link>
          <button
            v-if="!isSaving"
            id="save-btn"
            class="btn btn-primary ml-1"
            type="submit"
            @click.prevent="onSave"
            :disabled="formState.$pending || isSubmitting">
            {{$t('lifelines-webshop-save-btn-label')}}
          </button>

          <button
            v-else
            id="save-btn-saving"
            class="btn btn-primary ml-1"
            type="button"
            disabled="disabled">
            {{$t('lifelines-webshop-saving-btn-label')}}
          </button>

          <button
            v-if="!isSubmitting"
            id="submit-btn"
            class="btn btn-warning ml-3"
            type="submit"
            @click.prevent="onSubmit"
            :disabled="formInvalid || formState.$pending || isSaving">
            {{$t('lifelines-webshop-submit-btn-label')}}
          </button>

          <button
            v-else
            id="submit-btn-submitting"
            class="btn btn-warning ml-3"
            type="button"
            disabled="disabled">
            {{$t('lifelines-webshop-submitting-btn-label')}}
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

    // i18n localization of form fields
    const projectNumber = this.orderFormFields.find((item) => item.id === 'projectNumber')
    projectNumber.label = this.$t('lifelines-webshop-order-projectnumber-label')
    projectNumber.description = this.$t('lifelines-webshop-order-projectnumber-description')
    const name = this.orderFormFields.find((item) => item.id === 'name')
    name.label = this.$t('lifelines-webshop-order-name-label')
    name.description = this.$t('lifelines-webshop-order-name-description')
    const applicationForm = this.orderFormFields.find((item) => item.id === 'applicationForm')
    applicationForm.label = this.$t('lifelines-webshop-order-applicationform-label')
    applicationForm.description = this.$t('lifelines-webshop-order-applicationform-description')
    this.setOrderFormFields(this.orderFormFields)
  },
  methods: {
    ...mapActions(['save', 'submit']),
    ...mapMutations(['setToast', 'clearToast', 'setOrderDetails', 'setProjectNumberRequiredFunction', 'setOrderFormFields']),
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
