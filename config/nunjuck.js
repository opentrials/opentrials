const path = require('path');
const nunjucksHapi = require('nunjucks-hapi');
const viewFilters = require('../views/filters');

const viewPath = path.join(__dirname, '..', 'views');
const env = nunjucksHapi.configure(viewPath);

for (const filterName of Object.keys(viewFilters)) {
  env.addFilter(filterName, viewFilters[filterName]);
}

module.exports = {
  engines: {
    html: nunjucksHapi,
  },
  path: viewPath,
};
