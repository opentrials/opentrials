'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getPerson(personId) {
  return opentrialsApi
    .then((client) => client.persons.getPerson({ id: personId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getPerson,
};
