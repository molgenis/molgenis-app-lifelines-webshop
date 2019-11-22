<template>
  <div class="mg-page">
    <cookie-wall v-if="context.context.showCookieWall"/>
    <header-component :molgenis-menu="molgenisMenu"/>
    <main class="mg-page-content">
      <router-view/>
    </main>
    <footer-component :molgenis-footer="molgenisFooter" />
  </div>
</template>

<script>
import Vue from 'vue'
import HeaderComponent from '../node_modules/@molgenis/molgenis-ui-context/src/components/HeaderComponent.vue'
import FooterComponent from '../node_modules/@molgenis/molgenis-ui-context/src/components/FooterComponent.vue'
import CookieWall from '../node_modules/@molgenis/molgenis-ui-context/src/components/CookieWall.vue'
import '../node_modules/@molgenis/molgenis-ui-context/public/sticky-footer.css'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'app',
  components: { HeaderComponent, FooterComponent, CookieWall },
  computed: {
    ...mapGetters(['molgenisMenu', 'molgenisFooter']),
    ...mapState(['context'])
  }
})
</script>

<style lang="scss">
  @import "scss/bootstrap-lifelines-webshop";
</style>
