'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getCondition(conditionId) {
  return opentrialsApi
    .then((client) => client.conditions.get({ id: conditionId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getCondition,
};
