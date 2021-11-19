<template>

  <div id="orders-view" class="pt-1 container-fluid">

    <ConfirmationModal
      v-if="$route && $route.name === 'orderStateChangeBar'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :title="$t('lifelines-webshop-modal-state-header')">

      <template v-slot:body>
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="orderChangeStateProgress" aria-valuemin="0" aria-valuemax="100" :style="{width: orderChangeStateProgress + '%'}"></div>
        </div>
      </template>
    </ConfirmationModal>

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

    <ConfirmationModal
      v-if="$route && $route.name === 'editRequestId'"
      :backRoute="$router.resolve({name: 'orders'}).route"
      :title="$t('lifelines-webshop-modal-request-id-header')">

      <template v-slot:body>
        <form>
          <div class="form-group">
            <label for="exampleFormControlInput1"> {{$t('lifelines-webshop-modal-request-id-input-label')}}</label>
            <input type="text" class="form-control" id="text-id-input" v-model="$route.params.requestId">
          </div>
        </form>
      </template>

      <template v-slot:confirmButton>
        <button type="button" class="btn btn-secondary t-btn-confirm-edit"
          @click="onUpdateRequestId($route.params.orderNumber, $route.params.requestId)">
          {{$t('lifelines-webshop-modal-request-id-confirm-btn-txt')}}
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
      :class="{'order-table':true, 'container-fluid': hasManagerRole}"
      striped
      show-empty
      :busy="table.isBusy"
      :items="orders"
      :filter="table.filter"
      :fields="tableFields"
      :per-page="0"
      :current-page="table.currentPage"
      :no-local-sorting="true"
      @context-changed="handleContextChanged"
    >

      <template v-slot:cell(actions)="data">
        <router-link
          class="btn btn-secondary ml-2"
          tag="button"
          v-b-popover.hover.top="$t('lifelines-webshop-orders-edit-btn-label')"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="`/shop/${data.item.orderNumber}`">
            <font-awesome-icon icon="edit" aria-label="edit"/>
        </router-link>

        <button
        class="btn btn-secondary copy-btn ml-2"
        type="button"
        v-b-popover.hover.top="$t('lifelines-webshop-orders-copy-btn-label')"
          @click="handleCopyOrder(data.item.orderNumber)">
          <font-awesome-icon icon="copy" aria-label="copy"/>
        </button>

        <button
          :disabled="pdfLoadState[data.item.orderNumber]"
          :class="`btn-${classes.pdfLoadState[pdfLoadState[data.item.orderNumber]]}`"
          class="btn btn-secondary pdf-btn ml-2"
          type="button"
          v-b-popover.hover.top="$t('lifelines-webshop-orders-pdf-btn-label')"
          @click="downloadPdf(data.item.orderNumber)">
          <font-awesome-icon v-if="pdfLoadState[data.item.orderNumber] === 'LOADING'" icon="spinner" spin />
          <font-awesome-icon v-else icon="file-pdf" aria-label="pdf" />
        </button>

        <router-link
        class="btn btn-danger t-btn-order-delete ml-2"
        tag="button"
        v-b-popover.hover.top="$t('lifelines-webshop-orders-delete-btn-label')"
          v-if="data.item.state === 'Draft' || hasManagerRole"
          :to="{ name: 'orderDelete', params: {orderNumber: data.item.orderNumber}}">
          <font-awesome-icon icon="trash" aria-label="delete"/>
        </router-link>
      </template>

      <template v-slot:cell(orderNumber)="data">
        <a v-if="hasManagerRole && data.item.contents && data.item.contents.url" :href="data.item.contents.url">
          {{data.item.orderNumber}}
        </a>
        <span v-else>{{data.item.orderNumber}}</span><br>
      </template>

      <template v-slot:cell(applicationForm)="data">
        <a v-if="data.item.applicationForm" :href="data.item.applicationForm.url">
          {{ data.item.applicationForm.filename }} <font-awesome-icon icon="download" aria-label="download"/>
        </a>
      </template>

      <template v-slot:cell(requestId)="data">
        <div class="row">
          <span class="col-6">{{data.item.requestId}}</span>
          <span class="col-6">
            <button
              v-if="hasManagerRole"
              class="btn btn-sm btn-secondary edit-btn"
              type="button"
              @click="showChangeRequestIdModal(data.item)">
                <font-awesome-icon icon="edit" aria-label="edit"/>
            </button>
          </span>
        </div>
      </template>

      <template v-slot:cell(submissionDate)="data">
        <span v-if="hasManagerRole">{{ data.item.submissionDate | dateManager }}</span>
        <span v-else>{{ data.item.submissionDate | dateShopper }}</span>
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
        <h5 v-else>
          <span
            class="badge badge-pill"
           :class="`badge-${classes.state[data.item.state]}`"
          >{{ data.item.state }}</span>
        </h5>
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
import api from '@molgenis/molgenis-api-client'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faDownload, faTrash, faCopy, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { gridSelectionFromCart, successMessage } from '@/store/helpers'
import transforms from '@/store/transforms'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import SearchComponent from '../components/search/SearchComponent.vue'
import Dropdown from '../components/Dropdown.vue'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import axios from 'axios'
import fileDownload from 'js-file-download'
import moment from 'moment'

