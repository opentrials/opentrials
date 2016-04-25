'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.get({ id: trialId }))
    .then((response) => response.obj);
}

function getRecord(id, trialId) {
  return opentrialsApi
    .then((client) => client.trials.getRecord({ trialId, id }))
    .then((response) => response.obj);
}

function generateQueryString(query, filters) {
  const queryValues = Object.keys(filters || {}).reduce((prev, filterName) => {
    let value = filters[filterName];
    let result = prev;

    if (value) {
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
  getRecord,
};
