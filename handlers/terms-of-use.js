'use strict';

const Boom = require('boom');
const _ = require('lodash');
const sources = require('../agents/sources');

function termsOfUse(request, reply) {
  sources.list().then((_sources) => (
    reply.view('terms-of-use', {
      title: 'Terms of use',
      sources: _.sortBy(_sources, 'name'),
    })
  )).catch((err) => (
    reply(Boom.badGateway('Error accessing OpenTrials API.', err))
  ));
}

module.exports = {
  handler: termsOfUse,
};
