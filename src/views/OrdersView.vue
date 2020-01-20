<template>

  <div id="orders-view" class="container-fw pt-1">
    <ConfirmationModal
      v-if="$route && $route.name === 'orderDelete'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :confirmButton="$t('lifelines-webshop-modal-button-delete')"
      :confirmMethod="deleteOrderConfirmed.bind(this, $route.params.orderNumber)"
      :modalTitle="$t('lifelines-webshop-modal-delete-header', {order: $route.params.orderNumber})">
      {{$t('lifelines-webshop-modal-delete-body', {order: $route.params.orderNumber})}}
    </ConfirmationModal>

    <h1 id="orders-title">{{$t('lifelines-webshop-orders-title')}}</h1>

    <div class="filters form-row">
      <div class="form-group col-md-4">
        <input v-model="orderFilters.text" type="text" id="searchtext" class="form-control" placeholder="Search orders...">
      </div>
      <div class="form-group col-md-2">
        <Dropdown buttonClass="btn-secondary" v-model="orderFilters.state" :options="stateOptions" :title="$t('Filter state')"/>
      </div>

      <div class="form-group col-md-6">
        <b-pagination
          align="right"
          v-if="hasManagerRole"
          v-model="currentPage"
          :total-rows="total"
          :per-page="perPage"
          aria-controls="orders-table">
        </b-pagination>
      </div>
    </div>

    <b-table
      ref="table"
      striped
      hover
      show-empty
      :items="ordersProvider"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
      :no-local-sorting="true"
    >

      <template v-slot:empty="scope">
        <h5>{{ scope.emptyText }}</h5>
      </template>

      <template v-slot:cell(actions)="data">
        <router-link class="btn btn-secondary btn-sm" tag="button"
          v-b-tooltip.hover title="Edit"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="`/shop/${data.item.orderNumber}`">
            <font-awesome-icon icon="edit" aria-label="edit"/>
        </router-link>

        <button class="btn btn-secondary btn-sm copy-btn" type="button"
          v-b-tooltip.hover title="Copy"
          @click="handleCopyOrder(data.item.orderNumber)">
          <font-awesome-icon icon="copy" aria-label="copy"/>
        </button>

        <router-link class="btn btn-danger btn-sm t-btn-order-delete" tag="button"
          v-b-tooltip.hover title="Remove"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="{ name: 'orderDelete', params: {orderNumber: data.item.orderNumber}}">
          <font-awesome-icon icon="trash" aria-label="delete"/>
        </router-link>
      </template>

      <template v-slot:cell(orderNumber)="data">
        {{data.item.orderNumber}}<br/>
        <a v-if="data.item.applicationForm" :href="data.item.applicationForm.url">
          {{ data.item.applicationForm.filename }} <font-awesome-icon icon="download" aria-label="download"/>
        </a>
      </template>

      <template v-slot:cell(submissionDate)="data">
        <span v-if="hasManagerRole">{{ data.item.submissionDate | dateManager }}</span>
        <span v-else>{{ data.item.submissionDate | dateShopper }}</span>
      </template>

      <template v-slot:cell(applicationForm)="data">

      </template>

      <template v-slot:cell(state)="data" class="table-cell-overflow">
        <Dropdown
          v-if="hasManagerRole"
          v-model="data.item.state"
          :buttonClass="buttonStateMap[data.item.state]"
          :method="changeState.bind(this, data.item)"
          :options="stateOptions"
          :title="$t(data.item.state)"
        />

        <span v-else class="badge badge-pill" :class="badgeClass[data.item.state]">{{ data.item.state }}</span>
      </template>
    </b-table>

    <b-pagination
      align="right"
      v-if="hasManagerRole"
      v-model="currentPage"
      :total-rows="total"
      :per-page="perPage"
      aria-controls="orders-table">
    </b-pagination>

  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faDownload, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import Dropdown from '../components/dropdown.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import moment from 'moment'

import api from '@molgenis/molgenis-api-client'

library.add(faEdit, faDownload, faTrash, faCopy)

