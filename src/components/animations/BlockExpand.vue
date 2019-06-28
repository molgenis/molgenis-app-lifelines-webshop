<template>
  <div class="block-expander">
    <slot />
  </div>
</template>

<script>
// based on: https://css-tricks.com/using-css-transitions-auto-dimensions/
import Vue from 'vue'
export default Vue.extend({
  name: 'BlockExpand',
  methods: {
    expand () {
      const height = this.$el.scrollHeight
      this.$el.style.height = height + 'px'
      this.$el.classList.add('expanded')
    },
    collapse () {
      const height = this.$el.scrollHeight
      const elementTransition = this.$el.style.transition
      this.$el.style.transition = ''
      requestAnimationFrame(() => {
        this.$el.style.height = height + 'px'
        this.$el.style.transition = elementTransition
        requestAnimationFrame(() => {
          this.$el.style.height = 0 + 'px'
        })
      })
      this.$el.classList.remove('expanded')
    }
  },
  props: {
    isExpaned: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isExpaned (newVal) {
      if (newVal) {
        this.expand()
      } else {
        this.collapse()
      }
    }
  }
})
</script>

<style scoped>
  .block-expander {
    transition: height 0.3s ease-out;
    overflow: hidden;
    height: 0
  }
</style>
