'use strict';

const webdriver = require('selenium-webdriver');
const should = require('should');
const By = webdriver.By;
const URL = _getServerURL();


describe('(e2e) search', function() {
  let driver;

  before(() => {
    driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).
      build();
  });

  after(() => {
    driver.close();
  });

  it('should work through the basic search flow', () => {
    driver.get(URL);
    driver.findElement(By.css('.search-bar input')).submit();
    driver.findElement(By.css('.search-results .title a')).click();
    return driver.findElement(By.css('.actions .download')).click();
  }).timeout(10000);
});


function _getServerURL() {
  let url = process.env.OPENTRIALS_URL;

  if (!url) {
    const server = require('../../server');
    url = server.info.uri;
  }

  return url;
}
