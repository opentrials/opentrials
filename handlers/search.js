'use strict';

const Boom = require('boom');
const Joi = require('joi');
const escapeElasticSearch = require('../helpers/escape-elastic-search');
const generatePaginationLinks = require('../helpers/generate-pagination-links');
const trials = require('../agents/trials');

function getFilters(query) {
  const filters = {};
  const quoteAndEscapeElements = (values) => (
    values.map((val) => `"${escapeElasticSearch(val)}"`)
  );

  if (query.condition) {
    filters.condition = quoteAndEscapeElements(query.condition);
  }
  if (query.intervention) {
    filters.intervention = quoteAndEscapeElements(query.intervention);
  }
  if (query.location) {
    filters.location = quoteAndEscapeElements(query.location);
  }
  if (query.person) {
    filters.person = quoteAndEscapeElements(query.person);
  }
  if (query.organisation) {
    filters.organisation = quoteAndEscapeElements(query.organisation);
  }

  const registrationDateStart = query.registration_date_start;
  const registrationDateEnd = query.registration_date_end;
  if (registrationDateStart || registrationDateEnd) {
    const registrationDate = `[${registrationDateStart || '*'} TO ${registrationDateEnd || '*'}]`;
    filters.registration_date = registrationDate;
  }

  const sampleSizeStart = query.sample_size_start;
  const sampleSizeEnd = query.sample_size_end;
  if (sampleSizeStart || sampleSizeEnd) {
    filters.target_sample_size = `[${sampleSizeStart || '*'} TO ${sampleSizeEnd || '*'}]`;
  }

  const gender = query.gender;
  if (gender) {
    filters.gender = `${gender} OR both`;
  }

  const isRegistered = (query.is_registered !== undefined);
  if (isRegistered) {
    filters.is_registered = query.is_registered;
  }

  const hasPublishedResults = (query.has_published_results !== undefined);
  if (hasPublishedResults) {
    filters.has_published_results = query.has_published_results;
  }

  const hasPublications = (query.has_publications !== undefined);
  if (hasPublications) {
    if (query.has_publications) {
      filters._exists_ = filters._exists_ || [];
      filters._exists_.push('publications');
    } else {
      filters._missing_ = filters._missing_ || [];
      filters._missing_.push('publications');
    }
  }

  const hasDiscrepancies = (query.has_discrepancies !== undefined);
  if (hasDiscrepancies) {
    if (query.has_discrepancies) {
      filters._exists_ = filters._exists_ || [];
      filters._exists_.push('discrepancies');
    } else {
      filters._missing_ = filters._missing_ || [];
      filters._missing_.push('discrepancies');
    }
  }

  return filters;
}

function searchPage(request, reply) {
  const query = request.query;
  const queryStr = query.q;
  const page = query.page;
  const perPage = 10;
  const maxPages = 100;
  const filters = getFilters(query);
  const advancedSearch = query.advanced_search || (Object.keys(filters).length > 0);

  trials.search(queryStr, page, perPage, filters).then((_trials) => {
    const currentPage = page || 1;
    const pagination = generatePaginationLinks(
      request.url, currentPage,
      perPage, maxPages,
      _trials.total_count
    );
    const queryDescription = queryStr || 'clinical trial data';
    const title = `Search results for ${queryDescription} in OpenTrials`;
    const description = `OpenTrials has ${_trials.total_count} matches for
                        ${queryDescription} in its clinical trials database`;

    reply.view('search', {
      title,
      description,
      query,
      currentPage,
      pagination,
      advancedSearchIsVisible: advancedSearch,
      trials: _trials,
    });
  }).catch((err) => (
    reply(
      Boom.badGateway('Error accessing OpenTrials API.', err)
    )
  ));
}

module.exports = {
  handler: searchPage,
  validate: {
    query: {
      advanced_search: Joi.boolean().default(false),
      // eslint-disable-next-line newline-per-chained-call
      page: Joi.number().integer().min(1).max(100).empty(''),
      registration_date_start: Joi.alternatives().try(
        Joi.date().format('YYYY-MM-DD').empty('').raw(),
        Joi.string().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').regex(/\d{4}-\d{2}-\d{2}/)
      ),
      registration_date_end: Joi.alternatives().try(
        Joi.date().format('YYYY-MM-DD').empty('').raw(),
        Joi.string().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').regex(/\d{4}-\d{2}-\d{2}/)
      ),
      location: Joi.array().single(true).items(Joi.string().empty('')),
      q: Joi.string().empty(''),
      condition: Joi.array().single(true).items(Joi.string().empty('')),
      intervention: Joi.array().single(true).items(Joi.string().empty('')),
      person: Joi.array().single(true).items(Joi.string().empty('')),
      organisation: Joi.array().single(true).items(Joi.string().empty('')),
      gender: Joi.valid(['male', 'female']).empty(''),
      has_published_results: Joi.boolean().empty(''),
      is_registered: Joi.boolean().empty(''),
      has_publications: Joi.boolean().empty(''),
      has_discrepancies: Joi.boolean().empty(''),
      sample_size_start: Joi.number().integer().empty(''),
      sample_size_end: Joi.number().integer().empty(''),
    },
  },
};
