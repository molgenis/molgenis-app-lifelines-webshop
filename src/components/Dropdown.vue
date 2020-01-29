<template>
<div class="c-dropdown dropdown">

  <button :class="buttonClass" class="btn dropdown-toggle" type="button"
  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <template v-if="value">{{selectedTitle}}</template>
    <template v-else>{{title}}</template>
  </button>

  <div class="dropdown-menu">
    <a class="dropdown-item" :key="option.value"
        @click="updateModel($event, option)"
        v-for="option in options">{{option.name}}
    </a>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'Dropdown',
  props: {
    buttonClass: {
      default: 'btn-secondary',
      type: String
    },
    intend: {
      default: false,
      type: Boolean
    },
    method: {
      default: null,
      type: Function
    },
    options: {
      type: Array
    },
    title: {
      default: 'dropdown',
      type: String
    },
    value: {
      default: '',
      type: String
    }
  },
  data: function () {
    return {
      selected: this.title
    }
  },
  computed: {
    selectedTitle: function () {
      let selected
      for (const option of this.options) {
        if (option.value === this.value) {
          selected = option.name
        }
      }

      return selected
    }
  },
  methods: {
    updateModel: function ($e, option) {
      if (!this.intend) {
        this.$emit('input', option.value)
        Vue.nextTick(() => this.$emit('change', option.value))
      }

      if (this.method) {
        this.method(option)
      }
    }
  }
})
</script>

<style lang="scss">
.c-dropdown {
  .dropdown-menu {
    .dropdown-item {
      &:hover {
        background: $secondary;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}

</style>
