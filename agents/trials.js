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

    return (value) ? [...prev, `${filterName}:${value}`] : prev;
  }, []).join(' AND ');
  let queryString;

  if (query) {
    if (queryValues) {
      queryString = `(${query}) AND ${queryValues}`;
    } else {
      queryString = query;
    }
  } else {
    queryString = queryValues || undefined;
  }

  return queryString;
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
