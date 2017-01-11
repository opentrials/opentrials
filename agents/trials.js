'use strict';

const opentrialsApi = require('../config').opentrialsApi;
const decorateTrial = require('../presenters/trial');
const generateESQueryString = require('../helpers/generate-es-query-string');
const escapeElasticSearch = require('../helpers/escape-elastic-search');

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.getTrial({ id: trialId }))
    .then((response) => decorateTrial(response.obj));
}

function searchTrials(query, page, perPage, filters) {
  const searchQuery = {
    q: generateESQueryString(query, filters),
    page,
    per_page: perPage,
  };

  return opentrialsApi
    .then((client) => client.trials.searchTrials(searchQuery))
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
};
