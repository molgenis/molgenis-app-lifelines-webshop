<template>
  <div class="fixed-top">
    <ul class="nav nav-tabs">
      <li class="nav-item pl-4">
        <a class="nav-link" :class="{active: (value === 'variables')}" href="#" @click="setActiveTab('variables')">
          <font-awesome-icon icon="store"></font-awesome-icon> Shop
        </a>
      </li>
      <li class="nav-item pl-2">
        <a class="nav-link" :class="{active: (value === 'selection')}" href="#" @click="setActiveTab('selection')">
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
      type: String,
      required: true
    }
  },
  methods: {
    setActiveTab (tab) {
      this.$emit('input', tab)
    }
  }
})
</script>

<style scoped lang="scss">
  @import "../scss/variables";
  .fixed-top{
    top: 60px;
    padding-top: 17px;
    .nav-tabs{
      border-bottom: 4px solid $secondary;
      .nav-link:hover, .nav-link:focus {
        border-bottom: 1px solid transparent;
      }
      .nav-item{
        margin-bottom: -4px;
      }
    }
  }
  .badge.badge-secondary:before{
    display: inline-block;
    content: '';
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-left: -27px;
    margin-top:-25px;
    border: 3px solid $secondary;
    position: absolute;
    filter: blur(3px);
  }
</style>
