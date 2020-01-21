<template>

  <div id="orders-view" class="container-fw pt-1">

    <ConfirmationModal
      v-if="$route && $route.name === 'orderDelete'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :title="$t('lifelines-webshop-modal-delete-header', {order: $route.params.orderNumber})">

      <template v-slot:body>
        {{$t('lifelines-webshop-modal-delete-body', {order: $route.params.orderNumber})}}<br/>
        {{$t('lifelines-webshop-ask-confirm')}}
      </template>

      <template v-slot:confirmButton>
        <button type="button" class="btn btn-danger t-btn-danger"
          @click="deleteOrderConfirmed($route.params.orderNumber)">
          {{$t('lifelines-webshop-modal-button-delete')}}
        </button>
      </template>
    </ConfirmationModal>

    <ConfirmationModal
      v-if="$route && $route.name === 'orderStateChange'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :title="$t('lifelines-webshop-modal-state-header')">

      <template v-slot:body>
        {{$t('lifelines-webshop-modal-state-body', {
          order: $route.params.orderNumber,
          state: $route.params.state,
        })}}<br/>
        {{$t('lifelines-webshop-ask-confirm')}}
      </template>

      <template v-slot:confirmButton>
        <button type="button" class="btn btn-secondary"
          @click="changeStateConfirmed($route.params.orderNumber, $route.params.state)">
          {{$t('lifelines-webshop-modal-button-update-state')}}
        </button>
      </template>
    </ConfirmationModal>

    <h1 id="orders-title">{{$t('lifelines-webshop-orders-title')}}</h1>

    <div v-if="hasManagerRole" class="filters form-row">
      <div class="form-group col-md-4">
        <input v-model="orderFilters.text" type="text" id="searchtext" class="form-control" placeholder="Search orders...">
      </div>
      <div class="form-group col-md-2">
        <Dropdown class="dropdown-filter-state" buttonClass="btn-secondary"
          v-model="orderFilters.state"
          :options="stateFilterOptions"
          :title="$t('lifelines-webshop-filter-status')"/>
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
      show-empty
      :items="ordersProvider"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
      :no-local-sorting="true"
    >

      <template v-slot:cell(actions)="data">
        <router-link class="btn btn-secondary btn-sm" tag="button"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="`/shop/${data.item.orderNumber}`">
            <font-awesome-icon icon="edit" aria-label="edit"/>
        </router-link>

        <button class="btn btn-secondary btn-sm copy-btn" type="button"
          @click="handleCopyOrder(data.item.orderNumber)">
          <font-awesome-icon icon="copy" aria-label="copy"/>
        </button>

        <router-link class="btn btn-danger btn-sm t-btn-order-delete" tag="button"
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
          class="dropdown-update-state"
          v-if="hasManagerRole"
          v-model="data.item.state"
          :intend="true"
          :buttonClass="`btn-${classes.state[data.item.state]}`"
          :method="changeStateConfirm.bind(this, data.item)"
          :options="stateOptions"
          :title="$t(data.item.state)"
        />

        <span v-else
          class="badge badge-pill"
          :class="`badge-${classes.state[data.item.state]}`"
        >{{ data.item.state }}</span>
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
import moment from 'moment'

library.add(faEdit, faDownload, faTrash, faCopy)

