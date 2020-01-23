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
        <button type="button" class="btn btn-danger t-btn-confirm-delete"
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
        <button type="button" class="btn btn-secondary t-btn-confirm-state"
          @click="changeStateConfirmed($route.params.orderNumber, $route.params.state)">
          {{$t('lifelines-webshop-modal-button-update-state')}}
        </button>
      </template>
    </ConfirmationModal>

    <h1 id="orders-title">{{$t('lifelines-webshop-orders-title')}}</h1>

    <div v-if="hasManagerRole" class="filters form-row flex-row-reverse">

      <div class="form-group ml-3">
        <search-component
          :searchTerm="table.filters.text"
          :searching="table.isBusy"
          @searchChanged="onSearchChange"
        ></search-component>
      </div>

      <div class="form-group">
        <Dropdown class="dropdown-filter-state"
          :buttonClass="`btn-${classes.state[table.filters.state]}`"
          v-model="table.filters.state"
          :options="stateFilterOptions"
          @change="updateTable"
          :title="$t('lifelines-webshop-filter-status')"/>
      </div>

    </div>

    <b-table
      ref="table"
      striped
      show-empty
      :items="orders"
      :filter="table.filter"
      :fields="tableFields"
      :per-page="0"
      :current-page="table.currentPage"
      :no-local-sorting="true"
      @context-changed="handleContextChanged"
    >

      <template v-slot:cell(actions)="data">
        <router-link class="btn btn-secondary" tag="button"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="`/shop/${data.item.orderNumber}`">
            <font-awesome-icon icon="edit" aria-label="edit"/>
        </router-link>

        <button class="btn btn-secondary copy-btn" type="button"
          @click="handleCopyOrder(data.item.orderNumber)">
          <font-awesome-icon icon="copy" aria-label="copy"/>
        </button>

        <router-link class="btn btn-danger t-btn-order-delete" tag="button"
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
          :buttonClass="`btn-block btn-small btn-${classes.state[data.item.state]}`"
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
      v-model="table.currentPage"
      :total-rows="ordersTotal"
      :per-page="table.perPage"
      @change="handlePaginate">
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
import SearchComponent from '../components/search/SearchComponent.vue'
import Dropdown from '../components/dropdown.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import moment from 'moment'
import { successMessage } from '@/store/helpers'

library.add(faEdit, faDownload, faTrash, faCopy)

export default Vue.extend({
  components: { ConfirmationModal, Dropdown, FontAwesomeIcon, SearchComponent },
  computed: {
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
          formatter: (value, key, item) => item.state,
          sortByFormatted: true
        }
      ])

      return fields
    },
    ...mapState(['orders', 'ordersTotal']),
    ...mapGetters(['hasManagerRole'])
  },
  data: function () {
    return {
      classes: {
        state: {
          '': 'secondary',
          'Draft': 'secondary',
          'Submitted': 'primary',
          'Approved': 'success',
          'Rejected': 'danger'
        }
      },
      table: {
        currentPage: 1,
        filters: { text: '', state: '' },
        isBusy: false,
        perPage: 10,
        sortBy: '',
        sortDesc: true
      },
      total: 0,
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
      this.updateTable()
    },
    deleteOrderConfirmed: function (orderNumber) {
      this.deleteOrder(orderNumber)
      this.$router.push({ name: 'orders' })
    },
    handleContextChanged: function (table) {
      this.table.sortBy = table.sortBy
      this.table.sortDesc = table.sortDesc
      this.updateTable()
    },
    handleCopyOrder: async function (orderNumber) {
      await this.copyOrder(orderNumber)
      this.table.filters.text = ''
      this.table.filters.state = ''
      this.table.sortBy = ''
      this.table.sortDesc = true
      await this.updateTable()
      successMessage(`Order copied to new order ${orderNumber}`, this.$store.commit)
    },
    handlePaginate: function (pageNumber) {
      this.table.currentPage = pageNumber
      this.updateTable()
    },
    onSearchChange: function (searchText) {
      this.table.filters.text = searchText
      this.updateTable()
    },
    /**
     * Retrieves orders from the Molgenis API.
     * Please note that only managers have
     * pagination and filtering.
     */
    updateTable: function () {
      const query = {
        filters: this.table.filters,
        num: this.hasManagerRole ? this.table.perPage : 100,
        sortBy: this.table.sortBy,
        sortDesc: this.table.sortDesc,
        start: (this.table.currentPage - 1) * this.table.perPage
      }

      this.loadOrders(query)
    },
    ...mapActions(['save', 'loadOrder', 'updateOrder', 'submit', 'loadOrders', 'deleteOrder', 'sendApproveTrigger', 'copyOrder']),
    ...mapMutations(['changeOrderStatus', 'setToast'])
  },
  mounted: function () {
    this.updateTable(this.table)
  }
})
</script>

<style lang="scss">
@import "../scss/variables";

#orders-view {
  .filters {
    margin: $spacer 0;
  }

  .td-actions {
    width: 11rem;

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

  .dropdown-filter-state {
    button {
      width: 8rem;
    }
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
}

</style>
