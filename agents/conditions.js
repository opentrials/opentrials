'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getCondition(conditionId) {
  return opentrialsApi
    .then((client) => client.conditions.getCondition({ id: conditionId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getCondition,
};
