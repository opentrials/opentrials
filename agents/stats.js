'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getStats() {
  return opentrialsApi
    .then((client) => client.statistics.getStats())
    .then((response) => response.obj);
}

module.exports = {
  get: getStats,
};
