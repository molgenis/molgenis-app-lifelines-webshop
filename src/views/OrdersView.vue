<template>
  <div id="orders-view" class="container pt-1">
    <toast-component
      class="toast-component mt-2"
      v-if="toast"
      :type="toast.type"
      :message="toast.message"
      @toastCloseBtnClicked="clearToast">
    </toast-component>
    <h1 id="orders-title">{{'lifelines-webshop-orders-title' | i18n}}</h1>
      <spinner-animation v-if="orders === null"/>
      <table v-else class="table" aria-describedby="orders-title">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Title</th>
            <th scope="col">Submitted</th>
            <th scope="col">Project</th>
            <th scope="col">Order</th>
            <th scope="col">Application form</th>
            <th scope="col">State</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="order in orders" :key="order.id">
            <td><router-link v-if="order.state === 'Draft'" class="btn btn-primary btn-sm" :to="`/shop/${order.id}`"><font-awesome-icon icon="edit" aria-label="edit"/></router-link></td>
            <td><button v-if="order.state === 'Draft'" class="btn btn-danger btn-sm" @click="deleteOrder(order.id)"><font-awesome-icon icon="trash" aria-label="delete"/></button></td>
            <td>{{ order.name }}</td>
            <td>{{ order.submissionDate | moment("LLLL") }}</td>
            <td>{{ order.projectNumber }}</td>
            <td>{{ order.orderId }}</td>
            <td><span v-if="order.applicationForm"><a :href="order.applicationForm.url">{{ order.applicationForm.filename }}<font-awesome-icon icon="download" aria-label="download"/></a></span></td>
            <td><span class="badge badge-pill" :class="badgeClass[order.state]">{{ order.state }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SpinnerAnimation from '../components/animations/SpinnerAnimation.vue'
import ToastComponent from '../components/ToastComponent.vue'
import { mapActions, mapState, mapMutations } from 'vuex'

library.add(faEdit, faDownload, faTrash)

export default Vue.extend({
  components: { FontAwesomeIcon, SpinnerAnimation, ToastComponent },
  mounted () {
    this.loadOrders()
  },
  data () {
    return {
      badgeClass: {
        'Draft': 'badge-info',
        'Submitted': 'badge-primary',
        'Approved': 'badge-success',
        'Rejected': 'badge-danger'
      }
    }
  },
  methods: {
    ...mapActions(['loadOrders', 'deleteOrder']),
    ...mapMutations(['clearToast'])
  },
  computed: {
    ...mapState(['orders', 'toast'])
  }
})
</script>
