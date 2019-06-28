<template>
  <tr>
    <th>
        <span class="label">
          {{label}}
        </span>
    </th>
    <td>
        <facet-option class="selectRow"><font-awesome-icon icon="arrow-right" /></facet-option>
    </td>
    <td :key="index"
        v-for="(count,index) in counts">
          <facet-option
            @facetToggled="$emit('facetToggled', index)"
            :isSelected="selected[index]"
            class="selectItem"
          >
          {{formatter(count)}}
        </facet-option>
    </td>
  </tr>
</template>

<script>
import Vue from 'vue'
import FacetOption from '../facets/FacetOption.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowRight)

export default Vue.extend({
  props: { 
    label: {
      type: String,
      required: true
    },
    counts: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    }
  },
  components: { FacetOption, FontAwesomeIcon },
  methods: {
    formatter (num) {
      return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }
  }
})
</script>

<style scoped>
  .label {
    max-width: 12rem;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
    font-weight: normal;
  }
  th {
    white-space: nowrap;
    vertical-align: middle;
  }
  table td, th{
    padding: 0 1px;
  }
  button{
    display: inline-block;
    margin: 2px;
    width: 3.5rem;
  }
  button.selectItem{
    border-radius: 0;
  }
  button.selectRow{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
