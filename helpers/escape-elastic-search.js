'use strict';

function escapeElasticSearch(query) {
  let result;

  if (query !== undefined) {
    result = query
      .replace(/[*+\-"~?^{}():!/[\]\\]/g, '\\$&')
      .replace(/\|\|/g, '\\||')
      .replace(/&&/g, '\\&&');
  }

  return result;
}

module.exports = escapeElasticSearch;
