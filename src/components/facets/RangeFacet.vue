<template>
  <div class="facet range-facet">
    <label :for="rangeFacetId">{{ label }}</label>
    <form>
      <div class="row">
        <div class="col-4">
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="From"
            v-model="sliderValue[0]"
            @change="handleFromChange"
          >
        </div>
        <div class="col-4">
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="Until"
            v-model="sliderValue[1]"
            @change="handleUntilChange"
          >
        </div>
      </div>
    </form>
    <div class="slider-container">
      <vue-slider
        :id="rangeFacetId"
        v-model="sliderValue"
        :min="min"
        :max="max"
        @change="handleSliderChange"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  name: 'RangeFacet',
  components: { VueSlider },
  props: {
    facetId: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false
    },
    min: {
      type: Number,
      required: false,
      default: () => 0
    },
    max: {
      type: Number,
      required: false,
      default: () => 100
    },
    value: {
      type: Array,
      default: () => [0, 100]
    }
  },
  data: function () {
    return {
      sliderValue: [...this.value]
    }
  },
  computed: {
    rangeFacetId () {
      return this.facetId + '-range'
    }
  },
  methods: {
    handleSliderChange (data) {
      // clone to break reactive loop
      this.$emit('input', [...data])
    },
    handleFromChange (data) {
      // clone to break reactive loop
      this.sliderValue[0] = parseInt(data.currentTarget.value, 10)
      this.$emit('input', [...this.sliderValue])
    },
    handleUntilChange (data) {
      // clone to break reactive loop
      this.sliderValue[1] = parseInt(data.currentTarget.value, 10)
      this.$emit('input', [...this.sliderValue])
    }
  }
})
</script>

<style>
.slider-container {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
