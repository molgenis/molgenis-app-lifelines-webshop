<template>
    <div>
      <h3>Loading</h3>
      <spinner-animation  />
    </div>
</template>

<script>
import Vue from 'vue'
import router from '@/router'
import { mapState } from 'vuex'
import SpinnerAnimation from '@/components/animations/SpinnerAnimation.vue'

export default Vue.extend({
  name: 'HomeView',
  components: { SpinnerAnimation },
  computed: {
    ...mapState(['isContextLoaded', 'isSignedIn'])
  },
  watch: {
    isContextLoaded: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          router.push({ name: this.isSignedIn ? 'orders' : 'shop' })
        }
      },
      immediate: true
    }
  }
})
</script>
