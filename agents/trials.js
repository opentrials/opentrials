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

function searchTrials(query, page) {
  const searchQuery = {
    q: query,
    page,
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
