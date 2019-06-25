<template>
  <div id="tree-view">
    <ul class="list-group">
      <template v-for="parent in structure">
        <li
          :key="parent.name"
          class="list-group-item list-group-item-primary list-group-item-action text-truncate pr-3"
          :title="parent.name"
          role="button"
          @click="toggleCollapse(parent.name)"
          style="z-index: 1"
        >
          <div class="row">
            <div class="text-truncate col pr-0">
              <collapse-tree-icon
                v-if="parent.children && parent.children.length > 0"
                class="mr-2"
                :state="parent.name in collapsed"
              />
              {{parent.name}}
            </div>
            <div class="col-md-auto d-flex align-items-center">
              <span class="badge badge-pill badge-light float-right align-self-center">{{parent.count}}</span>
            </div>
          </div>
        </li>

        <transition-expand :key="parent.name+'-children'" >
          <li class="list-group-item p-0" v-if="parent.name in collapsed && parent.children && parent.children.length > 0">
            <ul class="list-group list-group-flush">
              <li
                :class="(value===child.name)&&'active'"
                class="list-group-item list-group-item-secondary list-group-item-action px-3"
                role="button"
                v-for="child in parent.children"
                :key="child.name"
                :title="child.name"
                @click="selectElement(child.id)"
              >
                <div class="row">
                  <div class="text-truncate col pr-0">
                    {{child.name}}
                  </div>
                  <div class="col-md-auto d-flex align-items-center">
                    <span class="badge badge-pill badge-light float-right align-self-center">{{child.count}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </transition-expand>
      </template>
    </ul>

  </div>
</template>

<script>
import Vue from 'vue'
import CollapseTreeIcon from '../animations/CollapseTreeIcon.vue'
import TransitionExpand from '../animations/TransitionExpand.vue'

export default Vue.extend({
  name: 'CollapsibleTree',
  data: function () {
    return {
      collapsed: this.startOpen()
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    structure: {
      type: Array,
      required: true
    }
  },
  methods: {
    startOpen () {
      let toOpen = []
      this.structure.map((item) => { if (item.open) toOpen[item.name] = true })
      return toOpen
    },
    selectElement (id) {
      this.$emit('input', id)
    },
    toggleCollapse (name) {
      if (name in this.collapsed) {
        delete this.collapsed[name]
      } else {
        this.collapsed[name] = true
      }
      this.$forceUpdate()
    }
  },
  components: { TransitionExpand, CollapseTreeIcon }
})
</script>

<style scoped>
  [role="button"]{
    cursor: pointer;
  }
</style>
