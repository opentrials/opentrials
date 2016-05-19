'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getPublication(publicationId) {
  return opentrialsApi
    .then((client) => client.publications.get({ id: publicationId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getPublication,
};
