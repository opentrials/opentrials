const Boom = require('boom');
const trials = require('../agents/trials');

function trialsDetails(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((_trial) => {
    reply.view('trials-details', {
      title: _trial.public_title,
      trial: _trial,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Trial not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

function trialsList(request, reply) {
  trials.list().then((_trials) => {
    reply.view('trials-list', {
      title: 'Trials',
      trials: _trials,
    });
  }).catch((err) => {
    reply(Boom.badGateway('Error accessing OpenTrials API.', err));
  });
}

function handler(request, reply) {
  if (request.params.id) {
    trialsDetails(request, reply);
  } else {
    trialsList(request, reply);
  }
}

module.exports = handler;
