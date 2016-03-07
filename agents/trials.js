const opentrialsApi = require('../config').opentrialsApi;

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.get({ id: trialId }))
    .then((response) => response.obj);
}

function listTrials() {
  return opentrialsApi
    .then((client) => client.trials.list())
    .then((response) => response.obj);
}

function searchTrials(query, page, perPage) {
  const searchQuery = {
    q: query,
    page,
    per_page: perPage,
  };

  return opentrialsApi
    .then((client) => client.trials.search(searchQuery))
    .then((response) => response.obj);
}

module.exports = {
  get: getTrial,
  list: listTrials,
  search: searchTrials,
};
