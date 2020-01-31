<template>
  <div id="cart-view">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-6">
          <h3 class="h4">{{$t('lifelines-webshop-cart-header')}}</h3>

          <toast-component :value="toast" :fixed="false" class="my-3"></toast-component>

          <spinner-animation v-if="loading" />

          <div v-if="selectedVariableIds.length === 0">
            <h4 class="h5">No variables selected</h4>
            <p v-if="isSignedIn">{{$t('lifelines-webshop-cart-info-msg')}}</p>
            <p v-else>{{$t('lifelines-webshop-cart-not-signedin-msg')}}</p>
          </div>

          <div v-else class="mt-3 mb-2" role="tablist">
            <div class="mb-2 d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-primary save"
                @click="onSave"
              >{{$t('lifelines-webshop-save-btn-label')}}</button>
              <router-link
                class="btn btn-success ml-2"
                type="button"
                to="/order"
                tag="button"
              >{{$t('lifelines-webshop-order-btn-label')}}</router-link>
            </div>
            <b-card no-body class="mb-2" v-for="(section, index) in cartTree" :key="section.id">
              <b-card-header
                header-tag="header"
                class="pl-1 pt-2 pr-2 pb-2 hoverable"
                role="tab"
                @click.stop="collapseStatus(index)"
              >
                <h5 class="pl-3 m-0 text-black">
                  {{section.name}}
                  <collapse-tree-icon class="ml-2" :state="isActive(index)"></collapse-tree-icon>
                </h5>
              </b-card-header>

              <!-- Don't use the same accordion index, so all items can be expanded at the same time -->
              <b-collapse
                :visible="isActive(index)"
                :id="`accordion-${index}`"
                :accordion="`my-accordion-${index}`"
                role="tabpanel"
              >
                <b-card-body class="mx-3 my-1">
                  <div v-for="subsection in section.subsections" :key="subsection.id">
                    <h5 class="h6">{{subsection.name}}</h5>
                    <ul>
                      <li v-for="variable in variablesWithSet(subsection.variables)" :key="variable.id" class="set-line" :class="variableSetClass(variable)">
                        <span>{{variable.label||variable.name}} {{ variableAssesments[variable.id] }}</span>
                      </li>
                    </ul>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>

          <div class="mb-3" v-if="selectedVariableIds.length > 10">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-primary save"
                @click="onSave"
              >{{$t('lifelines-webshop-save-btn-label')}}</button>
              <router-link
                class="btn btn-success ml-2"
                type="button"
                to="/order"
                tag="button"
              >{{$t('lifelines-webshop-order-btn-label')}}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SpinnerAnimation from '../components/animations/SpinnerAnimation'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import CollapseTreeIcon from '@/components/animations/CollapseTreeIcon'
import ToastComponent from '@molgenis-ui/components/src/components/ToastComponent.vue'

export default Vue.extend({
  name: 'CartView',
  components: { SpinnerAnimation, CollapseTreeIcon, ToastComponent },
  data () {
    return {
      openItems: ['accordion-0'],
      toast: [{ type: 'warning', textType: 'dark', message: this.$t('lifelines-webshop-cart-empty-variables-warning') }]
    }
  },
  methods: {
    ...mapActions(['save']),
    async onSave () {
      const orderNumber = await this.save()
      this.$router.push({ name: 'load', params: { orderNumber } })
    },
    collapseStatus (index) {
      let clickedItem = `accordion-${index}`
      let indexOfClickedItem = this.openItems.indexOf(clickedItem)

      if (indexOfClickedItem >= 0) {
        this.openItems.splice(indexOfClickedItem, 1)
      } else {
        this.openItems.push(clickedItem)
      }
    },
    isActive (index) {
      let clickedItem = `accordion-${index}`
      return this.openItems.indexOf(clickedItem) >= 0
    },
    variablesWithSet (variables) {
      let isStart = []
      let isEnd = []
      // Find start and endings of variables sets
      let lastSubVariable = variables[0]
      variables.forEach(variable => {
        if (variable.subvariable_of) {
          isStart.push(variable.subvariable_of.id)
        }
        if (lastSubVariable.subvariable_of && !variable.subvariable_of) {
          isEnd.push(lastSubVariable.id)
        }
        lastSubVariable = variable
      })
      // Set flags that are useful for styling
      variables.forEach((variable, index, array) => {
        if (isStart.includes(variable.id)) {
          array[index].startSet = true
        }
        if (isEnd.includes(variable.id)) {
          array[index].endSet = true
        }
      })
      console.log(variables)
      return variables
    },
    variableSetClass (variable) {
      console.log(variable)
      if (variable.startSet) {
        return 'start'
      }
      if (variable.subvariable_of) {
        if (variable.endSet) {
          return 'end'
        }
        return 'line'
      }
      return ''
    }
  },
  computed: {
    ...mapGetters(['cartTree', 'isSignedIn']),
    ...mapState(['gridSelection', 'variables', 'assessments']),
    selectedVariableIds () {
      return Object.keys(this.gridSelection)
    },
    variableAssesments () {
      let variableAssesmentsStings = {}
      for (const [variableId, assessmentIds] of Object.entries(
        this.gridSelection
      )) {
        const assessmentNames = assessmentIds.map(
          assessmentId => this.assessments[assessmentId].name
        )
        variableAssesmentsStings[variableId] =
          '( ' + assessmentNames.join(', ') + ' )'
      }

      return variableAssesmentsStings
    },
    loading () {
      return !(
        Object.keys(this.assessments).length &&
        Object.keys(this.variables).length
      )
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .card {
  ul {
    font-size: 0.9rem;
    list-style: none;
    padding: 0;
  }
}

.hoverable {
  cursor: pointer;
}
.set-line{
  &::after {
    left: -$spacer;
    right: auto;
  }
  &.line, &.end{
    padding-left: 0.75rem;
  }
}
</style>
