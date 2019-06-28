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
  methods: {
    expand () {
      let height = this.$el.scrollHeight
      this.$el.style.height = height + 'px'
      this.$el.addEventListener('transitionend', (e) => {
        this.$el.removeEventListener('transitionend', his.$el)
        this.$el.style.height = null
      })
      this.$el.classList.add('expanded')
    },
    collapse () {
      let height = this.$el.scrollHeight
      let elementTransition = this.$el.style.transition
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
    state: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    state (newVal) {
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
  .expander {
    transition: height 0.3s ease-out;
    overflow: hidden;
    height: 0
  }
</style>
