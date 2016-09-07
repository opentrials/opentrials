'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function listSources() {
  return opentrialsApi
    .then((client) => client.sources.list())
    .then((response) => response.obj);
}

module.exports = {
  list: listSources,
};
