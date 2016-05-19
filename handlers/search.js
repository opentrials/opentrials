'use strict';

const URL = require('url');
const Boom = require('boom');
const _ = require('lodash');
const trials = require('../agents/trials');
const Joi = require('joi');

function getPagination(url, currentPage, perPage, maxPages, totalCount) {
  const getPageUrl = (pageNumber) => {
    const pageUrl = _.omit(url, 'search');
    pageUrl.query.page = pageNumber;
    return URL.format(pageUrl);
  };
  let numberOfPages = Math.ceil(totalCount / perPage);
  if (numberOfPages > maxPages) {
    numberOfPages = maxPages;
  }

  const previousPage = (currentPage > 1) ? currentPage - 1 : 1;
  const nextPage = (currentPage < numberOfPages) ? currentPage + 1 : numberOfPages;
  const visiblePages = 10;
  const halfCountOfVisiblePage = Math.floor((visiblePages - 1) / 2);
  let firstVisiblePage = (currentPage > halfCountOfVisiblePage)
                         ? currentPage - halfCountOfVisiblePage
                         : 1;
  const lastVisiblePage = (firstVisiblePage + visiblePages > numberOfPages)
                          ? numberOfPages
                          : firstVisiblePage + visiblePages - 1;

  if (lastVisiblePage - firstVisiblePage < visiblePages && lastVisiblePage - visiblePages >= 1) {
    firstVisiblePage = lastVisiblePage - visiblePages + 1;
  }

  const pages = _.range(firstVisiblePage, lastVisiblePage + 1).map((pageNumber) => (
    {
      page: pageNumber,
      label: pageNumber,
      url: getPageUrl(pageNumber),
    }
  ));

  if (numberOfPages <= 1) {
    return [];
  }

  return [
    { page: 1, label: '«', url: getPageUrl(1) },
    { page: previousPage, label: '‹', url: getPageUrl(previousPage) },
    ...pages,
    { page: nextPage, label: '›', url: getPageUrl(nextPage) },
    { page: numberOfPages, label: '»', url: getPageUrl(numberOfPages) },
  ];
}

function getFilters(query) {
  const filters = {};
  const quoteElements = (values) => (
    values.map((val) => `"${val}"`)
  );

  if (query.condition) {
    filters.condition = quoteElements(query.condition);
  }
  if (query.intervention) {
    filters.intervention = quoteElements(query.intervention);
  }
  if (query.location) {
    filters.location = quoteElements(query.location);
  }
  if (query.person) {
    filters.person = quoteElements(query.person);
  }
  if (query.organisation) {
    filters.organisation = quoteElements(query.organisation);
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

  const hasPublishedResults = query.has_published_results;
  if (hasPublishedResults) {
    filters.has_published_results = hasPublishedResults;
  }

  return filters;
}

function searchPage(request, reply) {
  const query = request.query;
  const queryStr = query.q;
  const page = (query.page) ? parseInt(query.page, 10) : undefined;
  const perPage = 10;
  const maxPages = 100;
  const filters = getFilters(query);

  trials.search(queryStr, page, perPage, filters).then((_trials) => {
    const currentPage = page || 1;
    const pagination = getPagination(request.url, currentPage,
                                     perPage, maxPages,
                                     _trials.total_count);

    reply.view('search', {
      title: 'Search',
      query,
      currentPage,
      pagination,
      advancedSearchIsVisible: Object.keys(filters).length > 0,
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
      page: Joi.number().integer().min(1).max(100),
      registration_date_start: Joi.date().format('YYYY-MM-DD').empty('').raw(),
      registration_date_end: Joi.date().format('YYYY-MM-DD').empty('').raw(),
      location: Joi.array().single(true).items(Joi.string().empty('')),
      q: Joi.string().empty(''),
      condition: Joi.array().single(true).items(Joi.string().empty('')),
      intervention: Joi.array().single(true).items(Joi.string().empty('')),
      person: Joi.array().single(true).items(Joi.string().empty('')),
      organisation: Joi.array().single(true).items(Joi.string().empty('')),
      gender: Joi.valid(['male', 'female']).empty(''),
      has_published_results: Joi.boolean().empty(''),
      sample_size_start: Joi.number().integer().empty(''),
      sample_size_end: Joi.number().integer().empty(''),
    },
  },
};