export default Vue.extend({
  components: { ConfirmationModal, Dropdown, FontAwesomeIcon },
  computed: {
    numberOfOrders: (vm) => vm.orders.length,
    tableFields: (vm) => {
      let fields = [
        { key: 'actions', label: '', class: 'actions-column' },
        { key: 'name', label: vm.$t('lifelines-webshop-orders-col-header-title'), sortable: true }
      ]

      if (vm.hasManagerRole) {
        fields.push({ key: 'email', label: vm.$t('lifelines-webshop-orders-col-header-email'), sortable: true })
      }

      fields = fields.concat([
        { key: 'projectNumber', label: vm.$t('lifelines-webshop-orders-col-header-project'), sortable: true },
        { key: 'orderNumber', label: vm.$t('lifelines-webshop-orders-col-header-order'), sortable: true },
        { key: 'submissionDate', label: vm.$t('lifelines-webshop-orders-col-header-sub-date'), sortable: true },
        {
          key: 'state',
          label: vm.$t('lifelines-webshop-orders-col-header-state'),
          sortable: true,
          formatter: (value, key, item) => {
            return item.state
          },
          sortByFormatted: true
        }
      ])

      return fields
    },
    ...mapState(['orders']),
    ...mapGetters(['hasManagerRole'])
  },
  data () {
    return {
      buttonStateMap: {
        'Draft': 'btn-light',
        'Submitted': 'btn-warning',
        'Approved': 'btn-success'
      },
      orderFilters: {
        text: '',
        state: ''
      },
      total: 0,
      perPage: 10,
      currentPage: 1,
      stateOptions: [
        { value: 'Draft', name: this.$t('Draft') },
        { value: 'Submitted', name: this.$t('Submitted') },
        { value: 'Approved', name: this.$t('Approved') }
      ],
      badgeClass: {
        'Draft': 'badge-info',
        'Submitted': 'badge-primary',
        'Approved': 'badge-success',
        'Rejected': 'badge-danger'
      },
      statusVariant: {
        'Draft': 'info',
        'Submitted': 'primary',
        'Approved': 'success',
        'Rejected': 'danger'
      },
      approvingOrder: ''
    }
  },
  filters: {
    dateManager: (dateValue) => dateValue ? moment(dateValue).format('L') : '',
    dateShopper: (dateValue) => dateValue ? moment(dateValue).format('LLLL') : ''
  },
  methods: {
    changeState: async function (order, selectedState) {
      if (selectedState.value === 'Approved') {
        await this.loadOrder(order.orderNumber)
        this.changeOrderStatus(selectedState.value)
        await this.save()
        // this.handleApproveOrder(order.orderNumber)
      } else if (selectedState.value === 'Submitted') {
        await this.loadOrder(order.orderNumber)
        this.submit()
      } else if (selectedState.value === 'Draft') {
        await this.loadOrder(order.orderNumber)
        this.changeOrderStatus(selectedState.value)
        await this.save()
      }
    },
    deleteOrderConfirmed: function (orderNumber) {
      vm.deleteOrder(orderNumber)
      this.$router.push({ name: 'orders' })
    },
    handleApproveOrder: async function (orderNumber) {
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
    handleCopyOrder: async function (orderNumber) {
      await this.copyOrder(orderNumber)
      this.loadOrders()
    },
    ordersProvider: async function (ctx, cb) {
      const { currentPage, perPage, sortBy, sortDesc } = ctx
      let num = perPage
      let start = (currentPage - 1) * perPage

      let apiUrl = `/api/v2/lifelines_order?num=${num}&start=${start}`
      if (sortBy) {
        const sortFlow = sortDesc ? 'desc' : 'asc'
        apiUrl += `&sort=${sortBy}:${sortFlow}`
      }

      const filterActive = this.orderFilters.text || this.orderFilters.state
      if (filterActive) {
        let operands = []

        if (this.orderFilters.text) {
          operands = operands.concat([
            { selector: 'email', comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `name`, comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `orderNumber`, comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `projectNumber`, comparison: '=like=', arguments: this.orderFilters.text }
          ])
        }

        if (this.orderFilters.state) {
          operands.push({ selector: 'state', comparison: '=q=', arguments: this.orderFilters.state })
        }

        const rsql = transformToRSQL({ operator: 'OR', operands })
        apiUrl += `&q=${encodeRsqlValue(rsql)}`
      }

      const response = await api.get(apiUrl)
      this.total = response.total
      return response.items
    },
    ...mapActions(['save', 'loadOrder', 'updateOrder', 'submit', 'loadOrders', 'deleteOrder', 'sendApproveTrigger', 'copyOrder']),
    ...mapMutations(['changeOrderStatus', 'setToast'])

  },
  mounted () {
    this.loadOrders()
  },
  watch: {
    orderFilters: {
      deep: true,
      handler: function (val) {
        this.$refs.table.refresh()
      }
    }
  }
})
</script>

<style lang="scss">
  @import "../scss/variables";

  .filters {
    margin: $spacer 0;
  }

  .actions-column {
    padding-left: 0;
    padding-right: 0;
    text-overflow: none;
    width: 145px;

    button {
      margin-right: $spacer;
    }
  }
</style>
