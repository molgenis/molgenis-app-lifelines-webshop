<template>
  <div id="grid">
    <h3>Hier komt een grid</h3>
    {{ variables }}
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  methods: {
    ...mapActions(['loadGridData'])
  },
  computed: {
    ...mapState(['treeSelected', 'variables'])
  },
  watch: {
    treeSelected: function (newValue, oldValue) {
      console.log('treeSelected', newValue, oldValue)
      this.loadGridData()
    }
  }
})
</script>
