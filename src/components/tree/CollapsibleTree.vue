<template>
  <div id="tree-component">
    <ul class="list-group">
      <template v-for="parent in structure">
        <li
          :key="parent.name"
          class="list-group-item list-group-item-outline-secondary list-group-item-action text-truncate pr-3 py-2 parent-list"
          :title="parent.name"
          role="button"
          @click="toggleCollapse(parent.id)"
          style="z-index: 1;"
        >
          <div class="row">
            <div class="text-truncate col pr-0">
              <strong>{{parent.name}}</strong>
            </div>
            <div class="col-md-auto d-flex align-items-center">
              <collapse-tree-icon
                v-if="hasChildren(parent)"
                class="mr-2"
                :state="parent.id == opensection"
              />
            </div>
          </div>
        </li>
        <block-expand :key="'b-'+ parent.name" :isExpanded="parent.id == opensection && hasChildren(parent)" class="list-group-item p-0" >
          <ul class="list-group list-group-flush">
            <li
              :class="{ active: (selection===child.id) }"
              class="list-group-item list-group-item-outline-secondary list-group-item-action py-1 child-list"
              role="button"
              v-for="child in parent.children"
              :key="child.name"
              :title="child.name"
              @click="toggleSubsection(child.id)"
            >
              <div class="row">
                <div class="text-truncate col pr-2">
                  {{child.name}}
                    <info-icon v-if="child.wiki" :id="child.name" :title="child.name" >
                      Visit the <a :href="child.wiki" target="_blank" rel="noopener noreferrer">wiki</a> for more details
                    </info-icon>
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
import BlockExpand from '../animations/BlockExpand.vue'
import InfoIcon from '../InfoIcon'

export default Vue.extend({
  name: 'CollapsibleTree',
  components: { CollapseTreeIcon, BlockExpand, InfoIcon },
  props: {
    selection: {
      type: Number,
      required: true
    },
    structure: {
      type: Array,
      required: true
    },
    opensection: {
      type: Number,
      required: true
    }
  },
  computed: {
    hasChildren () {
      return parent => !!parent.children && parent.children.length > 0
    }
  },
  methods: {
    toggleSubsection (id) {
      if (this.selection === id) {
        this.$emit('updateselection', -1)
      } else {
        this.$emit('updateselection', id)
      }
    },
    toggleCollapse (id) {
      if (this.opensection === id) {
        this.$emit('updateopensection', -1)
        this.$emit('updateselection', -1)
      } else {
        this.$emit('updateopensection', id)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .list-group-item[role="button"] {
    cursor: pointer;
  }

  .child-list {
    font-weight: lighter;
    padding-left: 3.5rem;

    &.active {
      background-color: $secondary;
      border-color: $secondary;
    }
  }

  .parent-list {
    padding-left: 2.5rem;
    white-space: nowrap;
  }

  .block-expander.open {
    margin-top: 0;
  }

  .block-expander {
    margin-top: -1px;
  }

  .list-group-item {
    &::before {
      background-color: transparent;
      border-radius: 50%;
      content: "";
      display: inline-block;
      height: 0.5rem;
      left: 1rem;
      margin-top: -0.25rem;
      position: absolute;
      top: 50%;
      transform: scale(2.5);
      transition: all 0.3s;
      width: 0.5rem;
    }
  }
</style>
