'use strict';

require('dotenv').config();
const path = require('path');

const nunjucksHapi = require('nunjucks-hapi');
const viewFilters = require('../views/filters');

const viewPath = path.join(__dirname, '..', 'views');
const env = nunjucksHapi.configure(viewPath);

for (let filterName of Object.keys(viewFilters)) { // eslint-disable-line prefer-const
  env.addFilter(filterName, viewFilters[filterName]);
}

env.addGlobal('googleAnalyticsCode', process.env.GOOGLE_ANALYTICS_CODE);

module.exports = {
  engines: {
    html: nunjucksHapi,
  },
  path: viewPath,
};
