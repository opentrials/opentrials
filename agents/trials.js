'use strict';

const escapeElasticSearch = require('../helpers/escape-elastic-search');
const opentrialsApi = require('../config').opentrialsApi;
const decorateTrial = require('../presenters/trial');

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.get({ id: trialId }))
    .then((response) => decorateTrial(response.obj));
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

function searchTrialsByEntity(entityType, entityName) {
  const filters = {};
  filters[entityType] = `"${escapeElasticSearch(entityName)}"`;
  return searchTrials(undefined, 1, 10, filters);
}

module.exports = {
  get: getTrial,
  search: searchTrials,
  searchByEntity: searchTrialsByEntity,
  getRecord,
};
