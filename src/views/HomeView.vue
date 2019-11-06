<template>
    <div>
      <h3>Loading catelog context data</h3>
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
          const nextRouteName = this.isSignedIn ? 'orders' : 'shop'
          router.push({ name: nextRouteName })
        }
      },
      immediate: true
    }
  }
})
</script>
