<template>
  <div class="container-fluid">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
export default Vue.extend({
  methods: {
    ...mapActions(['loadVariables'])
  },
  created () {
    this.loadVariables()
  }
})
</script>

<style lang="scss">
  @import "scss/bootstrap-lifelines-webshop.scss";
</style>
