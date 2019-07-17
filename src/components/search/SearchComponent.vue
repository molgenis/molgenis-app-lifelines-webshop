<template>
    <input class="form-control" type="search" placeholder="Search..." v-model="searchValue" @input="handleSeachValueChange"/>
</template>

<script>
import Vue from 'vue'
import debounce from 'lodash.debounce'

export default Vue.extend({
  name: 'SearchComponent',
  props: {
    searchTerm: {
      type: String,
      required: false,
      default: () => null
    }
  },
  data: function () {
    return {
      searchValue: this.searchTerm
    }
  },
  methods: {
    handleSeachValueChange: debounce(function () {
      this.$emit('seachChanged', this.searchValue)
    }, 300)
  }
})
</script>
