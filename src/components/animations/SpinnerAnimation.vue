<template>
  <font-awesome-icon
    class="spinner-animation"
    icon="spinner"
    spin
    size="lg"
  />
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faSpinner)

export default Vue.extend({
  name: 'SpinnerAnimation',
  components: { FontAwesomeIcon }
})
</script>

<style lang="scss">
.spinner-animation {
  color: $primary;
}
</style>
