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
    edge_proxy: 'https://lifelines-catalog.test.molgenis.org/',
    molgenis_proxy: 'https://lifelines-catalog.test.molgenis.org/',
    pdf_proxy: 'https://lifelines-catalog.test.molgenis.org/'
  }
})

module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? pkgName + `${pkgName}/dist/${pkgVersion}` : '/',
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') {
      /*
      Vue-cli's default is `cheap-module-eval-source-map`,
      however breakpoints only work correctly using
      full source-maps. See:

       - https://github.com/vuejs/vue-cli/issues/1806
       - https://webpack.js.org/configuration/devtool/

      Using `source-map` mode comes with a performance hit.
      If needed, this mode can be overriden with:
      DEVTOOL=cheap-module-eval-source-map yarn serve
      */
      config.devtool = process.env.DEVTOOL ? process.env.DEVTOOL : 'source-map'
      console.log(`Sourcemap mode: ${config.devtool}`)
    }

    config.plugins.push(
      new BannerPlugin({
        banner: bannerText
      })
    )
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
        @import "src/scss/variables.scss";
        @import "src/scss/mixins.scss";
        `
      }
    },
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  devServer: {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/vuepdf*': {
        'target': config.development.pdf_proxy,
        'keepOrigin': true
      },
      '^/edge-server*': {
        'target': config.development.edge_proxy,
        'keepOrigin': true
      },
      '^/api': {
        'target': config.development.molgenis_proxy,
        'keepOrigin': true
      },
      '^/menu': {
        'target': config.development.molgenis_proxy,
        'keepOrigin': true
      },
      '^/app-ui-context': {
        'target': config.development.molgenis_proxy,
        'keepOrigin': true
      },
      '^/fonts': {
        'target': config.development.molgenis_proxy,
        'keepOrigin': true
      },
      '^/img': {
        'target': config.development.molgenis_proxy,
        'keepOrigin': true
      },
      '^/css': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      },
      '^/js': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      },
      '^/logo': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      },
      '^/login': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      },
      '^/@molgenis-ui': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      },
      '^/files': {
        'target': config.development.molgenis_proxy,
        'changeOrigin': true
      }
    },
    before: function (app, server) {
      app.get('/api/v2/i18n/lifelines-webshop/en', function (req, res) {
        res.json(i18n.en)
      })
      app.get('/api/v2/i18n/lifelines-webshop', function (req, res) {
        res.json(i18n.en)
      })

      // /api/v2/lifelines_order?num=10&start=0&sort=creationDate:desc
      // E2E tests on Jenkins require this mock response.
      if (process.env.NODE_ENV !== 'development') {
        app.get('/api/v2/i18n/ui-form/en', function (req, res) {
          res.json(i18n.en)
        })
        app.get('/api/v2/i18n/ui-form', function (req, res) {
          res.json(i18n.en)
        })

        const orders = require('./tests/e2e/mocks/orders.js')

        app.get('/api/v2/lifelines_order', function (req, res) {
          res.json(orders)
        })

        app.get('/app-ui-context', function (req, res) {
          res.json(require('./tests/e2e/resources/uiContext.js'))
        })
      }
    }
  }
}
