// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': browser => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#main-view', 5000)
      .assert.elementPresent('div.row > .col-sm-4')
      .assert.elementPresent('div.row > .col-sm-8')
      .end()
  }
}
