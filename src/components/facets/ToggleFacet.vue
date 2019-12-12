<template>
  <div class="facet">
      <label v-if="label" :for="facetOptionsId">{{ label }}</label>
      <ul :id="facetOptionsId" class="list-unstyled list-inline">
          <li class="list-inline-item" v-for="option in options" :key=option.value>
            <facet-option :id="option.value" :isSelected="value.includes(option.value)" @facetToggled="handleFacetToggle(option)">{{option.text}}</facet-option>
            <b-popover v-if="option.info || option.href" :target="option.value" triggers="hover blur" placement="bottom" >
              <div class="popover-content">
                {{$t(option.info)}}
                <span class="trailing-link" v-if="option.href"><a :href="$t(option.href)" target="_blank" rel="noopener noreferrer">More info <font-awesome-icon icon="caret-right" /></a></span>
              </div>
            </b-popover>
          </li>
      </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import FacetOption from './FacetOption.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCaretRight)

export default Vue.extend({
  name: 'ToggleFacet',
  components: { FacetOption, FontAwesomeIcon },
  props: {
    facetId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    facetOptionsId () {
      return this.facetId + '-options'
    }
  },
  methods: {
    handleFacetToggle (option) {
      // clone to break reactive loop
      const valueClone = [...this.value]
      if (this.value.includes(option.value)) {
        valueClone.splice(this.value.indexOf(option.value), 1)
      } else {
        valueClone.push(option.value)
      }
      this.$emit('input', valueClone)
    }
  }
})
</script>