library.add(faEdit, faDownload, faTrash, faCopy, faFilePdf, faSpinner)

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
        { key: 'applicationForm', label: this.$t('lifelines-webshop-order-applicationform-label'), sortable: true, class: 'td-application-form' },
        { key: 'requestId', label: this.$t('lifelines-webshop-orders-col-header-request-id'), sortable: true, class: 'td-request-id' },
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
        pdfLoadState: {
          'ERROR': 'danger',
          null: 'secondary',
          'LOADING': 'secondary'
        },
        state: {
          '': 'secondary',
          'Draft': 'secondary',
          'Submitted': 'primary',
          'Approved': 'success',
          'Rejected': 'danger'
        }
      },
      orderChangeStateProgress: 0, // [0 - 100]
      pdfLoadState: {},
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
    showChangeRequestIdModal: function (order) {
      this.$router.push({
        name: 'editRequestId',
        params: { orderNumber: order.orderNumber, requestId: order.requestId }
      })
    },
    changeStateConfirmed: async function (orderNumber, targetState) {
      this.orderChangeStateProgress = 0
      this.$router.push({ name: 'orderStateChangeBar' })
      await this.loadOrderAndCart(orderNumber)
      this.orderChangeStateProgress = 20
      this.changeOrderStatus(targetState)
      this.orderChangeStateProgress = 40
      await this.save()
      this.orderChangeStateProgress = 60
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
      this.orderChangeStateProgress = 80
      this.updateTable()
      this.orderChangeStateProgress = 100
      this.$router.push({ name: 'orders' })
    },
    deleteOrderConfirmed: function (orderNumber) {
      this.deleteOrder(orderNumber)
      this.$router.push({ name: 'orders' })
    },
    onUpdateRequestId: async function (orderNumber, requestId) {
      await this.updateRequestId({ orderNumber, requestId })
      this.updateTable()
      this.$router.push({ name: 'orders' })
    },
    downloadPdf: async function (orderNumber) {
      Vue.set(this.pdfLoadState, orderNumber, 'LOADING')

      const [
        order,
        { items: apiVariables1 },
        { items: apiVariables2 },
        { items: apiAssessments },
        { items: apiTree },
        { items: apiSections },
        { items: apiSubSections }
      ] = await Promise.all([
        api.get(`/api/v2/lifelines_order/${orderNumber}`),
        api.get('/api/v2/lifelines_variable?attrs=id,name,subvariable_of,label,subsections&num=10000&sort=id'),
        api.get('/api/v2/lifelines_variable?attrs=id,name,subvariable_of,label,subsections&num=10000&start=10000&sort=id'),
        api.get('/api/v2/lifelines_variable?attrs=id,name,subvariable_of,label,subsections&num=10000&start=20000&sort=id'),
        api.get('/api/v2/lifelines_assessment'),
        api.get('/api/v2/lifelines_tree?num=10000'),
        api.get('/api/v2/lifelines_section?num=10000'),
        api.get('/api/v2/lifelines_sub_section?num=10000')
      ])

      const assessments = transforms.assessments(apiAssessments)
      const sections = transforms.sections(apiSections)
      const sectionTree = transforms.sectionTree(apiTree)
      const subSections = transforms.subSectionList(apiSubSections)
      const variables = transforms.variables([...apiVariables1, ...apiVariables2])

      const cart = await api.get(`/files/${order.contents.id}`)

      let state

      try {
        const gridSelection = gridSelectionFromCart(cart.selection, { assessments, variables })
        const cartTree = transforms.cartTree(gridSelection, sectionTree, sections, subSections, variables)
        state = { assessments, cartTree, filters: cart.filters, gridSelection, order }
      } catch (err) {
        Vue.set(this.pdfLoadState, orderNumber, 'ERROR')
        this.setToast({
          type: 'danger',
          textType: 'light',
          message: this.$t('lifelines-webshop-error-order-inconsistency', { orderNumber })
        })
        throw (err)
      }

      try {
        const res = await axios.post('/vuepdf/', { component: 'orders', state }, { responseType: 'blob' })
        // We could have used URL.createObjectURL manually, but
        // this library takes care of IE/Safari edge cases as well.
        const fileName = `${order.name ? order.name : `order-${order.orderNumber}`}.pdf`
        fileDownload(res.data, fileName, 'application/pdf')
      } catch (err) {
        Vue.set(this.pdfLoadState, orderNumber, 'ERROR')
        this.setToast({
          type: 'danger',
          textType: 'light',
          message: this.$t('lifelines-webshop-error-pdf-service', { orderNumber })
        })
        throw (err)
      }

      Vue.set(this.pdfLoadState, orderNumber, null)
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
    updateTable: async function () {
      this.table.isBusy = true
      const query = {
        filters: this.table.filters,
        num: this.hasManagerRole ? this.table.perPage : 100,
        sortBy: this.table.sortBy,
        sortDesc: this.table.sortDesc,
        start: (this.table.currentPage - 1) * this.table.perPage
      }

      await this.loadOrders(query)
      this.table.isBusy = false
    },
    ...mapActions(['save', 'loadOrderAndCart', 'loadVariables', 'loadAssessments',
      'updateOrder', 'submit', 'loadOrders', 'deleteOrder', 'sendApproveTrigger', 'copyOrder',
      'updateRequestId']),
    ...mapMutations(['changeOrderStatus', 'setToast'])
  },
  mounted: function () {
    this.updateTable(this.table)
  },
  created: async function () {
    await Promise.all([this.loadVariables(), this.loadAssessments()])
  }
})
</script>

<style lang="scss">
@import "../scss/variables";

.btn .fa-spinner {
  width: 12px;
}

#orders-view {
  .filters {
    margin: $spacer 0;
  }

  .order-table {
    min-width: 70rem; // Make sure the table stays big enough to display the 7 rows in smaller devices or browsers
  }

  .td-actions {
    width: 14rem; // Needed to hold the edit, copy and delete button and there margins
  }

  .td-state {
    overflow: visible;
  }
}

</style>
