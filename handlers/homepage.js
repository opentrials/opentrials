'use strict';

const Joi = require('joi');

function homepage(request, reply) {
  reply.view('index', {
    title: 'Search for clinical trial data with OpenTrials',
    description: `OpenTrials is a database of information on clinical trials,
                  collected and matched from various sources`,
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
