/* eslint-disable newline-per-chained-call */

'use strict';

const Boom = require('boom');
const Joi = require('joi');
const escapeElasticSearch = require('../../../helpers/escape-elastic-search');
const generatePaginationLinks = require('../../../helpers/generate-pagination-links');
const fdaDocuments = require('../../../agents/fda_documents');

function searchPage(request, reply) {
  const query = request.query;
  const queryStr = query.q;
  const textQuery = query.text;
  const page = query.page;
  const perPage = 10;
  const maxPages = 100;
  const filters = getFilters(query);
  const advancedSearch = (Object.keys(filters).length > 0) || (textQuery !== undefined);

  fdaDocuments.search(queryStr, textQuery, page, perPage, filters)
    .then((docs) => {
      const currentPage = page || 1;
      const pagination = generatePaginationLinks(
        request.url, currentPage,
        perPage, maxPages,
        docs.total_count
      );

      reply.view('fda/index', {
        title: 'Search',
        query,
        currentPage,
        pagination,
        advancedSearchIsVisible: advancedSearch,
        fdaDocuments: docs,
      });
    })
    .catch((err) => (
      reply(
        Boom.badGateway('Error accessing OpenTrials API.', err)
      )
    ));
}


function getFilters(query) {
  const filters = {};
  const quoteAndEscapeElements = (values) => (
    values.map((val) => `"${escapeElasticSearch(val)}"`)
  );

  if (query.drug) {
    filters.drug = escapeElasticSearch(query.drug);
  }
  if (query.active_ingredients) {
    filters.active_ingredients = escapeElasticSearch(query.active_ingredients);
  }
  if (query.name) {
    filters.name = quoteAndEscapeElements(query.name);
  }
  if (query.application_id) {
    filters.application_id = escapeElasticSearch(query.application_id);
  }
  if (query.application_type) {
    filters.application_type = quoteAndEscapeElements(query.application_type);
  }

  const actionDateStart = query.action_date_start;
  const actionDateEnd = query.action_date_end;
  if (actionDateStart || actionDateEnd) {
    const actionDate = `[${actionDateStart || '*'} TO ${actionDateEnd || '*'}]`;
    filters.action_date = actionDate;
  }

  return filters;
}

module.exports = {
  handler: searchPage,
  validate: {
    query: {
      q: Joi.string().empty(''),
      text: Joi.string().empty(''),
      page: Joi.number().integer().min(1).max(100).empty(''),
      action_date_start: Joi.alternatives().try(
        Joi.date().format('YYYY-MM-DD').empty('').raw(),
        Joi.string().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').regex(/\d{4}-\d{2}-\d{2}/)
      ),
      action_date_end: Joi.alternatives().try(
        Joi.date().format('YYYY-MM-DD').empty('').raw(),
        Joi.string().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').regex(/\d{4}-\d{2}-\d{2}/)
      ),
      drug: Joi.string().empty(''),
      active_ingredients: Joi.string().empty(''),
      name: Joi.array().single(true).items(Joi.string().empty('')),
      application_id: Joi.string().empty(''),
      application_type: Joi.array().single(true).items(Joi.string().empty('')),
    },
  },
};
