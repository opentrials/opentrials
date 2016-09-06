'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getIntervention(interventionId) {
  return opentrialsApi
    .then((client) => client.interventions.getIntervention({ id: interventionId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getIntervention,
};
