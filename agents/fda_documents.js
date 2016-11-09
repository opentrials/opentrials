'use strict';

const opentrialsApi = require('../config').opentrialsApi;
const generateESQueryString = require('../helpers/generate-es-query-string');

function searchFDADocuments(query, page, perPage, filters) {
  const searchQuery = {
    q: generateESQueryString(query, filters),
    page,
    per_page: perPage,
  };

  return opentrialsApi
    .then((client) => client.search.searchFDADocuments(searchQuery))
    .then((response) => response.obj);
}

module.exports = {
  search: searchFDADocuments,
};
