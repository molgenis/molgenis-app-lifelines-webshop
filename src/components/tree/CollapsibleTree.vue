<template>
  <div id="tree-component">
    <spinner-animation v-if="structure.length == 0"/>
    <ul v-else class="list-group">
      <template v-for="parent in structure">
        <li
          :key="parent.name"
          class="list-group-item list-group-item-outline-secondary list-group-item-action text-truncate pr-3 py-2 parent-list"
          :title="parent.name"
          role="button"
          @click="toggleCollapse(parent.name)"
          style="z-index: 1"
        >
          <div class="row">
            <div class="text-truncate col pr-0">
              {{parent.name}}
            </div>
            <div class="col-md-auto d-flex align-items-center">
              <collapse-tree-icon
                v-if="hasChildren(parent)"
                class="mr-2"
                :state="parent.name == collapsed"
              />
              <span v-if="parent.count" class="badge badge-pill badge-light float-right align-self-center">{{parent.count}}</span>
            </div>
          </div>
        </li>
        <block-expand :key="'b'+parent.name" :isExpanded="parent.name == collapsed && hasChildren(parent)" class="list-group-item p-0" >
          <ul class="list-group list-group-flush">
            <li
              :class="(value===child.id)&&'active'"
              class="list-group-item list-group-item-outline-secondary list-group-item-action py-1 child-list"
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
        </block-expand>
      </template>
    </ul>

  </div>
</template>

<script>
import Vue from 'vue'
import CollapseTreeIcon from '../animations/CollapseTreeIcon.vue'
import SpinnerAnimation from '../animations/SpinnerAnimation.vue'
import BlockExpand from '../animations/BlockExpand.vue'

export default Vue.extend({
  name: 'CollapsibleTree',
  data: function () {
    return {
      collapsed: ''
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
  computed: {
    hasChildren () {
      return parent => !!parent.children && parent.children.length > 0
    }
  },
  methods: {
    selectElement (id) {
      this.$emit('input', id)
    },
    toggleCollapse (name) {
      if (this.collapsed === name) {
        this.collapsed = ''
      } else {
        this.collapsed = name
      }
    }
  },
  components: { CollapseTreeIcon, SpinnerAnimation, BlockExpand }
})
</script>

<style scoped>
  [role="button"]{
    cursor: pointer;
  }
  .child-list{
    font-weight: lighter;
    padding-left:2.1rem;
  }
  .child-list.active{
    background-color: var(--secondary);
    border-color: var(--secondary);
  }
  .parent-list{
    white-space: nowrap;
  }
  /* Make sure not to get a 2 pixel wide line while using the block-expander in a 'list-group' */
  .block-expander.open {
    margin-top: 0px;
  }
  .block-expander{
    margin-top: -1px;
  }
</style>
