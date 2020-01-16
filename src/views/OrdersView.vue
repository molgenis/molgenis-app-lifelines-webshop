<template>

  <div id="orders-view" class="container pt-1">
    <ConfirmationModal
      v-if="$route && $route.name === 'orderDelete'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :confirmButton="$t('lifelines-webshop-modal-button-delete')"
      :confirmMethod="deleteOrderConfirmed.bind(this, $route.params.orderNumber)"
      :modalTitle="$t('lifelines-webshop-modal-delete-header', {order: $route.params.orderNumber})">
      {{$t('lifelines-webshop-modal-delete-body', {order: $route.params.orderNumber})}}
    </ConfirmationModal>

    <h1 id="orders-title">{{$t('lifelines-webshop-orders-title')}}</h1>

      <spinner-animation v-if="orders === null"/>
      <b-table v-else hover :items="orders" :fields="tableFields" per-page=5>

        <template v-slot:cell(actions)="data">
            <router-link
              tag="button"
              v-if="data.item.state === 'Draft' || hasManagerRole"
              class="btn btn-secondary btn-sm"
              :to="`/shop/${data.item.orderNumber}`">
                <font-awesome-icon icon="edit" aria-label="edit"/>
            </router-link>
            <button class="btn btn-secondary btn-sm copy-btn" type="button" @click="handleCopyOrder(data.item.orderNumber)">
              <font-awesome-icon icon="copy" aria-label="copy"/>
            </button>
            <router-link
              tag="button"
              v-if="data.item.state === 'Draft' || hasManagerRole"
              :to="{ name: 'orderDelete', params: {orderNumber: data.item.orderNumber}}"
              class="btn btn-danger btn-sm t-btn-order-delete">
              <font-awesome-icon icon="trash" aria-label="delete"/>
            </router-link>
        </template>

        <template v-slot:cell(submissionDate)="data">
           {{ data.item.submissionDate | dataString }}
        </template>

        <template v-slot:cell(applicationForm)="data">
          <a v-if="data.item.applicationForm" :href="data.item.applicationForm.url">
            {{ data.item.applicationForm.filename }} <font-awesome-icon icon="download" aria-label="download"/>
          </a>
        </template>

        <template v-slot:cell(status)="data">
          <b-dropdown id="dropdown-1" :text="data.item.state" class="m-md-2">
            <b-dropdown-item active>Draft</b-dropdown-item>
            <b-dropdown-item>Submitted</b-dropdown-item>
            <b-dropdown-item>Approved</b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faDownload, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import moment from 'moment'

library.add(faEdit, faDownload, faTrash, faCopy)

export default Vue.extend({
  components: { ConfirmationModal, FontAwesomeIcon, SpinnerAnimation },
  computed: {
    ...mapState(['orders']),
    ...mapGetters(['hasManagerRole']),
    tableFields: function () {
      let fields = [
        { key: 'actions', label: '', class: 'actions-column' }
      ]

      if (this.hasManagerRole) {
        fields.push({ key: 'email', label: this.$t('lifelines-webshop-orders-col-header-email'), sortable: true })
      }

      fields = fields.concat([
        { key: 'name', label: this.$t('lifelines-webshop-orders-col-header-title'), sortable: true },
        { key: 'submissionDate', label: this.$t('lifelines-webshop-orders-col-header-sub-date'), sortable: true },
        { key: 'projectNumber', label: this.$t('lifelines-webshop-orders-col-header-project'), sortable: true },
        { key: 'orderNumber', label: this.$t('lifelines-webshop-orders-col-header-order'), sortable: true },
        { key: 'applicationForm', label: this.$t('lifelines-webshop-orders-col-header-app-form') },
        { key: 'status', label: this.$t('lifelines-webshop-orders-col-header-state'), sortable: true }
      ])

      return fields
    }
  },
  data () {
    return {
      approvingOrder: '',
      perPage: 5
    }
  },
  methods: {
    deleteOrderConfirmed: function (orderNumber) {
      this.deleteOrder(orderNumber)
      this.$router.push({ name: 'orders' })
    },
    async handleApproveOrder (orderNumber) {
      this.approveState = orderNumber
      this.sendApproveTrigger(orderNumber).then(
        async () => {
          await this.loadOrders()
          this.approveState = ''
          this.setToast({ type: 'success', textType: 'light', title: 'Success', timeout: this.$global.toastTimeoutTime, message: `Order ${orderNumber} approved` })
        },
        () => {
          this.approveState = ''
          this.setToast({ type: 'danger', textType: 'light', message: `Order ${orderNumber} approval failed` })
        })
    },
    async handleCopyOrder (orderNumber) {
      await this.copyOrder(orderNumber)
      this.loadOrders()
    },
    ...mapActions(['loadOrders', 'deleteOrder', 'sendApproveTrigger', 'copyOrder']),
    ...mapMutations(['setToast'])
  },
  mounted () {
    this.loadOrders()
  },
  filters: {
    dataString: (dateValue) => dateValue ? moment(dateValue).format('LLLL') : ''
  }
})
</script>

<style lang="scss">
  @import "../scss/variables";

  .actions-column {
    width: 9rem;

    button {
      margin-right: $spacer;
    }
  }
</style>
