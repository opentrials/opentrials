'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getStats() {
  return opentrialsApi
    .then((client) => client.statistics.get())
    .then((response) => response.obj);
}

module.exports = {
  get: getStats,
};
