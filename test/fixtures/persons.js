'use strict';

const uuid = require('node-uuid');

function getPerson() {
  const person = {
    id: uuid.v1(),
    name: 'test person',
  };

  return person;
}

module.exports = getPerson;
