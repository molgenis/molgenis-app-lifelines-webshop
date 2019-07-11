<template>
  <div class="vld-parent count-view">
    <loading
      v-if="participantCount === null"
      :active="true"
      loader="dots"
      :isFullPage="false"
      >
    </loading>
    <p v-else
      class="lead participant-count"
      >{{participantCount | formatSI}} participants</p>
  </div>
</template>

<style scoped>
.count-view {
  height: 30px
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// @ts-ignore
import { formatSI } from 'format-si-prefix'
// @ts-ignore
import Loading from 'vue-loading-overlay'

export default Vue.extend({
  methods: mapActions(['loadParticipantCount']),
  computed: {
    ...mapState(['participantCount']),
    ...mapGetters(['rsql'])
  },
  watch: {
    rsql () {
      this.loadParticipantCount()
    }
  },
  created () {
    this.loadParticipantCount()
  },
  filters: { formatSI },
  components: { Loading }
})
</script>
