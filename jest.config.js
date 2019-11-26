// Force use of modules in Babel when running tests
// with an external tool like vscode-jest.
process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: [
    '/node_modules/(?!(@molgenis/molgenis-api-client.*))'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  setupFiles: ['<rootDir>/tests/unit/setup.js'],
  collectCoverage: true
}
