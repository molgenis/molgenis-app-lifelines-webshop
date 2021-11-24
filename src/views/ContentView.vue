<template>
  <div id="content-view">
    <div class="row">
      <div class="col-sm-auto info-bar">
          <h3 class="mg-header" v-if="isSignedIn">{{$t('lifelines-webshop-content-header')}}</h3>
          <h3 class="mg-header" v-else>{{$t('lifelines-webshop-signed-out-content-header')}}</h3>
      </div>
    </div>

    <div class="row flex-nowrap mb-5">
      <tree-view class="col-sm-auto info-bar" />

      <div class="col">
        <toast-component v-if="!this.isSignedIn" :value="toast" :fixed="false" class="my-3"></toast-component>

        <search-component
          :searchTerm="searchTerm"
          :searching="isGridLoading"
          @searchChanged="onSearchChange"
          class="textsearch-box mb-2"
        />

        <div v-if="searchTerm" class="exact-toggle">
          <input type="checkbox" name="exact-match" class="mr-1" v-model="searchExact">
          <label class="form-check-label" for="exact-match">{{$t('lifelines-webshop-textsearch-label')}}</label>
          <info-icon id="textsearch-info-icon" :title="$t('lifelines-webshop-textsearch-info-title')">
            <span v-html="$t('lifelines-webshop-textsearch-info-text')"></span>
          </info-icon>
        </div>
        <div>
            <button v-if="selectedSubsection && searchTerm && searchMessage"
              type="button" class="btn btn-link p-0" @click="handleClearSubsection"
            >{{$t('lifelines-webshop-search-variables-search-all')}}</button>
        </div>

        <div class="no-gutters search-info">
          <span v-html="searchMessage"></span>
        </div>
        <grid-view />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TreeView from './TreeView.vue'
import GridView from './GridView.vue'
import { mapMutations, mapGetters, mapState } from 'vuex'
import SearchComponent from '../components/search/SearchComponent.vue'
import ToastComponent from '@molgenis-ui/components/src/components/ToastComponent.vue'
import InfoIcon from '../components/InfoIcon'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView, InfoIcon, SearchComponent, ToastComponent },
  data: () => {
    return {
      toast: [
        {
          type: 'info',
          textType: 'dark',
          message: 'Please sign in to select and order variables'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isSignedIn', 'isGridLoading']),
    ...mapState([
      'searchTerm',
      'gridVariables',
      'treeSelected',
      'subSectionList'
    ]),
    searchExact: {
      get: function () {
        return this.$store.state.searchExact
      },
      set: function (value) {
        this.$store.state.searchExact = value
      }
    },
    searchMessage: function () {
      if (!this.gridVariables) {
        return ''
      }
      let searchMessage = this.$t('lifelines-webshop-search-variables-found', {
        count: this.gridVariables.length
      })
      if (this.searchTerm) {
        searchMessage +=
          ' ' +
          this.$t('lifelines-webshop-search-variables-term', {
            searchTerm: this.searchTerm
          })
      }

      if (this.selectedSubsection) {
        searchMessage +=
          ' ' +
          this.$t('lifelines-webshop-search-variables-subsection', {
            subSection: this.selectedSubsection
          })
      }
      return `${searchMessage}.`
    },
    selectedSubsection: function () {
      if (this.treeSelected >= 0) {
        return this.subSectionList[this.treeSelected].name
      }
      return null
    }
  },
  methods: {
    ...mapMutations([
      'updateSearchTerm',
      'updateTreeSelection',
      'updateTreeOpenSection'
    ]),
    onSearchChange (value) {
      this.updateSearchTerm(value || null)
    },
    handleClearSubsection () {
      // clear tree selection
      this.updateTreeSelection(-1) // visual change
      this.updateTreeOpenSection(-1) // triggers rsql change
    }
  }
})
</script>

<style lang="scss" scoped>
  .col.tree {
    max-width: 22rem;
  }
</style>
