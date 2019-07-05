<template>
    <input class="form-control" type="search" placeholder="Search..." :value="value" @change="handleSeachValueChange"/>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'SearchComponent',
  props: {
    value: {
      type: String
    }
  },
  methods: {
    handleSeachValueChange () {
      $emit('seachChanged', this.value)
    }
  }
})
</script>
