'use strict';

function escapeElasticSearch(query) {
  return query
    .replace(/[*+\-"~?^{}():!/[\]\\]/g, '\\$&')
    .replace(/\|\|/g, '\\||')
    .replace(/&&/g, '\\&&');
}

module.exports = escapeElasticSearch;
