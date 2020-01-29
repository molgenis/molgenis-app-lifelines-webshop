<template>
  <div class="mg-page">
    <loading
      :active="Boolean(loading)"
      loader="spinner"
      :isFullPage="true"
      color="var(--secondary)"
      background-color="var(--light)"
    />
    <cookie-wall v-if="context.context.showCookieWall"/>
    <header-component :molgenis-menu="molgenisMenu"/>
    <main class="mg-page-content">
      <router-view/>
    </main>
    <footer-component :molgenis-footer="molgenisFooter" />
    <toast-component :value="toast"></toast-component>
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
import ToastComponent from '@molgenis-ui/components/src/components/ToastComponent.vue'

export default Vue.extend({
  name: 'app',
  components: { HeaderComponent, FooterComponent, CookieWall, Loading, ToastComponent },
  computed: {
    ...mapGetters(['molgenisMenu', 'molgenisFooter']),
    ...mapState(['context', 'loading', 'toast'])
  }
})
</script>

<style lang="scss">
  @import "scss/app";

</style>
