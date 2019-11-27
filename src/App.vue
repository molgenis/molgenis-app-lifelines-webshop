<template>
  <div class="mg-page container-fluid">
    <loading
      :active="Boolean(loading)"
      loader="spinner"
      :isFullPage="true"
      color="var(--secondary)"
      background-color="var(--light)"
    />
    <cookie-wall v-if="context.context.showCookieWall"/>
    <header-component :molgenis-menu="molgenisMenu"/>
    <main class="mg-page-content row">
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
import Loading from 'vue-loading-overlay'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'app',
  components: { HeaderComponent, FooterComponent, CookieWall, Loading },
  computed: {
    ...mapGetters(['molgenisMenu', 'molgenisFooter']),
    ...mapState(['context', 'loading'])
  }
})
</script>

<style lang="scss">
  @import "scss/bootstrap-lifelines-webshop";

</style>
