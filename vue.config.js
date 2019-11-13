// vue.config.js
const i18n = require('./i18n.schemas.js')
const packageJson = require('./package.json')
const BannerPlugin = require('webpack').BannerPlugin
const pkgVersion = packageJson.version
const pkgName = packageJson.name

const now = new Date()
const buildDate = now.toUTCString()
const bannerText = `package-name: ${pkgName}
package-version: ${pkgVersion}
build-date: ${buildDate}`

const config = require('rc')('lifelines', {
  development: {
    proxy: 'https://lifelines.test.molgenis.org'
  }
})

module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production'
    ? pkgName + '/dist/'
    : '/',
  configureWebpack: config => {
    config.plugins.push(
      new BannerPlugin({
        banner: bannerText
      })
    )
  },
  devServer: {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/api': {
        'target': config.development.proxy,
        'keepOrigin': true
      },
      '^/menu': {
        'target': config.development.proxy,
        'keepOrigin': true
      },
      '^/app-ui-context': {
        'target': config.development.proxy,
        'keepOrigin': true
      },
      '^/fonts': {
        'target': config.development.proxy,
        'keepOrigin': true
      },
      '^/img': {
        'target': config.development.proxy,
        'keepOrigin': true
      },
      '^/css': {
        'target': config.development.proxy,
        'changeOrigin': true
      },
      '^/js': {
        'target': config.development.proxy,
        'changeOrigin': true
      },
      '^/logo': {
        'target': config.development.proxy,
        'changeOrigin': true
      },
      '^/login': {
        'target': config.development.proxy,
        'changeOrigin': true
      },
      '^/@molgenis-ui': {
        'target': config.development.proxy,
        'changeOrigin': true
      }
    },
    before: process.env.NODE_ENV === 'development' ? undefined : function (app, server) {
      app.get('/api/v2/i18n/lifelines-webshop/en', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/api/v2/i18n/lifelines-webshop', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/api/v2/i18n/ui-form/en', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/api/v2/i18n/ui-form', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/app-ui-context', function (req, res) {
        res.json(require('./tests/e2e/resources/uiContext.js'))
      })
    }
  }
}
