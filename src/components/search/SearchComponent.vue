<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">
        <font-awesome-icon v-if="searching" icon="spinner" spin />
        <font-awesome-icon v-else icon="search" />
      </span>
    </div>
    <input class="form-control" type="search" placeholder="Search..." v-model="searchValue" @input="handleSearchValueChange"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import debounce from 'lodash.debounce'
library.add(faSearch)

export default Vue.extend({
  name: 'SearchComponent',
  components: { FontAwesomeIcon },
  props: {
    searching: {
      type: Boolean,
      required: false,
      default: () => false
    },
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
    handleSearchValueChange: debounce(function () {
      if (!this.searchValue || this.searchValue.length >= 3) {
        this.lastSearched = this.searchTerm
        this.$emit('searchChanged', this.searchValue)
      } else if (this.searchValue.length > 0 && this.searchValue.length < 3) {
        this.lastSearched = ''
        this.$emit('searchChanged', '')
      }
    }, 300)
  }
})
</script>
