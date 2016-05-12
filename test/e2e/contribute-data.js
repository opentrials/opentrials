'use strict';


const webdriver = require('selenium-webdriver');
const should = require('should');
const By = webdriver.By;
const until = webdriver.until;

describe('(e2e) contribute-data', function() {
  let driver;
  this.timeout(60000);

  before(() => {
    driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).
      build();
  });

  after(() => {
    driver.close();
  });

  it('should allow uploading file and redirect to index page', () => {
    driver.get(`${SERVER_URL}contribute-data`);
    driver.findElement(By.css('#data')).sendKeys(__filename);
    driver.findElement(By.css('#comments')).sendKeys('Some comments');
    driver.findElement(By.css('form')).submit();

    return driver.getCurrentUrl()
      .then((currentUrl) => should(currentUrl).eql(SERVER_URL));
  });
});
