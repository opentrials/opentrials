'use strict';

const Boom = require('boom');
const interventions = require('../agents/interventions');
const trials = require('../agents/trials');

function interventionsDetails(request, reply) {
  const interventionId = request.params.id;

  interventions.get(interventionId).then((_intervention) => {
    trials.searchByEntity('intervention', _intervention.name).then((_trials) => {
      reply.view('interventions-details', {
        title: _intervention.name,
        intervention: _intervention,
        trials: _trials,
      });
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Intervention not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = {
  handler: interventionsDetails,
};
