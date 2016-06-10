'use strict';

const Joi = require('joi');

function homepage(request, reply) {
  reply.view('index', {
    title: 'OpenTrials.net',
    advancedSearchIsVisible: request.query.advanced_search,
  });
}

module.exports = {
  handler: homepage,
  validate: {
    query: {
      advanced_search: Joi.boolean().default(false),
    },
  },
};
