<template>
  <div id="Grid-view">
    <Grid />
  </div>
</template>

<script>
import Vue from 'vue'
import Grid from '../components/grid/GridComponent.vue'

export default Vue.extend({
  name: 'ContentView',
  components: { Grid }
})
</script>
