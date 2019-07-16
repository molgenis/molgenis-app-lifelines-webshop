<template>
  <div class="block-expander" :class="{open:isExpanded}">
    <slot />
  </div>
</template>

<script>
// based on: https://css-tricks.com/using-css-transitions-auto-dimensions/
import Vue from 'vue'
export default Vue.extend({
  name: 'BlockExpand',
  data: function () {
    return {
      collapsed: ''
    }
  },
  methods: {
    expand () {
      const height = this.$el.scrollHeight
      const self = this
      const test = function () {
        self.$el.removeEventListener('transitionend', test)
        self.$el.style.height = null
      }
      this.$el.style.height = height + 'px'
      this.$el.addEventListener('transitionend', test)
    },
    collapse () {
      const height = this.$el.scrollHeight
      this.$el.style.height = height + 'px'
      requestAnimationFrame(() => {
        this.$el.style.height = 0 + 'px'
      })
    }
  },
  props: {
    isExpanded: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isExpanded (newVal) {
      if (newVal) {
        this.expand()
      } else {
        this.collapse()
      }
    }
  }
})
</script>

<style scoped lang="scss">
  .block-expander {
    transition: height 0.3s ease-out;
    overflow: hidden;
    height: 0;
  }
  .open {
    height: auto;
  }
</style>
