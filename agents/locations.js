'use strict';
const opentrialsApi = require('../config').opentrialsApi;

function listLocations() {
  return opentrialsApi
    .then((client) => client.locations.list())
    .then((response) => response.obj);
}

module.exports = {
  list: listLocations,
};
