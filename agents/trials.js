'use strict';
const opentrialsApi = require('../config').opentrialsApi;

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.get({ id: trialId }))
    .then((response) => response.obj);
}

function generateQueryString(query, filters) {
  const queryValues = Object.keys(filters || {}).reduce((prev, filterName) => {
    const value = filters[filterName];

    return (value) ? [...prev, `${filterName}:"${value}"`] : prev;
  }, []);
  let queryString;

  if (query) {
    queryString = [query, ...queryValues].join(' AND ');
  } else {
    queryString = queryValues.join(' AND ');
  }

  return queryString || undefined;
}

function searchTrials(query, page, perPage, filters) {
  const searchQuery = {
    q: generateQueryString(query, filters),
    page,
    per_page: perPage,
  };

  return opentrialsApi
    .then((client) => client.trials.search(searchQuery))
    .then((response) => response.obj);
}

module.exports = {
  get: getTrial,
  search: searchTrials,
};
