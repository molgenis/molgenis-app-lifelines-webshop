<template>
  <div id="grid">
    <h3>Hier komt een grid</h3>
    <dl>
      <dt>variables</dt><dd>{{ variables.map(it => it.name) }}</dd>
      <dt>rsql</dt><dd>{{ rsql }}</dd>
      <dt>variantCounts</dt><dd>{{ variantCounts }}</dd>
      <dt>gridAssessments</dt><dd>{{ gridAssessments }}</dd>
      <dt>grid</dt><dd>{{grid}}</dd>
    </dl>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  methods: {
    ...mapActions(['loadVariables', 'loadAssessments', 'loadGridData'])
  },
  computed: {
    ...mapState(['treeSelected', 'variables', 'assessments', 'variantCounts']),
    ...mapGetters(['rsql', 'gridAssessments', 'grid'])
  },
  watch: {
    treeSelected: function () {
      this.loadVariables()
    },
    rsql: function () {
      this.loadGridData()
    }
  },
  created () {
    this.loadAssessments()
  }
})
</script>
