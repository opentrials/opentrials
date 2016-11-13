'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function getDocument(documentId) {
  return opentrialsApi
    .then((client) => client.documents.getDocument({ id: documentId }))
    .then((response) => response.obj);
}

module.exports = {
  get: getDocument,
};
