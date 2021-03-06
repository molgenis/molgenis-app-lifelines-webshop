// Force use of modules in Babel when running tests
// with an external tool like vscode-jest.
process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.esm?.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@molgenis/molgenis-api-client.*))'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '(@molgenis-ui/components.*)': 'jest-transform-stub',
    '(@molgenis/molgenis-ui-context/src/components/HeaderComponent.vue)': 'jest-transform-stub',
    '(@molgenis/molgenis-ui-context/src/components/FooterComponent.vue)': 'jest-transform-stub',
    '(@molgenis/molgenis-ui-context/src/components/CookieWall.vue)': 'jest-transform-stub'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  globals: {
    'ts-jest': {
      babelConfig: true
    }
  },
  collectCoverage: true,
  setupFiles: ['<rootDir>/tests/unit/setup.js']
}
