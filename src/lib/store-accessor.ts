export default function (key:any) {
  return {
    // @ts-ignore
    get () {
      return key.split('.').reduce((pValue:any, cValue:any) => {
        return pValue[cValue]
        // @ts-ignore
      }, this.$root.$store.state)
    },
    set (value:any) {
      var path = key.split('.')
      var length = path.length - 1
      // @ts-ignore
      var store = this.$root.$store.state

      for (var i = 0; i < length; i++) {
        if (store.hasOwnProperty(path[i])) {
          store = store[path[i]]
        }
      }

      store[path[i]] = value
    }
  }
}
