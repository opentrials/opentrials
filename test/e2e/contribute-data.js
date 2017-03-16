'use strict';

const webdriver = require('selenium-webdriver');
const should = require('should');

const By = webdriver.By;


describe('(e2e) contribute-data', function () {
  let SERVER_URL;
  let driver;
  this.timeout(60000);

  before(() => {
    SERVER_URL = getServerUrl();
    driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
  });

  after(() => {
    driver.close();
  });

  it('should allow uploading file and redirect to index page', () => {
    driver.get(`${SERVER_URL}contribute-data`);
    driver.findElement(By.css('#data')).sendKeys(__filename);
    driver.findElement(By.css('#url')).sendKeys('http://example.org/data.pdf');
    driver.findElement(By.css('#document_category_id')).sendKeys(webdriver.Key.PAGE_DOWN);
    driver.findElement(By.css('#comments')).sendKeys('This is a test (3c1bb0cd5d67dddc02fae50bf56d3a3a4cbc7204)');
    driver.findElement(By.css('form')).submit();

    return driver.getPageSource()
      .then((body) => should(body).containEql('Thanks for your contribution'));
  });
});
