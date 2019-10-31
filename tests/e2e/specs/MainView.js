// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + 'index.html')
      .waitForElementVisible('#main-view', 5000)
      .assert.elementPresent('div.row > .col')
      .end()
  }
}
