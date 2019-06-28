<template>
  <div class="expander">
    <slot />
  </div>
</template>

<script>
// based on: https://css-tricks.com/using-css-transitions-auto-dimensions/
import Vue from 'vue'
export default Vue.extend({
  name: 'BlockExpand',
  props: {
    state: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    state (newVal, oldVal) {
      let height = this.$el.scrollHeight
      if (newVal) {
        this.$el.style.height = height + 'px'
        this.$el.addEventListener('transitionend', (e) => {
          this.$el.removeEventListener('transitionend', his.$el)
          this.$el.style.height = null
        })
      } else {
        let elementTransition = this.$el.style.transition
        this.$el.style.transition = ''
        requestAnimationFrame(() => {
          this.$el.style.height = height + 'px'
          this.$el.style.transition = elementTransition
          requestAnimationFrame(() => {
            this.$el.style.height = 0 + 'px'
          })
        })
      }
    }
  }
})
</script>

<style scoped>
  .expander {
    transition: height 0.3s ease-out;
    overflow: hidden;
    height: 0
  }
</style>
