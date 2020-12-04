<template>
  <div class="vld-parent count-view">
    <loading v-if="participantCount === null" :active="true" loader="dots" :isFullPage="false"></loading>
    <p
      v-else
      class="lead participant-count"
    >{{participantCount | formatNumber}} {{$t('lifelines-webshop-participant-count-suffix')}}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// @ts-ignore
import { formatNumber } from '@/globals/formatting'
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
  filters: { formatNumber },
  components: { Loading }
})
</script>

<style scoped lang="scss">
.count-view {
  height: 30px;
}

.participant-count {
  font-size: 1.5rem;
}
</style>
