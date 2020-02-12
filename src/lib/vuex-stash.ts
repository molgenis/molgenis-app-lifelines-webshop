import StoreAccessor from './store-accessor'

function plugin (Vue:any) {
  // @ts-ignore
  if (plugin.installed) {
    return
  }

  // Register a helper prototype property for store access.
  Object.defineProperty(Vue.prototype, '$stash', {
    get () {
      return this.$root.$store.state
    }
  })

  // // Register a global mixin to manage the getters/setters for our store.
  Vue.mixin({
    beforeCreate () {
      registerStore(this)
    }
  })
}

function registerStore (vm:any) {
  if (typeof vm.$options.stash !== 'undefined') {
    // Initialize the computed option if it hasn't already been initialized.
    if (typeof vm.$options.computed === 'undefined') {
      vm.$options.computed = {}
    }

    // Check if the store option is a non-empty array.
    if (Array.isArray(vm.$options.stash)) {
      // @ts-ignore
      vm.$options.stash.forEach(property => {
        // @ts-ignores
        vm.$options.computed[property] = new StoreAccessor(property)
      })
    } else {
      // Loop through the store options.
      for (var key in vm.$options.stash) {
        if (typeof vm.$options.stash[key] === 'function') {
          // @ts-ignore
          vm.$options.computed[key] = new StoreAccessor(vm.$options.store[key]())
        } else if (typeof vm.$options.stash[key] === 'string') {
          // @ts-ignore
          vm.$options.computed[key] = new StoreAccessor(vm.$options.stash[key])
        }
      }
    }
  }
}

export default plugin
