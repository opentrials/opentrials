'use strict';

const Boom = require('boom');
const persons = require('../agents/persons');
const trials = require('../agents/trials');

function personsDetails(request, reply) {
  const personId = request.params.id;

  persons.get(personId).then((_person) => {
    trials.searchByEntity('person', _person.name).then((_trials) => {
      reply.view('persons-details', {
        title: _person.name,
        person: _person,
        trials: _trials,
      });
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Person not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = {
  handler: personsDetails,
};
