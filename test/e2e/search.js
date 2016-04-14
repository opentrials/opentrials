'use strict';

const webdriver = require('selenium-webdriver');
const should = require('should');
const By = webdriver.By;
const until = webdriver.until;
const URL = _getServerURL();


describe('(e2e) search', function() {
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

  it('should work through the basic search flow', () => {
    driver.get(URL);
    driver.findElement(By.css('.search-bar input')).submit();
    driver.findElement(By.css('.search-results .title a')).click();
    driver.findElement(By.css('.actions .download')).click();
    return driver.getPageSource()
      .then((body) => should(body).not.containEql('"error"'))
  });

  it('should work with all search filters enabled', () => {
    driver.get(URL);

    driver.findElement(By.css('.toggle-advanced')).click();

    driver.findElement(By.name('q')).sendKeys('query');
    driver.wait(until.elementIsVisible(driver.findElement(By.css('.select2-container input'))));
    driver.findElements(By.css('.select2-container input'))
      .then((elements) => {
        return elements.reduce((resolved, el) => {
          return resolved
            .then(() => el.click())
            .then(() => driver.wait(until.elementLocated(By.css('.select2-results__option--highlighted'))))
            .then((option) => option.click());
        }, Promise.resolve())
      });
    driver.findElement(By.name('sample_size_start')).sendKeys(10);
    driver.findElement(By.name('sample_size_end')).sendKeys(100);
    driver.findElement(By.name('registration_date_start')).sendKeys('2015-01-01');
    driver.findElement(By.name('registration_date_end')).sendKeys('2016-01-01');
    // This is a hacky way of selecting an option in a select box. Please fix
    // it if you find a better way.
    driver.findElement(By.name('gender')).sendKeys('T');
    driver.findElement(By.name('has_published_results')).sendKeys('T');

    driver.findElement(By.css('.search-bar input')).submit();

    return driver.wait(until.titleIs('Search'));
  });
});

function _getServerURL() {
  let url = process.env.OPENTRIALS_URL;

  if (!url) {
    const server = require('../../server');
    url = server.info.uri;
  }

  return url;
}
