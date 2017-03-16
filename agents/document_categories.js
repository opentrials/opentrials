'use strict';

const opentrialsApi = require('../config').opentrialsApi;

function listDocumentCategories() {
  return opentrialsApi
    .then((client) => client.document_categories.listDocumentCategories())
    .then((response) => response.obj);
}

module.exports = {
  list: listDocumentCategories,
};
