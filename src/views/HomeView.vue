<template>
    <div>
      <h3>Loading</h3>
      <spinner-animation  />
    </div>
</template>

<script>
import Vue from 'vue'
import { router } from '@/router'
import { mapGetters } from 'vuex'
import SpinnerAnimation from '@/components/animations/SpinnerAnimation.vue'

export default Vue.extend({
  name: 'HomeView',
  components: { SpinnerAnimation },
  computed: {
    ...mapGetters(['isSignedIn'])
  },
  mounted () {
    router.push({ name: this.isSignedIn ? 'orders' : 'shop' })
  }
})
</script>
