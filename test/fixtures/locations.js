'use strict';

const uuid = require('node-uuid');

function getLocation() {
  return {
    id: uuid.v1(),
    name: 'Brazil',
    type: 'country',
  };
}

module.exports = getLocation;