export default Vue.extend({
  components: { ConfirmationModal, Dropdown, FontAwesomeIcon },
  computed: {
    numberOfOrders: (vm) => vm.orders.length,
    stateFilterOptions: function () {
      return [{ value: '', name: this.$t('lifelines-webshop-state-all') }, ...this.stateOptions]
    },
    tableFields: function () {
      let fields = [
        { key: 'actions', label: '', class: 'td-actions' },
        { key: 'name', label: this.$t('lifelines-webshop-orders-col-header-title'), sortable: true, class: 'td-title' }
      ]

      if (this.hasManagerRole) {
        fields.push({ key: 'email', label: this.$t('lifelines-webshop-orders-col-header-email'), sortable: true, class: 'td-email' })
      }

      fields = fields.concat([
        { key: 'projectNumber', label: this.$t('lifelines-webshop-orders-col-header-project'), sortable: true, class: 'td-project' },
        { key: 'orderNumber', label: this.$t('lifelines-webshop-orders-col-header-order'), sortable: true, class: 'td-order' },
        { key: 'submissionDate', label: this.$t('lifelines-webshop-orders-col-header-sub-date'), sortable: true, class: 'td-submitted' },
        {
          key: 'state',
          class: 'td-state',
          label: this.$t('lifelines-webshop-orders-col-header-state'),
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
  data: function () {
    return {
      classes: {
        state: {
          'Draft': 'secondary',
          'Submitted': 'primary',
          'Approved': 'success',
          'Rejected': 'danger'
        }
      },
      orderFilters: {
        text: '',
        state: ''
      },
      total: 0,
      perPage: 10,
      currentPage: 1,
      stateOptions: [
        { value: 'Draft', name: this.$t('lifelines-webshop-state-draft') },
        { value: 'Rejected', name: this.$t('lifelines-webshop-state-rejected') },
        { value: 'Submitted', name: this.$t('lifelines-webshop-state-submitted') },
        { value: 'Approved', name: this.$t('lifelines-webshop-state-approved') }
      ]
    }
  },
  filters: {
    dateManager: (dateValue) => dateValue ? moment(dateValue).format('L') : '',
    dateShopper: (dateValue) => dateValue ? moment(dateValue).format('LLLL') : ''
  },
  methods: {
    changeStateConfirm: function (order, selectedState) {
      this.$router.push({
        name: 'orderStateChange',
        params: { orderNumber: order.orderNumber, state: selectedState.value }
      })
    },
    changeStateConfirmed: async function (orderNumber, targetState) {
      await this.loadOrder(orderNumber)
      this.changeOrderStatus(targetState)
      await this.save()

      if (targetState === 'Submitted') {
        this.submit()
      } else if (targetState === 'Approved') {
        try {
          await this.sendApproveTrigger(orderNumber)
          this.setToast({ type: 'success', textType: 'light', title: 'Success', timeout: this.$global.toastTimeoutTime, message: `Order ${orderNumber} approved` })
        } catch (err) {
          this.setToast({ type: 'danger', textType: 'light', message: `Order ${orderNumber} approval failed` })
        }
      }

      this.$router.push({ name: 'orders' })
      this.$refs.table.refresh()
    },
    deleteOrderConfirmed: function (orderNumber) {
      this.deleteOrder(orderNumber)
      this.$router.push({ name: 'orders' })
      this.$refs.table.refresh()
    },
    handleCopyOrder: async function (orderNumber) {
      await this.copyOrder(orderNumber)
      this.$refs.table.refresh()
    },
    /**
     * Retrieves orders from the Molgenis API.
     * Please note that only managers have
     * pagination and filtering.
     */
    ordersProvider: async function (ctx, cb) {
      const params = {
        filters: null,
        num: this.hasManagerRole ? ctx.perPage : 10000,
        sortBy: ctx.sortBy,
        sortDesc: ctx.sortDesc,
        start: (ctx.currentPage - 1) * ctx.perPage
      }

      const operands = []

      // Default sorting is on creation data.
      if (!params.sortBy) {
        params.sortBy = 'creationDate'
        params.sortDesc = true
      }

      if (this.orderFilters.text) {
        operands.push({
          operands: [
            { selector: 'email', comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `name`, comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `orderNumber`, comparison: '=like=', arguments: this.orderFilters.text },
            { selector: `projectNumber`, comparison: '=like=', arguments: this.orderFilters.text }
          ],
          operator: 'OR'
        })
      }

      if (this.orderFilters.state) {
        operands.push({ selector: 'state', comparison: '=q=', arguments: this.orderFilters.state })
      }

      if (operands.length) {
        params.filters = { operator: 'AND', operands }
      }

      const response = await this.loadOrders(params)
      this.total = response.total
      return this.orders
    },
    ...mapActions(['save', 'loadOrder', 'updateOrder', 'submit', 'loadOrders', 'deleteOrder', 'sendApproveTrigger', 'copyOrder']),
    ...mapMutations(['changeOrderStatus', 'setToast'])
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

  .td-actions {
    width: 9rem;

    button {
      margin-right: $spacer;
    }
  }

  .td-order {
    width: 10rem;
  }

  .td-project {
    width: 7rem;
  }

  .badge {
    font-size: 0.9rem;
    padding: $spacer $spacer * 2;
  }

  .td-state {
    overflow: visible !important;
    width: 140px;
  }

  @media screen and (max-width: $breakpoint-tablet) {
    .td-email,
    .td-project {
      display: none;
    }
  }

  @media screen and (max-width: $breakpoint-desktop) {
    .td-submitted {
      display: none;
    }
  }
</style>
