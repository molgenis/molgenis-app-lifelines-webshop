var packageJson = require('./package.json')
const deepmerge = require('deepmerge')

// Shared config for CI env
const ciSettings = {
  launch_url: 'http://ondemand.saucelabs.com:80',
  selenium_port: 80,
  selenium_host: 'ondemand.saucelabs.com',
  silent: true,
  username: process.env.SAUCE_CRED_USR,
  access_key: process.env.SAUCE_CRED_PSW,
  desiredCapabilities: {
    name: packageJson.name,
    build: packageJson.name + '#PR-' + process.env.CHANGE_ID + '-build-' + process.env.BUILD_NUMBER,
    'tunnel-identifier': process.env.TUNNEL_IDENTIFIER
  }
}

// Specific config for different browsers/OS combinations for CI env
const ciChromeSettings = {
  desiredCapabilities: {
    browserName: 'chrome'
  }
}

const ciFirefoxSettings = {
  desiredCapabilities: {
    browserName: 'firefox'
  }
}

const ciSafariSettings = {
  desiredCapabilities: {
    browserName: 'safari'
  }
}

const ciIE11Settings = {
  desiredCapabilities: {
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11.103'
  }
}

module.exports = {
  test_settings: {
    ci_chrome: deepmerge(ciSettings, ciChromeSettings),
    ci_firefox: deepmerge(ciSettings, ciFirefoxSettings),
    ci_safari: deepmerge(ciSettings, ciSafariSettings),
    ci_ie11: deepmerge(ciSettings, ciIE11Settings),
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
        marionette: true
      },
      selenium: {
        cli_args: {
          'webdriver.firefox.driver': require('geckodriver').path
        }
      }
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
