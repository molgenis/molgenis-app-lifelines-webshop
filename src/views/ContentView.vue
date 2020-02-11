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
          class="mb-2"
        ></search-component>
        <div class="row no-gutters search-info">
          <div class="col-8">
            <span>{{searchMessage}}</span>
          </div>
          <div class="col-4 text-right">
            <button type="button" class="btn btn-link p-0" v-if="selectedSubsection" @click="handleClearSubsection">Search all sections</button>
          </div>
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
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import SearchComponent from '../components/search/SearchComponent.vue'
import ToastComponent from '@molgenis-ui/components/src/components/ToastComponent.vue'

export default Vue.extend({
  name: 'ContentView',
  components: { TreeView, GridView, SearchComponent, ToastComponent },
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
        return this.subSectionList[this.treeSelected]
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

<style scoped>
.col.tree {
  max-width: 22rem;
}
</style>
