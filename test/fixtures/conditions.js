'use strict';

const uuid = require('node-uuid');

function getCondition() {
  const condition = {
    id: uuid.v1(),
    name: 'test condition',
  };

  return condition;
}

module.exports = getCondition;
