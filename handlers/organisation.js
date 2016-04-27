'use strict';

const Boom = require('boom');
const organisations = require('../agents/organisations');

function organisationsDetails(request, reply) {
  const organisationId = request.params.id;

  organisations.get(organisationId).then((_organisation) => {
    reply.view('organisations-details', {
      title: _organisation.name,
      organisation: _organisation,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Organisation not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = organisationsDetails;
