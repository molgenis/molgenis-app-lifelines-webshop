
const VueTestUtils = require('@vue/test-utils')
VueTestUtils.config.mocks.$t = key => key
