'use strict';

const Boom = require('boom');
const persons = require('../agents/persons');

function personsDetails(request, reply) {
  const personId = request.params.id;

  persons.get(personId).then((_person) => {
    reply.view('persons-details', {
      title: _person.name,
      person: _person,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Person not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = personsDetails;
