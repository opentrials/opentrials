'use strict';

const Boom = require('boom');
const interventions = require('../agents/interventions');

function interventionsDetails(request, reply) {
  const interventionId = request.params.id;

  interventions.get(interventionId).then((_intervention) => {
    reply.view('interventions-details', {
      title: _intervention.name,
      intervention: _intervention,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Intervention not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = interventionsDetails;
