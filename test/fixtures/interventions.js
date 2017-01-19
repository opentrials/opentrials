'use strict';

const uuid = require('node-uuid');

function getIntervention() {
  const intervention = {
    id: uuid.v1(),
    name: 'test intervention',
  };

  return intervention;
}

module.exports = getIntervention;
