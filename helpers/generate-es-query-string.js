'use strict';

const escapeElasticSearch = require('./escape-elastic-search');

function generateESQueryString(query, filters) {
  const queryValues = Object.keys(filters || {}).reduce((prev, filterName) => {
    let value = filters[filterName];
    let result = prev;

    if (value !== undefined) {
      if (!Array.isArray(value)) {
        value = [value];
      }
      value = `${filterName}:(${value.join(' OR ')})`;

      result = result.concat(value);
    }

    return result;
  }, []).join(' AND ');

  let queryString;
  if (query) {
    const escapedQuery = escapeElasticSearch(query);
    if (queryValues) {
      queryString = `(${escapedQuery}) AND ${queryValues}`;
    } else {
      queryString = escapedQuery;
    }
  } else {
    queryString = queryValues || undefined;
  }

  return queryString;
}


module.exports = generateESQueryString;
