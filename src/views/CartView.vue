<template>
  <div id="cart-view" class="row">
      <div class="col">
           <h1>Cart View</h1>

           <ul>
             <li
              v-for="item in selectedVariables"
              :key="item">
              {{item}}
              </li>
           </ul>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CartView',
  computed: {
    selectedVariables () {
      return Object.keys(this.$store.state.gridSelection)
    }
  }
})
</script>
