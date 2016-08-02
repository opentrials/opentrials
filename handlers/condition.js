'use strict';

const Boom = require('boom');
const conditions = require('../agents/conditions');
const trials = require('../agents/trials');

function conditionsDetails(request, reply) {
  const conditionId = request.params.id;

  conditions.get(conditionId).then((_condition) => {
    trials.searchByEntity('condition', _condition.name).then((_trials) => {
      reply.view('conditions-details', {
        title: _condition.name,
        condition: _condition,
        trials: _trials,
      });
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Condition not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = {
  handler: conditionsDetails,
};
