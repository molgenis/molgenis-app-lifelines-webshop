<template>
  <div class="fixed-top">
    <ul class="nav nav-tabs">
      <li class="nav-item pl-4">
        <a class="nav-link" :class="{active: (value === 'variables')}" href="#" @click="$emit('input', 'variables')">
          <font-awesome-icon icon="store"></font-awesome-icon> Shop
        </a>
      </li>
      <li class="nav-item pl-2">
        <a class="nav-link" :class="{active: (value === 'selection')}" href="#" @click="$emit('input', 'selection')">
          <font-awesome-icon icon="shopping-cart"></font-awesome-icon> Cart
          <span class="badge badge-secondary">{{selectedVariables}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStore, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faStore, faShoppingCart)

export default Vue.extend({
  name: 'NavigationBar',
  components: { FontAwesomeIcon },
  props: {
    value: {
      type: String,
      required: true
    },
    selectedVariables: {
      type: Number,
      required: true
    }
  }
})
</script>

<style scoped lang="scss">
  .fixed-top {
    background-color: #fff;
    padding-top: 1.5rem;
    top: 3.95rem;
    z-index: 1029; // zindex-fixed - 1 to fix collision with other fixed menu on mobile / tablet
  }
</style>
