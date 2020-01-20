<template>
<div class="c-dropdown dropdown">
  <button :class="buttonClass" class="btn dropdown-toggle" type="button" :id="title"
  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <template v-if="value">
        {{selectedTitle}}
    </template>
    <template v-else>
        {{title}}
    </template>

  </button>
  <div class="dropdown-menu" :aria-labelledby="title">
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
  computed: {
    selectedTitle: function () {
      for (const option of this.options) {
        if (option.value === this.value) {
          return option.name
        }
      }

      return this.title
    }
  },
  data: function () {
    return {
      selected: this.title
    }
  },
  methods: {
    updateModel: function ($e, option) {
      this.$emit('input', option.value)
      if (this.method) {
        this.method(option)
      }
    }
  },
  name: 'Dropdown',
  props: ['buttonClass', 'title', 'options', 'value', 'method']
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
